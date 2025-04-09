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
 * Fetches active stores, potentially filtered and ordered.
 * For MVP Home, fetch all active stores initially. Add filtering later.
 */
export const getStoresForHome = async (
  supabase: SupabaseClient<Database>,
  // Add filter parameters later (e.g., categoryId, userLocation, searchTerm)
): Promise<Store[]> => { // Return full Store type for now
  const { data: stores, error } = await supabase
    .from('stores')
    .select('*') // Select specific columns for StoreCardData later for optimization
    // Basic filters for Home MVP:
    .eq('is_active', true) // Only active stores
    // .in('address_postal_code', userPostalCodes) // TODO: Filter by user location later
    // .filter('categories', 'cs', `{${categoryId}}`) // TODO: Filter by category later
    // Ordering (example: by creation date, or add a 'featured_score' field)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching stores for home:', error);
    throw error;
  }

  return (stores as unknown as Store[]) || [];
};

// Add functions later for:
// - getStoreById(id): Fetches detailed store view data
// - searchStores(term): For search results page