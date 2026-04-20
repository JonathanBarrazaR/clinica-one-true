-- ============================================================
-- CliniaONE — Esquema SQL para tu Supabase local (clinica_one)
-- ============================================================
-- Pegar este archivo completo en el SQL Editor de tu Supabase
-- y ejecutar. Crea ENUMs, tablas, función has_role y RLS.
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

-- 5. Pacientes
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

-- 6. Médicos
create table if not exists public.medicos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  nombre text not null,
  especialidad text,
  email text,
  estado text default 'activo',
  created_at timestamptz not null default now()
);
alter table public.medicos enable row level security;

-- 7. Órdenes
create table if not exists public.ordenes (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid references public.pacientes(id) on delete cascade,
  medico_id uuid references public.medicos(id) on delete set null,
  fecha date not null default current_date,
  estado text default 'pendiente',
  prioridad text default 'media',
  descripcion text,
  created_at timestamptz not null default now()
);
alter table public.ordenes enable row level security;

-- 8. Citas
create table if not exists public.citas (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid references public.pacientes(id) on delete cascade,
  medico_id uuid references public.medicos(id) on delete set null,
  fecha date not null,
  hora time not null,
  estado text default 'pendiente',
  motivo text,
  created_at timestamptz not null default now()
);
alter table public.citas enable row level security;

-- 9. Sesiones (tracking de conexión/desconexión)
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

-- 10. Boxes clínicos
create table if not exists public.boxes (
  id uuid primary key default gen_random_uuid(),
  numero integer not null unique,
  nombre text not null,
  esta_activo boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.boxes enable row level security;

-- 11. Asignaciones de boxes para medir ocupación y horas trabajadas
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
  estado text not null default 'ocupado',
  created_at timestamptz not null default now()
);
alter table public.box_asignaciones enable row level security;

-- ============================================================
-- RLS Policies
-- ============================================================

-- profiles: el usuario lee/edita su propio perfil; admin ve todo
create policy "profiles self select" on public.profiles
  for select using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));
create policy "profiles self update" on public.profiles
  for update using (auth.uid() = user_id);
create policy "profiles self insert" on public.profiles
  for insert with check (auth.uid() = user_id);

-- user_roles: solo admin gestiona; cada uno ve los suyos
create policy "user_roles self read" on public.user_roles
  for select using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));
create policy "user_roles admin manage" on public.user_roles
  for all using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- pacientes: admin y meson gestionan; medico lee
create policy "pacientes read" on public.pacientes
  for select using (
    public.has_role(auth.uid(), 'admin')
    or public.has_role(auth.uid(), 'meson')
    or public.has_role(auth.uid(), 'medico')
  );
create policy "pacientes write" on public.pacientes
  for all using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'meson'))
  with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'meson'));

-- medicos
create policy "medicos read" on public.medicos for select using (auth.uid() is not null);
create policy "medicos admin write" on public.medicos
  for all using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- ordenes
create policy "ordenes read" on public.ordenes for select using (auth.uid() is not null);
create policy "ordenes write" on public.ordenes
  for all using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'meson'))
  with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'meson'));

-- citas
create policy "citas read" on public.citas for select using (auth.uid() is not null);
create policy "citas write" on public.citas
  for all using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'meson'))
  with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'meson'));

-- sesiones: usuario inserta la suya; admin ve todas
create policy "sesiones self insert" on public.sesiones
  for insert with check (auth.uid() = user_id);
create policy "sesiones self update" on public.sesiones
  for update using (auth.uid() = user_id);
create policy "sesiones read" on public.sesiones
  for select using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

-- boxes: admin gestiona; admin, meson y medico leen
create policy "boxes read" on public.boxes for select using (
  public.has_role(auth.uid(), 'admin')
  or public.has_role(auth.uid(), 'meson')
  or public.has_role(auth.uid(), 'medico')
);
create policy "boxes admin manage" on public.boxes
  for all using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- box_asignaciones: admin/meson gestionan; médico puede leer
create policy "box_asignaciones read" on public.box_asignaciones for select using (
  public.has_role(auth.uid(), 'admin')
  or public.has_role(auth.uid(), 'meson')
  or public.has_role(auth.uid(), 'medico')
);
create policy "box_asignaciones manage" on public.box_asignaciones
  for all using (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'meson'))
  with check (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'meson'));

-- Consulta sugerida: horas trabajadas por médico este mes
-- select medico_id,
--   sum(extract(epoch from (coalesce(hora_termino_real, now()) - hora_inicio_real))) / 3600 as horas_trabajadas
-- from public.box_asignaciones
-- where hora_inicio_real >= date_trunc('month', now())
--   and estado in ('ocupado', 'finalizado')
-- group by medico_id;

-- ============================================================
-- TODO (futuro, inspirado en iXRAY) — descomentar al implementar
-- ============================================================
-- create table if not exists public.sucursales ( id uuid primary key default gen_random_uuid(), nombre text, direccion text );
-- create table if not exists public.prestaciones ( id uuid primary key default gen_random_uuid(), codigo text, nombre text, precio numeric );
-- create table if not exists public.convenios ( id uuid primary key default gen_random_uuid(), nombre text, descuento numeric );
