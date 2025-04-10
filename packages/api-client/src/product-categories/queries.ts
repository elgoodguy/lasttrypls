import { SupabaseClient } from '@supabase/supabase-js';
import { ProductCategory } from '../types/product';

/**
 * Obtiene todas las categorías de productos
 */
export async function getProductCategories(
  supabase: SupabaseClient
): Promise<ProductCategory[]> {
  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
} 