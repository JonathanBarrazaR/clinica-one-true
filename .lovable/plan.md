

# Plan: Replicar CliniaONE - Sistema de Gestión Medica

## Resumen

El repositorio contiene **CliniaONE**, un sistema de gestion medica con tema oscuro (teal/dark blue), autenticacion con Supabase, roles (admin y meson), y multiples paneles para gestion de pacientes, medicos, citas, ordenes, triage y reportes.

## Estructura del proyecto

```text
src/
  hooks/useAuth.tsx           -- AuthProvider con roles
  components/
    ProtectedRoute.tsx        -- Proteccion por rol
    layout/
      AdminLayout.tsx         -- Layout admin con sidebar
      AdminSidebar.tsx        -- Sidebar admin
      MesonLayout.tsx         -- Layout meson con header
      MesonSidebar.tsx        -- Sidebar meson
    admin/
      NuevaOrdenDialog.tsx    -- Dialog crear orden
      NuevoMedicoDialog.tsx   -- Dialog crear medico
      NuevoPacienteDialog.tsx -- Dialog crear paciente
  pages/
    Index.tsx                 -- Landing con links a paneles
    Login.tsx                 -- Login/Signup con tabs
    admin/
      Dashboard.tsx           -- Stats, chart, ordenes recientes
      Pacientes.tsx           -- CRUD pacientes (Supabase)
      Medicos.tsx             -- CRUD medicos (Supabase)
      Reportes.tsx            -- Graficos y tablas
      Sistema.tsx             -- Config del sistema, roles
    meson/
      Inicio.tsx              -- Dashboard meson
      Pacientes.tsx           -- Lista pacientes (mock)
      Medicos.tsx             -- Lista medicos (mock)
      Ordenes.tsx             -- Lista ordenes (mock)
      Citas.tsx               -- Reserva de citas
      Triage.tsx              -- Test de triage interactivo
      Configuracion.tsx       -- Tarjetas de config
  integrations/supabase/
    client.ts                 -- Supabase client
    types.ts                  -- Tipos generados
```

## Pasos de implementacion

### 1. Actualizar tema de colores (index.css)
Reemplazar la paleta actual con el tema oscuro del repo: fondo dark blue (222 47% 11%), primary teal (174 100% 42%), colores custom para success, warning, info.

### 2. Configurar Supabase y migraciones
Habilitar Lovable Cloud y crear las tablas necesarias:
- `profiles` (user_id, full_name, avatar_url, rut)
- `user_roles` (user_id, role enum admin/meson)
- `boxes` (numero, piso, esta_activo)
- `medicos` (user_id, especialidad)
- `pacientes` (nombre, rut, telefono)
- `citas` (paciente_id, medico_id, box_id, fecha, estado, motivo, prioridad)
- `ordenes` (paciente_id, medico_id, fecha, descripcion, estado, notas)
- Funcion `has_role()` security definer
- Trigger para crear profile automaticamente
- RLS policies para cada tabla

### 3. Crear hook useAuth y ProtectedRoute
- AuthProvider con context: user, session, roles, hasRole, signOut
- ProtectedRoute que valida rol requerido

### 4. Crear layouts
- AdminLayout: sidebar izquierdo + outlet
- AdminSidebar: nav con iconos (Dashboard, Pacientes, Medicos, Reportes, Sistema)
- MesonLayout: sidebar + header con busqueda
- MesonSidebar: nav con iconos (Inicio, Pacientes, Medicos, Ordenes, Citas, Triage, Config)

### 5. Crear paginas
- **Login.tsx**: Tabs login/signup con Supabase auth
- **Index.tsx**: Landing con links a panel Admin y panel Meson segun roles
- **Admin**: Dashboard (stats + chart recharts + tabla ordenes), Pacientes (CRUD real con Supabase), Medicos (CRUD real), Reportes (graficos line/pie + tabla), Sistema (config, gestion usuarios/roles)
- **Meson**: Inicio (dashboard), Pacientes, Medicos, Ordenes, Citas, Triage (cuestionario interactivo), Configuracion

### 6. Crear dialogs
- NuevoPacienteDialog: formulario nombre, RUT, telefono
- NuevoMedicoDialog: crea usuario auth + registro medico
- NuevaOrdenDialog: selecciona paciente, medico, fecha, prioridad

### 7. Actualizar App.tsx con rutas
- `/` - Index
- `/login` - Login
- `/admin/*` - Rutas admin protegidas con rol "admin"
- `/meson/*` - Rutas meson protegidas con rol "meson"

## Dependencia externa
El proyecto usa `recharts` para graficos (ya disponible en el proyecto base).

## Notas tecnicas
- La app usa Supabase para auth y datos reales en las paginas admin
- Las paginas meson usan datos mock (hardcoded)
- El tema es completamente dark con acentos teal
- Se necesita Lovable Cloud habilitado para la base de datos

