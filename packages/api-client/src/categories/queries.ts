import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@repo/types';

export type ProductCategory = Database['public']['Tables']['product_categories']['Row'];

/**
 * Fetches all active product categories, ordered by sort_order.
 */
export const getProductCategories = async (
  supabase: SupabaseClient<Database>
): Promise<ProductCategory[]> => {
  const { data: categories, error } = await supabase
    .from('product_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching product categories:', error);
    throw error;
  }

  return (categories as unknown as ProductCategory[]) || [];
};
