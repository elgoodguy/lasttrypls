import { SupabaseClient } from '@supabase/supabase-js';
import type { Product, ProductWithModifiers, ProductModifierGroup, ProductModifier } from '../types/product';

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

interface RawProduct {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
  compare_at_price: number | null;
  image_urls: string[] | null;
  is_active: boolean;
  product_type: 'physical' | 'prepared';
  created_at: string;
  updated_at: string;
}

interface RawProductModifierGroup {
  id: string;
  name: string;
  selection_type: 'single' | 'multiple';
  is_required: boolean;
  min_selection: number;
  max_selection: number | null;
  product_id: string;
  sort_order: number;
  product_modifiers?: RawProductModifier[];
}

interface RawProductModifier {
  id: string;
  name: string;
  additional_price: number;
  is_active: boolean;
  sort_order: number;
  group_id: string;
}

type RawProductWithModifiers = RawProduct & {
  product_modifier_groups?: RawProductModifierGroup[];
};

type CategoryAssignment = {
  product_id: string;
  category_id: string;
};

/**
 * Obtiene los detalles completos de un producto por su ID, incluyendo sus grupos de modificadores y opciones
 */
export async function getProductDetailsById(
  supabase: SupabaseClient,
  productId: string
): Promise<ProductWithModifiers | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_modifier_groups (
          *,
          product_modifiers (*)
        )
      `)
      .eq('id', productId)
      .single();

    if (error) {
      console.error('Error fetching product details:', error);
      throw error;
    }

    if (!data) {
      return null;
    }

    const rawData = data as unknown as RawProductWithModifiers;

    // Sort modifier groups and their modifiers by sort_order
    const productWithModifiers: ProductWithModifiers = {
      id: rawData.id,
      name: rawData.name,
      description: rawData.description,
      base_price: rawData.base_price,
      compare_at_price: rawData.compare_at_price,
      image_urls: rawData.image_urls,
      is_active: rawData.is_active,
      product_type: rawData.product_type,
      created_at: rawData.created_at,
      updated_at: rawData.updated_at,
      product_modifier_groups: rawData.product_modifier_groups
        ?.map((group): ProductModifierGroup => ({
          id: group.id,
          name: group.name,
          selection_type: group.selection_type,
          is_required: group.is_required,
          min_selection: group.min_selection,
          max_selection: group.max_selection,
          product_id: group.product_id,
          sort_order: group.sort_order,
          product_modifiers: group.product_modifiers
            ?.filter((modifier): modifier is RawProductModifier => 
              modifier.is_active
            )
            .map((modifier): ProductModifier => ({
              id: modifier.id,
              name: modifier.name,
              additional_price: modifier.additional_price,
              is_active: modifier.is_active,
              sort_order: modifier.sort_order,
              group_id: modifier.group_id
            }))
            .sort((a, b) => a.sort_order - b.sort_order) || []
        }))
        .sort((a, b) => a.sort_order - b.sort_order) || []
    };

    return productWithModifiers;
  } catch (error) {
    console.error('Error in getProductDetailsById:', error);
    throw error;
  }
}

/**
 * Obtiene los productos disponibles para una tienda específica
 */
export async function getAvailableProductsForStore(
  supabase: SupabaseClient,
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
): Promise<CategoryAssignment[]> {
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

  return (data as unknown as CategoryAssignment[]) || [];
}

/**
 * Obtiene los grupos de modificadores y sus opciones para un producto específico
 */
export async function getProductModifierGroups(
  supabase: SupabaseClient,
  productId: string
): Promise<ProductModifierGroup[]> {
  try {
    const { data, error } = await supabase
      .from('product_modifier_groups')
      .select(`
        *,
        product_modifiers (*)
      `)
      .eq('product_id', productId)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching product modifier groups:', error);
      throw error;
    }

    if (!data) {
      return [];
    }

    const rawData = data as unknown as RawProductModifierGroup[];

    if (!rawData) {
      return [];
    }

    // Sort modifiers within each group by sort_order
    return rawData.map(group => ({
      id: group.id,
      name: group.name,
      selection_type: group.selection_type,
      is_required: group.is_required,
      min_selection: group.min_selection,
      max_selection: group.max_selection,
      product_id: group.product_id,
      sort_order: group.sort_order,
      product_modifiers: group.product_modifiers
        ?.filter((modifier): modifier is RawProductModifier => 
          modifier.is_active
        )
        .map((modifier): ProductModifier => ({
          id: modifier.id,
          name: modifier.name,
          additional_price: modifier.additional_price,
          is_active: modifier.is_active,
          sort_order: modifier.sort_order,
          group_id: modifier.group_id
        }))
        .sort((a, b) => a.sort_order - b.sort_order) || []
    }));
  } catch (error) {
    console.error('Error in getProductModifierGroups:', error);
    throw error;
  }
}

export type { ProductModifierGroup, ProductModifier };

export async function getProducts(supabase: SupabaseClient): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }

  return (data as unknown as Product[]) || [];
} 