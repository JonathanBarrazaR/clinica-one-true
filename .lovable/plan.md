
# Plan: Corregir formato y validación del teléfono de pacientes

## Problema actual
El formulario está validando el teléfono como:

```text
+569 + 9 dígitos
```

Pero el número móvil chileno correcto con prefijo fijo debe quedar visualmente como:

```text
+569 92315312
```

Es decir:
- Prefijo fijo: `+569`
- Un espacio después del prefijo
- 8 dígitos ingresables después del espacio

Por eso actualmente te aparece error aunque estés ingresando un número correcto.

## Cambio a realizar

Modificar `src/components/admin/NuevoPacienteDialog.tsx`.

### 1. Cambiar el prefijo visual del teléfono

Usar:

```ts
const PHONE_PREFIX = "+569 ";
```

En vez de:

```ts
const PHONE_PREFIX = "+569";
```

Así el campo siempre mostrará el espacio automáticamente:

```text
+569 92315312
```

### 2. Ajustar el formateador de teléfono

Actualizar `formatPhone(value)` para que:

- Mantenga siempre `+569 ` con espacio.
- Quite comillas, letras, símbolos y cualquier carácter que no sea número.
- Ignore los dígitos del prefijo si el usuario pega el número completo.
- Permita máximo 8 dígitos después del prefijo.
- Devuelva el valor final con este formato:

```text
+569 92315312
```

### 3. Ajustar la validación

Cambiar `isPhoneValid` para validar exactamente:

```text
+569 + espacio + 8 dígitos
```

Ejemplos válidos:

```text
+569 92315312
+569 87654321
```

Ejemplos inválidos:

```text
+56992315312
+569 9231531
+569 923153123
+569 "92315312
```

### 4. Ajustar límites del input

Cambiar el `maxLength` del campo teléfono.

El largo correcto será:

```text
+569 92315312
```

Total:
- `+569` = 4 caracteres
- espacio = 1 carácter
- número = 8 caracteres

Total final: `13`

Se mantendrá:

```tsx
maxLength={13}
```

pero ahora el carácter extra será el espacio real, no una comilla ni otro símbolo.

### 5. Ajustar mensaje de error

Cambiar el mensaje actual:

```text
Ingrese 9 dígitos después del prefijo +569.
```

Por:

```text
Ingrese 8 dígitos después del prefijo +569.
```

O más claro:

```text
Ingrese un teléfono válido con formato +569 92315312.
```

### 6. Ajustar reseteo del formulario

Después de crear un paciente, el teléfono volverá a:

```text
+569 
```

para que el próximo ingreso ya tenga el prefijo y espacio listos.

## Resultado esperado

Al escribir o pegar un teléfono:

```text
92315312
```

El campo mostrará automáticamente:

```text
+569 92315312
```

Y permitirá crear el paciente sin mostrar error.

## Verificación final

Después de implementar:

1. Entrar a `/admin/pacientes`.
2. Abrir “Nuevo Paciente”.
3. Escribir un teléfono como `92315312`.
4. Confirmar que queda como `+569 92315312`.
5. Crear el paciente.
6. Confirmar que no aparece el error de teléfono inválido.
7. Repetir el mismo flujo desde Mesón > Pacientes.
