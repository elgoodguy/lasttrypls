import { Database } from '@repo/types';

type Store = Database['public']['Tables']['stores']['Row'];

export type StoreCardData = Pick<Store,
   'id' | 'name' | 'logo_url' | 'estimated_delivery_time_minutes' | 'delivery_fee' | 'minimum_order_amount' | 'group_id'
> & {
    cashback_percentage?: number | null;
    group_logo_url?: string | null;
};

/**
 * Fetches active stores, potentially filtered and ordered.
 * For MVP Home, fetch all active stores initially. Add filtering later.
 */
export async function getStoresForHome(supabase: any): Promise<Store[]> {
  const { data: stores, error } = await supabase
    .from('stores')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching stores for home:', error);
    throw error;
  }

  return stores as Store[];
}

// Add functions later for:
// - getStoreById(id): Fetches detailed store view data
// - searchStores(term): For search results page