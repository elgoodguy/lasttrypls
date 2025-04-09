import { Database } from '@repo/types';

type Group = Database['public']['Tables']['groups']['Row'];

export async function getGroups(supabase: any) {
  const { data: groups, error } = await supabase
    .from('groups')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    throw error;
  }

  return groups as Group[];
} 