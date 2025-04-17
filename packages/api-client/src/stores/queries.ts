import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@repo/types';

export type Store = Database['public']['Tables']['stores']['Row'] & {
  cashback_rules?: Array<{
    percentage: number;
    minimum_order_amount: number | null;
    maximum_cashback_amount: number | null;
  }> | null;
};

// Consider defining a more specific type for the Store Card, maybe joining with group or cashback info?
export type StoreCardData = Pick<
  Store,
  | 'id'
  | 'name'
  | 'logo_url'
  | 'estimated_delivery_time_minutes'
  | 'delivery_fee'
  | 'minimum_order_amount'
  | 'group_id'
  | 'is_active' // Add other needed fields
> & {
  // Potentially add cashback info here later
  cashback_percentage?: number | null;
  group_logo_url?: string | null; // If fetching group logo too
};

// Extended type for store details view
export type StoreDetails = Store & {
  categories?: {
    category_id: string;
    name: string;
  }[];
  cashback_rule?: {
    percentage: number;
    minimum_order_amount: number | null;
    maximum_cashback_amount: number | null;
  } | null;
};

// Types for the Supabase response
type StoreWithCategories = {
  [K in keyof Store]: Store[K];
} & {
  store_categories: Array<{
    product_categories: {
      id: string;
      name: string;
    };
  }>;
  cashback_rules: Array<{
    percentage: number;
    minimum_order_amount: number | null;
    maximum_cashback_amount: number | null;
  }> | null;
};

/**
 * Fetches active stores, filtered by postal code and category if provided.
 */
export const getStoresForHome = async (
  supabase: SupabaseClient<Database>,
  filters: {
    postalCode?: string | null;
    categoryId?: string | null;
  } = {}
): Promise<Store[]> => {
  let query = supabase
    .from('stores')
    .select<string, Store>(
      `
      *,
      store_categories!inner (
        category_id
      ),
      cashback_rules!inner (
        percentage,
        minimum_order_amount,
        maximum_cashback_amount
      )
    `
    )
    .eq('is_active', true)
    .eq('cashback_rules.is_active', true)
    .order('created_at', { ascending: false });

  // Apply postal code filter if provided
  if (filters.postalCode) {
    query = query.contains('accepted_postal_codes', [filters.postalCode]);
  }

  // Apply category filter if provided
  if (filters.categoryId) {
    query = query.eq('store_categories.category_id', filters.categoryId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching stores for home:', error);
    throw error;
  }

  if (!data) {
    return [];
  }

  // Sort stores by cashback percentage (descending) and then by created_at (descending)
  const sortedStores = [...data].sort((a, b) => {
    const aPercentage = a.cashback_rules?.[0]?.percentage || 0;
    const bPercentage = b.cashback_rules?.[0]?.percentage || 0;
    if (aPercentage !== bPercentage) {
      return bPercentage - aPercentage; // Descending order
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime(); // Descending order
  });

  // Log the number of stores found for debugging
  console.log(
    `Found ${sortedStores.length} stores` +
      `${filters.postalCode ? ` for postal code ${filters.postalCode}` : ''}` +
      `${filters.categoryId ? ` in category ${filters.categoryId}` : ''}`
  );

  return sortedStores;
};

/**
 * Fetches detailed store information by ID
 */
export const getStoreDetailsById = async (
  supabase: SupabaseClient<Database>,
  storeId: string
): Promise<StoreDetails | null> => {
  console.log(`[getStoreDetailsById] Called for storeId: ${storeId}`);

  if (!storeId) {
    console.warn('[getStoreDetailsById] No storeId provided.');
    return null;
  }

  try {
    console.log('[getStoreDetailsById] Executing Supabase query...');
    // Intenta con un select simple primero para descartar problemas de join
    const { data, error, status } = await supabase
      .from('stores')
      .select('*') // <-- SELECT SIMPLE PRIMERO
      .eq('id', storeId)
      .maybeSingle(); // Usa maybeSingle para que no lance error si no encuentra

    console.log('[getStoreDetailsById] Query finished.');
    console.log('[getStoreDetailsById] Status:', status);
    console.log('[getStoreDetailsById] Error:', error);
    console.log('[getStoreDetailsById] Data received:', JSON.stringify(data, null, 2));

    if (error && status !== 406) { // 406 = Not found con maybeSingle, no es un error real
      console.error('[getStoreDetailsById] Supabase Error:', error);
      throw error; // Lanza otros errores
    }

    if (!data) {
      console.log('[getStoreDetailsById] Store not found in DB.');
      return null;
    }

    // Si el select simple funciona, puedes intentar añadir los joins de nuevo
    // comentando el select simple y descomentando/ajustando el complejo:
    /*
    const { data, error, status } = await supabase
      .from('stores')
      .select(`
        *,
        store_categories ( // Join con categorías
          product_categories (
            id,
            name
          )
        ),
        cashback_rules ( // Join con cashback
          percentage,
          minimum_order_amount,
          maximum_cashback_amount
        )
      `)
      .eq('id', storeId)
      .maybeSingle(); 
     
     // ... mismos logs de status, error, data ...

     if (!data) return null;

     // Transformación necesaria si usas el select complejo
     const storeWithRelations = data as any; // Temporal any para transformación
     const storeDetails: StoreDetails = {
       ...storeWithRelations,
       categories: storeWithRelations.store_categories?.map((sc: any) => ({
         category_id: sc.product_categories.id,
         name: sc.product_categories.name,
       })) || [],
       cashback_rule: storeWithRelations.cashback_rules?.[0] || null,
     };
     console.log('[getStoreDetailsById] Transformed StoreDetails:', JSON.stringify(storeDetails, null, 2));
     return storeDetails;
    */

    // Por ahora, con select simple, solo hacemos cast al tipo base Store
    console.log('[getStoreDetailsById] Returning store data (simple select).');
    // Nota: Devolver `data as Store` aquí causará error de tipo en StoreDetailPage
    // si espera StoreDetails. Ajusta el tipo esperado en StoreDetailPage o devuelve
    // un objeto compatible con StoreDetails (con arrays vacíos para categories/cashback).
    // Devolvemos 'any' temporalmente para evitar error de build mientras depuramos.
    return data as any;

  } catch (catchError) {
    console.error('[getStoreDetailsById] Exception caught:', catchError);
    // Decide si quieres relanzar o devolver null
    // throw catchError; 
    return null;
  }
};

// Add functions later for:
// - getStoreById(id): Fetches detailed store view data
// - searchStores(term): For search results page
