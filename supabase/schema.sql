-- ============================================================
-- CliniaONE — Esquema SQL para Supabase (clinica_one)
-- ============================================================
-- Pegar este archivo completo en el SQL Editor de tu Supabase
-- y ejecutar. Crea ENUMs, tablas, triggers, función has_role y RLS.
-- ============================================================

-- 1. ENUM de roles
do $$ begin
  create type public.app_role as enum ('admin', 'medico', 'meson');
exception when duplicate_object then null; end $$;

-- 2. Perfiles
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  rut text unique,
  email text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- 3. Roles de usuario
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

-- Índice para optimizar consultas de roles
create index if not exists idx_user_roles_user_id on public.user_roles(user_id);

-- 4. Función SECURITY DEFINER para evitar recursión RLS
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  );
$$;

-- 5. Trigger: auto-crear perfil al registrar usuario
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email)
  on conflict (user_id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 6. Pacientes
create table if not exists public.pacientes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  rut text unique not null,
  telefono text,
  email text,
  ultima_visita date,
  triage_label text,
  triage_score numeric,
  triage_desc text,
  created_at timestamptz not null default now()
);
alter table public.pacientes enable row level security;

-- 7. Médicos
create table if not exists public.medicos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  nombre text not null,
  especialidad text,
  email text,
  estado text not null default 'activo' check (estado in ('activo', 'inactivo', 'licencia')),
  created_at timestamptz not null default now()
);
alter table public.medicos enable row level security;

-- 8. Órdenes
create table if not exists public.ordenes (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid references public.pacientes(id) on delete cascade,
  medico_id uuid references public.medicos(id) on delete set null,
  fecha date not null default current_date,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'en_proceso', 'completada', 'cancelada')),
  prioridad text not null default 'media' check (prioridad in ('baja', 'media', 'alta', 'urgente')),
  descripcion text,
  created_at timestamptz not null default now()
);
alter table public.ordenes enable row level security;

-- 9. Citas
create table if not exists public.citas (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid references public.pacientes(id) on delete cascade,
  medico_id uuid references public.medicos(id) on delete set null,
  fecha date not null,
  hora time not null,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'confirmada', 'en_curso', 'completada', 'cancelada')),
  motivo text,
  created_at timestamptz not null default now()
);
alter table public.citas enable row level security;

-- 10. Sesiones (tracking de conexión/desconexión)
create table if not exists public.sesiones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  email text,
  role public.app_role,
  tiempo_online timestamptz not null default now(),
  hora_desconexion timestamptz,
  duracion_segundos integer,
  ip_address text,
  user_agent text
);
alter table public.sesiones enable row level security;

-- 11. Boxes clínicos
create table if not exists public.boxes (
  id uuid primary key default gen_random_uuid(),
  numero integer not null unique,
  nombre text not null,
  esta_activo boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.boxes enable row level security;

-- 12. Asignaciones de boxes
create table if not exists public.box_asignaciones (
  id uuid primary key default gen_random_uuid(),
  box_id uuid not null references public.boxes(id) on delete cascade,
  medico_id uuid references public.medicos(id) on delete set null,
  paciente_id uuid references public.pacientes(id) on delete set null,
  cita_id uuid references public.citas(id) on delete set null,
  hora_inicio_asignada timestamptz,
  hora_termino_asignada timestamptz,
  hora_inicio_real timestamptz,
  hora_termino_real timestamptz,
  estado text not null default 'ocupado' check (estado in ('ocupado', 'finalizado', 'cancelado')),
  created_at timestamptz not null default now()
);
alter table public.box_asignaciones enable row level security;

-- ============================================================
-- RLS Policies
-- ============================================================

-- profiles: el usuario lee/edita su propio perfil; admin ve todo y puede insertar
do $$ begin
  create policy "profiles self select" on public.profiles
    for select using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "profiles self update" on public.profiles
    for update using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "profiles self insert" on public.profiles
    for insert with check (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));
exception when duplicate_object then null; end $$;

-- user_roles: solo admin gestiona; cada uno ve los suyos
do $$ begin
  create policy "user_roles self read" on public.user_roles
    for select using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "user_roles admin manage" on public.user_roles
    for all using (public.has_role(auth.uid(), 'admin'))
    with check (public.has_role(auth.uid(), 'admin'));
exception when duplicate_object then null; end $$;

-- pacientes: admin y meson gestionan; medico lee
do $$ begin
  create policy "pacientes read" on public.pacientes
    for select using (
      public.has_role(auth.uid(), 'admin')
      or public.has_role(auth.uid(), 'meson')
      or public.has_role(auth.uid(), 'medico')
    );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "pacientes write" on public.pacientes
    for all using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'meson'))
    with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'meson'));
exception when duplicate_object then null; end $$;

-- medicos
do $$ begin
  create policy "medicos read" on public.medicos for select using (auth.uid() is not null);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "medicos admin write" on public.medicos
    for all using (public.has_role(auth.uid(), 'admin'))
    with check (public.has_role(auth.uid(), 'admin'));
exception when duplicate_object then null; end $$;

-- ordenes
do $$ begin
  create policy "ordenes read" on public.ordenes for select using (auth.uid() is not null);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "ordenes write" on public.ordenes
    for all using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'meson'))
    with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'meson'));
exception when duplicate_object then null; end $$;

-- citas
do $$ begin
  create policy "citas read" on public.citas for select using (auth.uid() is not null);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "citas write" on public.citas
    for all using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'meson'))
    with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'meson'));
exception when duplicate_object then null; end $$;

-- sesiones: usuario inserta la suya; admin ve todas
do $$ begin
  create policy "sesiones self insert" on public.sesiones
    for insert with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "sesiones self update" on public.sesiones
    for update using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "sesiones read" on public.sesiones
    for select using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));
exception when duplicate_object then null; end $$;

-- boxes: admin gestiona; admin, meson y medico leen
do $$ begin
  create policy "boxes read" on public.boxes for select using (
    public.has_role(auth.uid(), 'admin')
    or public.has_role(auth.uid(), 'meson')
    or public.has_role(auth.uid(), 'medico')
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "boxes admin manage" on public.boxes
    for all using (public.has_role(auth.uid(), 'admin'))
    with check (public.has_role(auth.uid(), 'admin'));
exception when duplicate_object then null; end $$;

-- box_asignaciones: admin/meson gestionan; médico puede leer
do $$ begin
  create policy "box_asignaciones read" on public.box_asignaciones for select using (
    public.has_role(auth.uid(), 'admin')
    or public.has_role(auth.uid(), 'meson')
    or public.has_role(auth.uid(), 'medico')
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "box_asignaciones manage" on public.box_asignaciones
    for all using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'meson'))
    with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'meson'));
exception when duplicate_object then null; end $$;

-- ============================================================
-- Consulta sugerida: horas trabajadas por médico este mes
-- ============================================================
-- select medico_id,
--   sum(extract(epoch from (coalesce(hora_termino_real, now()) - hora_inicio_real))) / 3600 as horas_trabajadas
-- from public.box_asignaciones
-- where hora_inicio_real >= date_trunc('month', now())
--   and estado in ('ocupado', 'finalizado')
-- group by medico_id;

-- ============================================================
-- TODO (futuro) — descomentar al implementar
-- ============================================================
-- create table if not exists public.sucursales ( id uuid primary key default gen_random_uuid(), nombre text, direccion text );
-- create table if not exists public.prestaciones ( id uuid primary key default gen_random_uuid(), codigo text, nombre text, precio numeric );
-- create table if not exists public.convenios ( id uuid primary key default gen_random_uuid(), nombre text, descuento numeric );
