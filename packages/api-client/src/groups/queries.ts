import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@repo/types';

export type Group = Database['public']['Tables']['groups']['Row'];

/**
 * Fetches all active groups, ordered by sort_order.
 */
export const getGroups = async (supabase: SupabaseClient<Database>): Promise<Group[]> => {
  const { data: groups, error } = await supabase
    .from('groups')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching groups:', error);
    throw error;
  }

  return (groups as unknown as Group[]) || [];
};
