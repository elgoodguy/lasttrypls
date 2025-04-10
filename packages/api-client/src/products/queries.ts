import { SupabaseClient } from '@supabase/supabase-js';
import { Product } from '../types/product';

/**
 * Obtiene los productos disponibles para una tienda específica
 */
export async function getAvailableProductsForStore(
  supabase: SupabaseClient,
  storeId: string
): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('store_products')
      .select(`
        product:products (
          id,
          name,
          description,
          base_price,
          compare_at_price,
          image_urls,
          is_active,
          product_type,
          created_at,
          updated_at
        ),
        is_available_in_store
      `)
      .eq('store_id', storeId)
      .eq('is_available_in_store', true)
      .order('product(name)');

    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }

    // Transform the data to match the Product interface
    const products: Product[] = data?.map(item => ({
      id: item.product.id,
      name: item.product.name,
      description: item.product.description,
      base_price: item.product.base_price,
      compare_at_price: item.product.compare_at_price,
      image_urls: item.product.image_urls,
      is_active: item.product.is_active,
      product_type: item.product.product_type,
      created_at: item.product.created_at,
      updated_at: item.product.updated_at,
      store_products: {
        is_available_in_store: item.is_available_in_store,
        store_id: storeId
      }
    })) || [];

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