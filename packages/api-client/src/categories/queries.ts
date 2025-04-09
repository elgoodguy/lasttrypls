import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@repo/types';

type ProductCategory = Database['public']['Tables']['product_categories']['Row'];

/**
 * Fetches all active product categories, ordered by sort_order.
 */
export async function getProductCategories(supabase: any) {
  const { data: categories, error } = await supabase
    .from('product_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    throw error;
  }

  return categories as ProductCategory[];
} 