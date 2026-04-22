import { supabase } from '@/integrations/supabase/client';

// ─── Roles ───────────────────────────────────────────────
export async function getUserRoles(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId);
  if (error) {
    console.error('getUserRoles error:', error);
    return [];
  }
  return (data ?? []).map((r) => r.role);
}

export async function assignRole(userId: string, role: string) {
  const { error } = await supabase
    .from('user_roles')
    .insert({ user_id: userId, role });
  if (error) throw error;
}

// ─── Profiles ────────────────────────────────────────────
export async function createProfile(userId: string, data: { full_name: string; email: string }) {
  const { error } = await supabase
    .from('profiles')
    .insert({ user_id: userId, full_name: data.full_name, email: data.email });
  if (error) throw error;
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error) {
    console.error('getProfile error:', error);
    return null;
  }
  return data;
}
