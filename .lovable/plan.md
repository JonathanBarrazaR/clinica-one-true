

# Plan: Limpieza de datos mock + Tracking de sesiones + Confirmaciones

## Contexto
- Usuario tiene su propia BD Supabase (`clinica_one`) corriendo en local — NO usa Lovable Cloud.
- El `public schema` está vacío, así que entrego **archivo SQL listo para ejecutar** en su Supabase.
- iXRAY (competencia): centro radiológico con módulos de pacientes, médicos, órdenes, imágenes/informes DICOM, reportes diarios, portales paciente/médico. Inspiración para campos extra (RUN como ID, sucursales, prestaciones, convenios).

## 1. Limpiar datos de muestra
Vaciar arrays iniciales en `src/stores/appStore.ts`:
- `pacientes: []`, `ordenes: []`, `citas: []`
También quitar mock arrays de:
- `Sistema.tsx` (tabla `users`)
- `Dashboard.tsx` (`recentOrders`, `chartData` → calcular desde store o mostrar vacío)
- `Reportes.tsx` (datos hardcoded)
- `meson/Inicio.tsx`, `meson/Medicos.tsx` (si tienen mock)
- `admin/Medicos.tsx` (`initialMedicos` → array vacío)

## 2. Tracking de sesiones (tiempo_online / hora_desconexion)

**Frontend** (`useAuth.tsx` + nuevo store `sessionStore.ts`):
- Al `signIn` exitoso: registrar `{ userId, email, role, tiempo_online: now() }` en store + localStorage.
- Al `signOut` (o cierre de pestaña vía `beforeunload`): setear `hora_desconexion: now()`, calcular duración.
- Mantener historial de sesiones por usuario.

**Nueva página** en panel admin: `Sesiones.tsx` (ruta `/admin/sesiones`)
- Tabla: Usuario | Rol | Conexión | Desconexión | Duración | Estado (online/offline).
- Agregar item en `AdminSidebar` (icono `Clock`).

## 3. Esquema SQL para tu Supabase (`clinica_one`)
Crear archivo `supabase/schema.sql` con CREATE TABLE statements para que ejecutes en tu Supabase SQL Editor:

```text
- app_role        ENUM('admin', 'medico', 'meson')
- profiles        (user_id, full_name, rut, email)
- user_roles      (user_id, role) + función has_role()
- pacientes       (id, nombre, rut, telefono, email, ultima_visita,
                  triage_label, triage_score, triage_desc, created_at)
- medicos         (id, nombre, especialidad, email, estado, created_at)
- ordenes         (id, paciente_id, medico_id, fecha, estado, prioridad, descripcion)
- citas           (id, paciente_id, medico_id, fecha, hora, estado, motivo)
- sesiones        (id, user_id, email, role, tiempo_online, hora_desconexion,
                  duracion_segundos, ip_address, user_agent)
- RLS policies en todas las tablas
```

Incluir comentarios indicando qué pegar en SQL Editor de Supabase.

## 4. Pop-up de confirmación al eliminar
Crear componente reutilizable `src/components/ConfirmDeleteDialog.tsx` usando `AlertDialog` de shadcn.

Aplicar en:
- `admin/Pacientes.tsx` — botón eliminar paciente
- `admin/Medicos.tsx` — botón eliminar médico
- `admin/Sistema.tsx` — botón eliminar usuario (agregar acción de eliminar en tabla)
- `meson/Pacientes.tsx` — botón eliminar paciente
- `meson/Ordenes.tsx`, `meson/Citas.tsx` — eliminar

Diálogo: "¿Está seguro que desea eliminar a [nombre]? Esta acción no se puede deshacer." con botones Cancelar / Eliminar (destructivo).

## 5. Gestión de usuarios en Sistema (admin)
Mejorar `Sistema.tsx`:
- Botón "Nuevo Usuario" con dialog (nombre, email, rol, password).
- Acciones por fila: editar, **eliminar (con pop-up de confirmación)**.
- Lista poblada desde el nuevo `userStore`.

## 6. Pequeñas inspiraciones de iXRAY (sin sobrecargar)
- Mantener RUN/RUT como identificador en pacientes (ya existe).
- Dejar comentado en SQL un placeholder para `sucursales`, `prestaciones`, `convenios` por si los implementas después.

## Archivos afectados

**Crear:**
- `supabase/schema.sql`
- `src/components/ConfirmDeleteDialog.tsx`
- `src/stores/sessionStore.ts`
- `src/stores/userStore.ts`
- `src/pages/admin/Sesiones.tsx`
- `src/components/admin/NuevoUsuarioDialog.tsx`

**Modificar:**
- `src/stores/appStore.ts` (vaciar mocks)
- `src/hooks/useAuth.tsx` (registrar sesiones)
- `src/components/layout/AdminSidebar.tsx` (link Sesiones)
- `src/App.tsx` (ruta `/admin/sesiones`)
- `src/pages/admin/Dashboard.tsx`, `Sistema.tsx`, `Medicos.tsx`, `Pacientes.tsx`, `Reportes.tsx`
- `src/pages/meson/Pacientes.tsx`, `Ordenes.tsx`, `Citas.tsx`, `Inicio.tsx`, `Medicos.tsx`
- `README.md` (instrucciones para correr el SQL en Supabase local)

## Notas técnicas
- El tracking de sesión se mantiene 100% client-side (Zustand + localStorage) hasta que conectes Supabase real. El SQL incluye la tabla `sesiones` para cuando migres.
- `beforeunload` no garantiza ejecución; para producción usarás Supabase Realtime + heartbeat, pero por ahora es suficiente.
- No se altera el diseño visual.

