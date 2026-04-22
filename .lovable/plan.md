

# Plan: Fix blank preview caused by missing environment variables

## Problem
The `.env` file with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` is not present in the sandbox. After removing the placeholder fallbacks from `client.ts`, the app crashes on load because `createClient(undefined, undefined)` throws an error.

## Solution

### 1. Add safety check to Supabase client
**File:** `src/integrations/supabase/client.ts`

Add a runtime guard that checks if the environment variables are defined before creating the client. If they are missing, log a clear error message and create a client with empty strings (which will fail gracefully on API calls rather than crashing the entire app).

```ts
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables.');
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');
```

### 2. Add your Supabase secrets via Lovable's Secrets manager
You need to add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as secrets in your Lovable project settings so the sandbox can access them. This is separate from a local `.env` file.

## Result
The app will load without crashing. If the env vars are missing, the login page will render and show an error only when attempting to authenticate (instead of a blank screen).

