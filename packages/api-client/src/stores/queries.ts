import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@repo/types';

export type Store = Database['public']['Tables']['stores']['Row'];
// Consider defining a more specific type for the Store Card, maybe joining with group or cashback info?
export type StoreCardData = Pick<Store,
   'id' | 'name' | 'logo_url' | 'estimated_delivery_time_minutes' | 'delivery_fee' | 'minimum_order_amount' | 'group_id' // Add other needed fields
> & {
    // Potentially add cashback info here later
    cashback_percentage?: number | null;
    group_logo_url?: string | null; // If fetching group logo too
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
    .select('*')
    .eq('is_active', true);

  // Apply postal code filter if provided
  if (filters.postalCode) {
    query = query.contains('accepted_postal_codes', [filters.postalCode]);
  }

  // TODO: Add category filtering in the future
  if (filters.categoryId) {
    console.warn('Category filtering not yet implemented in getStoresForHome');
  }

  // Apply ordering
  query = query.order('created_at', { ascending: false });

  const { data: stores, error } = await query;

  if (error) {
    console.error('Error fetching stores for home:', error);
    throw error;
  }

  // Log the number of stores found for debugging
  console.log(`Found ${stores?.length || 0} stores${filters.postalCode ? ` for postal code ${filters.postalCode}` : ''}`);

  return (stores as unknown as Store[]) || [];
};

// Add functions later for:
// - getStoreById(id): Fetches detailed store view data
// - searchStores(term): For search results page