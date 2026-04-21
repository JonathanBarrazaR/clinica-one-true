
# Plan: Reparar Pacientes y revisar funcionamiento de las demás pestañas

## Problema encontrado
El botón **Nuevo Paciente** sí abre el formulario y muestra el aviso “Paciente creado”, pero el paciente no aparece en la lista porque el formulario `NuevoPacienteDialog` tiene esta lógica:

- Si recibe `onSubmit`, usa ese `onSubmit`.
- Si no recibe `onSubmit`, recién ahí llama a `addPaciente`.

Actualmente:
- En **Admin > Pacientes**, se pasa `onSubmit`, pero ese handler solo actualiza cuando hay un paciente en edición. Cuando es paciente nuevo, no llama a `addPaciente`.
- En **Mesón > Pacientes**, se pasa `onSubmit={() => {}}`, o sea una función vacía. Por eso tampoco llama a `addPaciente`.

Resultado: el formulario dice que creó el paciente, pero realmente no lo guarda en el store.

## Cambios a realizar

### 1. Corregir creación de pacientes en Admin
Modificar `src/pages/admin/Pacientes.tsx` para incluir `addPaciente` desde `useAppStore`.

La función `handleSubmit` quedará con dos caminos:

- Si `editingPaciente` existe:
  - llamar a `updatePaciente(editingPaciente.id, data)`

- Si `editingPaciente` no existe:
  - llamar a `addPaciente({ ...data, triageResult: null })`

Así el botón **Nuevo Paciente** guardará realmente el paciente y aparecerá en la tabla.

### 2. Corregir creación de pacientes en Mesón
Modificar `src/pages/meson/Pacientes.tsx`.

Quitar el `onSubmit={() => {}}` vacío:

```tsx
<NuevoPacienteDialog open={dialogOpen} onOpenChange={setDialogOpen} />
```

De esa forma el diálogo usará su lógica interna actual y llamará correctamente a `addPaciente`.

### 3. Ajustar el diálogo para evitar futuros errores similares
Modificar `src/components/admin/NuevoPacienteDialog.tsx` para que el flujo sea más claro:

- Cuando se usa para editar, debe usar `onSubmit`.
- Cuando se usa para crear y no hay `initialData`, debe llamar a `addPaciente`.
- Mantener:
  - Formato automático de RUT.
  - Teléfono con `+569 ` y 8 dígitos.
  - Validaciones actuales.
  - Checkbox “Iniciar triage después de registrar” solo al crear.

También revisar que el mensaje toast no diga “Paciente creado” si por alguna razón no se guardó.

### 4. Revisar pestaña Médicos
Revisar que:

- **Nuevo Médico** agregue médicos a la lista.
- El lápiz actualice correctamente nombre, especialidad y email.
- Eliminar médico funcione.
- Mesón > Médicos muestre los médicos creados desde Admin.

Si se detecta algún handler vacío o desconectado, corregirlo siguiendo el mismo patrón que Pacientes.

### 5. Revisar pestaña Órdenes
Revisar `src/pages/meson/Ordenes.tsx` y `src/components/admin/NuevaOrdenDialog.tsx`.

Ajustes propuestos:

- Confirmar que **Nueva Orden** se guarda y aparece en la lista.
- Cambiar el selector de médico para usar los médicos reales del store en vez de médicos escritos fijo como “Dr. Pérez”.
- Guardar también `medicoId` cuando se seleccione un médico real.
- Esto ayudará a que los reportes individuales por médico funcionen mejor.

### 6. Revisar pestaña Citas
Revisar `src/pages/meson/Citas.tsx`.

Validar:

- Que una cita nueva aparezca en la lista.
- Que use pacientes y médicos reales.
- Que al asignar box, el visualizador cambie a ocupado.
- Que al eliminar una cita asignada a un box, el box no quede ocupado por error.

Si se detecta que eliminar una cita deja el box en rojo/ocupado, ajustar para liberar el box asociado.

### 7. Revisar pestaña Triage
Revisar `src/pages/meson/Triage.tsx`.

Validar:

- Que aparezcan los pacientes creados.
- Que al iniciar triage desde Pacientes con `pacienteId`, seleccione correctamente el paciente.
- Que al guardar el resultado, se refleje en la tabla de Pacientes.

### 8. Revisar Dashboard y Reportes
Validar que los datos creados se reflejen en:

- Dashboard:
  - Pacientes.
  - Médicos.
  - Citas hoy.
  - Órdenes pendientes.
  - Órdenes recientes.
  - Visualizador de boxes.

- Reportes:
  - Reporte diario.
  - Reporte mensual.
  - Reporte individual médico.

Si Órdenes todavía usa médicos hardcodeados, corregirlo para mejorar los reportes por médico.

### 9. Revisar Sistema y Sesiones
Revisar las pestañas:

- **Sistema**
  - Nuevo usuario.
  - Lista de usuarios.
  - Eliminar usuario.

- **Sesiones**
  - Corregir el warning de consola relacionado con `Badge` si afecta la vista.
  - Validar que la tabla se renderice sin errores visuales.

## Archivos principales a modificar

- `src/pages/admin/Pacientes.tsx`
- `src/pages/meson/Pacientes.tsx`
- `src/components/admin/NuevoPacienteDialog.tsx`
- `src/components/admin/NuevaOrdenDialog.tsx`
- `src/pages/meson/Citas.tsx`

Posibles archivos adicionales si aparecen errores durante la revisión:

- `src/pages/admin/Medicos.tsx`
- `src/components/admin/NuevoMedicoDialog.tsx`
- `src/pages/meson/Triage.tsx`
- `src/pages/admin/Sesiones.tsx`

## Resultado esperado
Después de la corrección:

1. Crear paciente desde **Admin > Pacientes** guardará y mostrará el paciente en la lista.
2. Crear paciente desde **Mesón > Pacientes** también guardará y mostrará el paciente.
3. El paciente aparecerá en:
   - Selector de Citas.
   - Selector de Triage.
   - Dashboard.
   - Reportes.
4. Médicos, órdenes, citas, triage, boxes, reportes, sistema y sesiones quedarán revisados para detectar y corregir problemas similares.

## Verificación final
Después de implementar se probará este flujo completo:

1. Ir a `/admin/pacientes`.
2. Crear paciente.
3. Confirmar que aparece en la lista.
4. Editar paciente con el lápiz.
5. Confirmar que se actualiza.
6. Eliminar paciente.
7. Repetir creación desde `/meson/pacientes`.
8. Crear médico desde Admin.
9. Confirmar que aparece en Mesón > Médicos.
10. Crear orden usando paciente y médico reales.
11. Confirmar que aparece en Órdenes y Dashboard.
12. Crear cita usando paciente y médico reales.
13. Asignar box.
14. Confirmar que el box aparece ocupado.
15. Eliminar cita y confirmar que el box no queda ocupado incorrectamente.
16. Hacer triage a un paciente.
17. Confirmar que el resultado aparece en Pacientes.
18. Revisar reportes PDF diario, mensual e individual médico.
19. Revisar consola para confirmar que no queden errores importantes.
