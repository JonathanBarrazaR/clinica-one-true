

# Plan: Integrar Supabase Auth real y reforzar SQL

## Problema principal
Los usuarios creados en Sistema > Usuarios se guardan solo en memoria (zustand). El login usa `MOCK_USERS` hardcodeados. Por eso un usuario creado desde el panel nunca puede iniciar sesion.

## Cambios a realizar

### 1. Limpiar cliente Supabase
**Archivo:** `src/integrations/supabase/client.ts`

- Quitar los fallbacks `|| 'https://placeholder.supabase.co'` y `|| 'placeholder-key'`.
- Dejar solo las variables de entorno reales:
```ts
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

### 2. Reescribir useAuth para usar Supabase Auth real
**Archivo:** `src/hooks/useAuth.tsx`

- Eliminar `MOCK_USERS`.
- Importar `supabase` desde el cliente.
- `signIn` usara `supabase.auth.signInWithPassword()`.
- `signUp` usara `supabase.auth.signUp()` con metadata `full_name`.
- `signOut` usara `supabase.auth.signOut()`.
- Usar `supabase.auth.onAuthStateChange()` para escuchar cambios de sesion.
- Obtener roles consultando `user_roles` con `supabase.from('user_roles').select('role')`.
- Mantener el tracking de sesiones con `sessionStore`.

### 3. Crear usuarios reales desde Sistema
**Archivo:** `src/components/admin/NuevoUsuarioDialog.tsx`

Actualmente solo guarda en zustand. Se cambiara para:

- Llamar a `supabase.auth.admin.createUser()` -- NOTA: esto requiere la service_role key que no esta disponible en el cliente.
- Alternativa viable: Usar una Edge Function o llamar a `supabase.auth.signUp()` para registrar al usuario y luego insertar el rol en `user_roles`.
- Despues del signup, insertar en `user_roles` el rol seleccionado.
- Insertar en `profiles` el nombre y email.
- Mantener tambien el zustand store para la vista local inmediata.

**Importante:** Como `signUp` desde el cliente loguearia al admin como el nuevo usuario, se usara un approach donde:
1. Se hace `signUp` con el email y password del nuevo usuario.
2. Se inserta el rol en `user_roles`.
3. Se inserta el perfil en `profiles`.
4. Se muestra toast de exito.

Para evitar que el admin pierda su sesion, se puede usar `supabase.auth.admin` via Edge Function, o alternativamente crear el usuario y luego re-autenticar al admin. La solucion mas simple sin Edge Function es:
- Guardar credenciales del admin antes del signUp.
- Hacer signUp del nuevo usuario.
- Insertar rol y perfil.
- Re-autenticar al admin.

### 4. Reforzar el esquema SQL
**Archivo:** `supabase/schema.sql`

Mejoras:
- Agregar trigger para crear perfil automaticamente al registrarse un usuario en `auth.users`.
- Agregar constraint `CHECK` en campos como `estado` de medicos y ordenes para limitar valores validos.
- Agregar indice en `user_roles(user_id)` para optimizar consultas de roles.
- Agregar politica para que el admin pueda insertar en `profiles` de otros usuarios (necesario para crear usuarios desde Sistema).

```sql
-- Trigger auto-crear perfil
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

### 5. Crear archivo de consultas Supabase (base inicial)
**Archivo nuevo:** `src/lib/consultasSupabase.ts`

Contendra funciones reutilizables para interactuar con Supabase:

```ts
// Funciones iniciales:
getUserRoles(userId)        // Obtener roles de un usuario
assignRole(userId, role)    // Asignar rol a usuario
createProfile(userId, data) // Crear perfil
getProfile(userId)          // Obtener perfil
```

Este archivo crecera en el futuro con consultas para pacientes, medicos, ordenes, etc. cuando se migre la data del zustand store a Supabase.

### 6. Ajustar Login para redirigir segun rol real
**Archivo:** `src/pages/Login.tsx`

Despues del login exitoso, consultar el rol del usuario desde `user_roles` y redirigir:
- `admin` -> `/admin`
- `meson` -> `/meson`
- `medico` -> `/meson` (o ruta futura de medico)

### 7. Eliminar archivo duplicado
Eliminar `supabase/supabaseClient.js` ya que es redundante con `src/integrations/supabase/client.ts`.

## Archivos a modificar
- `src/integrations/supabase/client.ts` -- quitar placeholders
- `src/hooks/useAuth.tsx` -- Supabase Auth real
- `src/components/admin/NuevoUsuarioDialog.tsx` -- crear usuario real
- `src/pages/Login.tsx` -- redireccion por rol
- `src/lib/consultasSupabase.ts` -- nuevo archivo de consultas
- `supabase/schema.sql` -- trigger + constraints + indices

## Archivos a eliminar
- `supabase/supabaseClient.js` -- duplicado

## Resultado esperado
1. El admin crea un usuario desde Sistema con email, password y rol.
2. El usuario se registra en Supabase Auth con su rol asignado.
3. Al iniciar sesion con ese email y password, el sistema lo autentica con Supabase.
4. Segun el rol, se redirige al panel correcto (admin o meson).
5. Los usuarios mock dejan de existir; solo funcionan usuarios reales de Supabase.

