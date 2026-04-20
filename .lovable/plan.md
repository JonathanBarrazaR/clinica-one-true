
# Plan: Dashboard con visualizador de boxes + reportes individuales por médico

## Objetivo
Agregar al panel admin dos mejoras principales sin cambiar el diseño visual actual:
1. Reorganizar el Dashboard y agregar un visualizador de hasta 5 boxes en tiempo real.
2. Agregar en Reportes un botón para generar reportes individuales por médico, con opción semanal o mensual.

## 1. Actualizar modelo de datos local y SQL

### Frontend/Zustand
Extender `src/stores/appStore.ts` para manejar médicos y boxes desde el estado global:

- Agregar interfaz `Medico`:
  - `id`
  - `nombre`
  - `especialidad`
  - `email`
  - `estado`

- Agregar interfaz `Box`:
  - `id`
  - `numero`
  - `nombre`
  - `estado`: `disponible | ocupado`
  - `medicoId`
  - `pacienteId`
  - `citaId`
  - `horaInicioAsignada`
  - `horaTerminoAsignada`
  - `horaInicioReal`
  - `horaTerminoReal`

- Agregar funciones:
  - `addMedico`
  - `deleteMedico`
  - `addBox`
  - `updateBox`
  - `asignarBox`
  - `liberarBox`

Esto permitirá que el Dashboard, Citas, Órdenes y Reportes usen los mismos datos.

### Supabase SQL
Actualizar `supabase/schema.sql` para preparar la base de datos real:

- Crear tabla `boxes`:
  - `id uuid`
  - `numero integer`
  - `nombre text`
  - `esta_activo boolean`
  - `created_at`

- Crear tabla `box_asignaciones`:
  - `id uuid`
  - `box_id`
  - `medico_id`
  - `paciente_id`
  - `cita_id`
  - `hora_inicio_asignada timestamptz`
  - `hora_termino_asignada timestamptz`
  - `hora_inicio_real timestamptz`
  - `hora_termino_real timestamptz`
  - `estado text`
  - `created_at`

- Agregar políticas RLS:
  - Admin puede gestionar boxes.
  - Admin, mesón y médico pueden leer boxes.
  - Admin y mesón pueden asignar/liberar boxes.

- Agregar una vista o consulta sugerida para calcular horas trabajadas por médico en el mes usando:
  - `hora_inicio_real`
  - `hora_termino_real`
  - si no existe `hora_termino_real`, usar `now()` mientras el box siga ocupado.

## 2. Reorganizar Dashboard admin

Modificar `src/pages/admin/Dashboard.tsx`.

### Cards superiores
Cambiar el layout actual de 4 columnas para que queden en dos filas:

```text
[ Pacientes ] [ Médicos ]
[ Citas Hoy ] [ Órdenes Pendientes ]
```

Implementación:
- Usar `grid gap-4 md:grid-cols-2`.
- El contador de médicos debe venir desde `medicos.length` del store, no desde `"0"` fijo.

### Sección inferior dividida en dos mitades
Debajo de las cards, crear layout:

```text
┌─────────────────────────────┬─────────────────────────────┐
│ Órdenes Recientes            │ Visualizador de Boxes        │
│ 50% ancho                    │ 50% ancho                    │
└─────────────────────────────┴─────────────────────────────┘
```

Implementación:
- Usar `grid gap-6 lg:grid-cols-2`.
- Mantener `Órdenes Recientes` a la izquierda.
- Crear a la derecha una nueva card `Visualizador de Boxes`.

## 3. Crear visualizador de boxes en tiempo real

Crear componente nuevo:

`src/components/admin/BoxVisualizer.tsx`

### Qué mostrará cada box
Mostrar máximo 5 boxes.

Cada box debe mostrar:
- Número o nombre del box.
- Estado:
  - Verde claro si está disponible.
  - Rojo si está ocupado.
- Médico asignado:
  - nombre
  - especialidad
  - email si existe
- Paciente asignado:
  - nombre
  - RUT
  - teléfono/email si existe
- Hora inicio asignada.
- Hora término asignada.
- Hora real de inicio si ya empezó.
- Tiempo transcurrido si está ocupado.
- Indicador de atraso si la hora actual supera la hora asignada.

### Colores
- Disponible:
  - fondo `bg-success/10`
  - borde `border-success/40`
  - texto `text-success`

- Ocupado:
  - fondo `bg-destructive/10`
  - borde `border-destructive/40`
  - texto `text-destructive`

### “Tiempo real”
En frontend se usará un `setInterval` cada 60 segundos para recalcular:
- Tiempo transcurrido.
- Atraso.
- Estado visual.

Esto no reemplaza Supabase Realtime todavía, pero deja la UI lista para conectarla después.

## 4. Conectar boxes con citas

Actualizar `src/pages/meson/Citas.tsx`.

### Campos nuevos al agendar cita
Agregar campos opcionales:
- Box
- Hora término
- Médico seleccionado desde la lista real de médicos del store

Actualmente médico se escribe en un input libre. Se cambiará por un `Select` usando `medicos`.

### Comportamiento
Al crear una cita:
- Se guarda la cita.
- Si el usuario eligió box:
  - Se asigna el box con paciente, médico, cita, hora inicio y hora término.
  - El box queda como `ocupado`.
- Si no eligió box:
  - La cita se crea normalmente sin asignación de box.

### Nota
La conexión real con SQL quedará lista en `schema.sql`, pero por ahora funcionará con Zustand para poder levantarlo local sin depender de tener datos en Supabase.

## 5. Centralizar médicos en el store

Modificar `src/pages/admin/Medicos.tsx`.

Actualmente los médicos viven en `useState` local dentro de la página. Se moverán a `useAppStore`.

Cambios:
- Leer `medicos` desde store.
- Crear médicos con `addMedico`.
- Eliminar médicos con `deleteMedico`.
- Esto permitirá que:
  - Dashboard cuente médicos reales.
  - Citas pueda seleccionar médicos reales.
  - Reportes pueda generar informes por médico.

Actualizar también `src/pages/meson/Medicos.tsx` para mostrar los médicos reales del store en lugar de solo una tabla vacía.

## 6. Agregar reporte individual por médico

Modificar `src/pages/admin/Reportes.tsx`.

### Nuevo botón
Agregar al lado izquierdo de “Reporte Diario” un botón:

```text
Reporte Individual Médico
```

La fila de botones quedará:

```text
[ Reporte Individual Médico ] [ Reporte Diario PDF ] [ Reporte Mensual PDF ]
```

### Flujo del botón
Al hacer clic:
- Abrir un diálogo/modal.
- Seleccionar médico.
- Elegir tipo de reporte:
  - Semanal
  - Mensual
- Botón final: `Descargar PDF`.

### Datos del PDF individual
El PDF debe incluir:
- Nombre del médico.
- Especialidad.
- Email.
- Período:
  - semana actual o mes actual.
- Total de citas atendidas.
- Total de órdenes asociadas.
- Horas trabajadas en boxes durante el período.
- Tabla de citas:
  - paciente
  - fecha
  - hora inicio
  - hora término
  - estado
- Tabla de órdenes:
  - paciente
  - fecha
  - estado
  - prioridad
  - descripción

### Archivo PDF
Nombres sugeridos:
- `reporte_medico_semanal_nombre_fecha.pdf`
- `reporte_medico_mensual_nombre_fecha.pdf`

## 7. Preparar cálculo de horas trabajadas por médico

Agregar helper en frontend, por ejemplo dentro de `Reportes.tsx` o en archivo utilitario:

`src/lib/reportUtils.ts`

Funciones:
- `getCurrentWeekRange()`
- `getCurrentMonthRange()`
- `isDateInRange(date, start, end)`
- `calculateDoctorWorkedSeconds(boxes, medicoId, start, end)`
- `formatDuration(seconds)`

Regla:
- Si el box tiene `horaInicioReal` y `horaTerminoReal`, calcular diferencia.
- Si tiene `horaInicioReal` pero no tiene término y sigue ocupado, calcular hasta `now()`.
- Filtrar solo asignaciones del médico y dentro del período solicitado.

## 8. Mantener listo para Supabase local

Actualizar `README.md` con una sección breve:

- Cómo ejecutar el SQL actualizado en Supabase local.
- Explicar que `boxes` y `box_asignaciones` son las tablas que soportan el visualizador.
- Explicar que el cálculo de horas trabajadas se basa en `hora_inicio_real` y `hora_termino_real`.
- Aclarar que en esta etapa la UI sigue funcionando localmente con Zustand, pero queda preparada para cambiar cada store por consultas Supabase.

## Archivos a modificar

- `src/stores/appStore.ts`
- `src/pages/admin/Dashboard.tsx`
- `src/pages/admin/Reportes.tsx`
- `src/pages/admin/Medicos.tsx`
- `src/pages/meson/Medicos.tsx`
- `src/pages/meson/Citas.tsx`
- `supabase/schema.sql`
- `README.md`

## Archivos nuevos

- `src/components/admin/BoxVisualizer.tsx`
- `src/components/admin/ReporteMedicoDialog.tsx`
- `src/lib/reportUtils.ts`

## Verificación final

Después de implementar:
1. Levantar el proyecto local.
2. Entrar al admin.
3. Confirmar que las cards del Dashboard quedaron en 2x2.
4. Confirmar que `Órdenes Recientes` ocupa la mitad izquierda.
5. Confirmar que `Visualizador de Boxes` ocupa la mitad derecha.
6. Crear un médico.
7. Crear un paciente.
8. Agendar una cita asignando médico y box.
9. Confirmar que el box cambia a rojo/ocupado.
10. Confirmar que un box sin asignación aparece verde/disponible.
11. Ir a Reportes.
12. Descargar PDF diario.
13. Descargar PDF mensual.
14. Descargar reporte individual semanal de un médico.
15. Descargar reporte individual mensual de un médico.
