
# Plan: Hacer funcional el botón de lápiz para editar médicos

## Objetivo
Convertir el botón del lápiz blanco en la tabla de Médicos en una acción funcional para corregir datos ingresados por error por el admin.

## Cambios a realizar

### 1. Agregar actualización de médicos en el store
Modificar `src/stores/appStore.ts` para incluir una función:

```ts
updateMedico(id, data)
```

Permitirá actualizar:
- Nombre
- Especialidad
- Email
- Estado, si se decide incluirlo en el formulario

La función actualizará el médico existente manteniendo su `id`.

### 2. Reutilizar el diálogo de médico para crear y editar
Modificar `src/components/admin/NuevoMedicoDialog.tsx` para que soporte dos modos:

- **Crear médico**
  - Título: `Nuevo Médico`
  - Botón: `Crear Médico`
  - Campos vacíos

- **Editar médico**
  - Título: `Editar Médico`
  - Botón: `Guardar Cambios`
  - Campos prellenados con los datos actuales del médico

El componente recibirá un médico opcional como `initialData` o `medico`.

### 3. Conectar el botón lápiz en Admin Médicos
Modificar `src/pages/admin/Medicos.tsx`:

- Agregar estado local:
  - `editingMedico`
  - `dialogOpen`

- Al hacer clic en el lápiz:
  - Guardar el médico seleccionado en `editingMedico`
  - Abrir el diálogo con sus datos

- Al guardar:
  - Si hay `editingMedico`, llamar `updateMedico`
  - Si no hay `editingMedico`, llamar `addMedico`

- Al cerrar el diálogo:
  - Limpiar `editingMedico`

### 4. Mantener el diseño actual
No cambiar colores ni estructura visual del panel.
El lápiz seguirá siendo el botón actual, pero ahora abrirá el formulario de edición.

## Resultado esperado
El admin podrá hacer clic en el lápiz de cualquier médico, corregir nombre, especialidad o email, guardar cambios y ver la tabla actualizada inmediatamente.

## Verificación
Después de implementar:
1. Entrar al panel admin en `/admin/medicos`.
2. Crear un médico.
3. Hacer clic en el lápiz blanco.
4. Confirmar que el formulario abre con los datos cargados.
5. Cambiar nombre, especialidad o email.
6. Guardar cambios.
7. Confirmar que la fila de la tabla se actualiza correctamente.
