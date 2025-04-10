import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@repo/types';
import { Product } from '../types/product';

interface StoreProductView {
  store_id: string;
  product_id: string;
  name: string;
  description: string | null;
  base_price: number;
  compare_at_price: number | null;
  image_urls: string[] | null;
  is_active: boolean;
  product_type: 'physical' | 'prepared';
  is_available_in_store: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Obtiene los productos disponibles para una tienda específica
 */
export async function getAvailableProductsForStore(
  supabase: SupabaseClient<Database>,
  storeId: string
): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('store_products_view')
      .select('*')
      .eq('store_id', storeId)
      .eq('is_available_in_store', true)
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }

    if (!data) {
      return [];
    }

    // Transform the data to match the Product interface
    const products: Product[] = (data as unknown as StoreProductView[]).map(item => ({
      id: item.product_id,
      name: item.name,
      description: item.description,
      base_price: item.base_price,
      compare_at_price: item.compare_at_price,
      image_urls: item.image_urls,
      is_active: item.is_active,
      product_type: item.product_type,
      created_at: item.created_at,
      updated_at: item.updated_at,
      store_products: {
        is_available_in_store: item.is_available_in_store,
        store_id: storeId
      }
    }));

    return products;
  } catch (error) {
    console.error('Error in getAvailableProductsForStore:', error);
    throw error;
  }
}

/**
 * Obtiene las asignaciones de categorías para un conjunto de productos
 */
export async function getProductCategoryAssignments(
  supabase: SupabaseClient,
  productIds: string[]
): Promise<{ product_id: string; category_id: string }[]> {
  if (productIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from('product_categories_map')
    .select('product_id, category_id')
    .in('product_id', productIds);

  if (error) {
    console.error('Error fetching category assignments:', error);
    throw error;
  }

  return data || [];
} 