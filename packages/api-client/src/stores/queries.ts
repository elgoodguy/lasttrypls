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

  return sortedStores;
};

/**
 * Fetches detailed store information by ID
 */
export const getStoreDetailsById = async (
  supabase: SupabaseClient<Database>,
  storeId: string
): Promise<StoreDetails | null> => {
  if (!storeId) {
    return null;
  }

  try {
    const { data, error, status } = await supabase
      .from('stores')
      .select('*')
      .eq('id', storeId)
      .maybeSingle();

    if (error && status !== 406) {
      throw error;
    }

    if (!data) {
      return null;
    }

    return data as any;

  } catch (catchError) {
    return null;
  }
};

// Add functions later for:
// - getStoreById(id): Fetches detailed store view data
// - searchStores(term): For search results page
