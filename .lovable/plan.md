
# Plan: Formato automático de RUT y teléfono en Pacientes

## Objetivo
En el formulario “Nuevo Paciente”, usado tanto en el panel de Administrador como en Mesón, limitar y formatear automáticamente:

- RUT con máximo 12 caracteres incluyendo puntos y guion.
- Teléfono con prefijo fijo `+569` y 9 dígitos adicionales ingresables.

## Cambios a realizar

### 1. Crear utilidades de formato para RUT y teléfono

Agregar funciones dentro de `src/components/admin/NuevoPacienteDialog.tsx` o en un helper reutilizable si se prefiere mantener limpio el componente.

#### RUT
Implementar una función `formatRut(value)` que:

- Elimine caracteres no válidos.
- Permita solo números y letra `K/k`.
- Limite el RUT base a máximo 9 caracteres sin formato:
  - 8 dígitos de cuerpo.
  - 1 dígito verificador.
- Inserte automáticamente:
  - Puntos en el cuerpo.
  - Guion antes del dígito verificador.
- Devuelva máximo 12 caracteres formateados.

Ejemplos esperados:

```text
1              -> 1
12             -> 1-2
123            -> 12-3
1234           -> 123-4
12345          -> 1.234-5
12345678       -> 1.234.567-8
123456789      -> 12.345.678-9
12345678k      -> 12.345.678-K
```

El campo quedará con:

```tsx
maxLength={12}
placeholder="12.345.678-9"
```

### 2. Aplicar el formato automático mientras se escribe

Modificar el input de RUT en `NuevoPacienteDialog.tsx`.

Actualmente:

```tsx
<Input value={rut} onChange={(e) => setRut(e.target.value)} />
```

Se cambiará para que cada escritura pase por el formateador:

```tsx
<Input
  value={rut}
  onChange={(e) => setRut(formatRut(e.target.value))}
  maxLength={12}
  placeholder="12.345.678-9"
  required
/>
```

Así se aplica automáticamente en Administrador y Mesón, porque ambos usan el mismo componente `NuevoPacienteDialog`.

### 3. Cambiar teléfono a prefijo fijo `+569`

Modificar el estado inicial de teléfono:

```ts
const PHONE_PREFIX = "+569";
const [telefono, setTelefono] = useState(PHONE_PREFIX);
```

Crear una función `formatPhone(value)` que:

- Mantenga siempre el prefijo `+569`.
- Elimine todo lo que no sea número después del prefijo.
- Permita máximo 9 dígitos adicionales.
- Devuelva el teléfono en formato simple:

```text
+569123456789
```

Reglas:

```text
Prefijo fijo: +569
Dígitos ingresables: 9
Largo final máximo: 13 caracteres
```

El input quedará con:

```tsx
<Input
  value={telefono}
  onChange={(e) => setTelefono(formatPhone(e.target.value))}
  maxLength={13}
  placeholder="+569123456789"
  required
/>
```

### 4. Evitar que el usuario borre el prefijo

Agregar lógica para que si el usuario intenta borrar todo el campo, el valor vuelva a `+569`.

También se puede usar `onFocus` para asegurar que el campo nunca quede vacío:

```tsx
onFocus={() => {
  if (!telefono.startsWith("+569")) setTelefono("+569");
}}
```

### 5. Validar antes de crear paciente

Antes de llamar a `addPaciente`, validar:

#### RUT
- Largo máximo 12.
- Debe tener guion cuando ya esté completo.
- Solo debe contener números, puntos, guion y K.

#### Teléfono
- Debe comenzar con `+569`.
- Debe tener exactamente 9 dígitos después del prefijo.
- Si no cumple, mostrar toast de error y no crear paciente.

Mensaje sugerido:

```text
RUT inválido
Ingrese un RUT válido con formato 12.345.678-9.
```

```text
Teléfono inválido
Ingrese 9 dígitos después del prefijo +569.
```

### 6. Mantener compatibilidad con Admin y Mesón

No se modificarán `AdminPacientes.tsx` ni `MesonPacientes.tsx` salvo que sea necesario, porque ambos ya reutilizan:

```tsx
<NuevoPacienteDialog />
```

Por lo tanto el cambio impactará automáticamente en ambos paneles.

### 7. Ajustar reseteo del formulario

Actualmente al guardar se limpia teléfono con string vacío.

Se cambiará para resetearlo a:

```ts
setTelefono("+569");
```

Así el próximo paciente ya tendrá el prefijo fijo listo.

## Archivos a modificar

- `src/components/admin/NuevoPacienteDialog.tsx`

## Verificación final

Después de implementar:

1. Entrar al panel Administrador.
2. Ir a Pacientes.
3. Hacer clic en “Nuevo Paciente”.
4. Escribir un RUT sin puntos ni guion.
5. Confirmar que se formatea automáticamente.
6. Confirmar que no permite superar 12 caracteres formateados.
7. Confirmar que el teléfono siempre mantiene `+569`.
8. Confirmar que solo deja ingresar 9 dígitos después del prefijo.
9. Crear paciente y verificar que se guarda con RUT y teléfono formateados.
10. Repetir el mismo flujo desde Mesón > Pacientes.
