# CliniaONE — Sistema de Gestión Médica

Sistema de gestión clínica con paneles para administrador y mesón (recepción), inspirado por iXRAY.

## Levantar el proyecto en local

```bash
npm install
cp .env.example .env   # luego edita .env con tus credenciales de Supabase
npm run dev
```

Abre http://localhost:5173

### Credenciales mock (mientras no conectes Supabase)

- **Admin**: `admin@cliniaone.com` / `admin123`
- **Mesón**: `meson@cliniaone.com` / `meson123`

## Conectar tu Supabase local (`clinica_one`)

1. En tu instancia Supabase abre el **SQL Editor**.
2. Pega y ejecuta el contenido de [`supabase/schema.sql`](./supabase/schema.sql). Crea:
   - ENUM `app_role` (admin / medico / meson)
   - Tablas: `profiles`, `user_roles`, `pacientes`, `medicos`, `ordenes`, `citas`, `sesiones`
   - Función `has_role()` y políticas RLS
3. Configura las variables en `.env`:
   ```
   VITE_SUPABASE_URL=http://localhost:54321
   VITE_SUPABASE_ANON_KEY=tu-anon-key
   ```
4. Reemplaza el mock auth en `src/hooks/useAuth.tsx` por `supabase.auth.signInWithPassword(...)` y los stores Zustand por consultas reales a las tablas correspondientes.

## Funcionalidades

- **Pacientes** — alta/baja con confirmación, triage opcional al registrar.
- **Órdenes** — creación vinculada a paciente + médico.
- **Citas** — agendamiento con paciente seleccionable.
- **Triage** — flujo guiado con resultado de urgencia, asociado al paciente.
- **Reportes** — descarga PDF diario y mensual (jspdf + autotable).
- **Sesiones** (admin) — registra `tiempo_online` y `hora_desconexion` de cada usuario.
- **Pop-ups de confirmación** al eliminar pacientes, médicos, órdenes, citas y usuarios.

## Stack

React 18 · Vite · TypeScript · TailwindCSS · shadcn/ui · Zustand · React Router · jsPDF · Supabase.
