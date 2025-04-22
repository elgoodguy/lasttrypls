import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@repo/types';

export type Address = Database['public']['Tables']['addresses']['Row'];
export type AddressInsert = Database['public']['Tables']['addresses']['Insert'];
export type AddressUpdate = Database['public']['Tables']['addresses']['Update'];

/**
 * Fetches all addresses for the currently authenticated user.
 */
export const getAddresses = async (supabase: SupabaseClient<Database>): Promise<Address[]> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return []; // Return empty array if no user

  console.log('[getAddresses] Fetching for user:', user.id);
  console.log('[getAddresses] Executing Supabase query...');

  const { data, error } = (await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })) as { data: Address[] | null; error: any };

  console.log('[getAddresses] Supabase query finished. Result:', { data, error });

  if (error) {
    console.error('[getAddresses] Supabase Error:', error);
    throw error;
  }

  console.log('[getAddresses] Returning data:', data || []);
  return data || [];
};

/**
 * Adds a new address for the currently authenticated user.
 */
export const addAddress = async (
  supabase: SupabaseClient<Database>,
  addressData: Omit<AddressInsert, 'user_id' | 'id' | 'created_at' | 'updated_at'>
): Promise<Address> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('User not logged in');

  console.log('addAddress - Data being sent to Supabase:', { ...addressData, user_id: user.id });

  const { data, error } = (await supabase
    .from('addresses')
    .insert({ ...addressData, user_id: user.id })
    .select()
    .single()) as { data: Address | null; error: any };

  if (error) {
    console.error('Error adding address:', error);
    throw error;
  }
  if (!data) {
    throw new Error('Failed to add address, no data returned.');
  }
  return data;
};

/**
 * Updates an existing address.
 */
export const updateAddress = async (
  supabase: SupabaseClient<Database>,
  addressId: string,
  updates: AddressUpdate // Pass only the fields to update
): Promise<Address> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('User not logged in'); // Or rely on RLS

  // Ensure user_id is not accidentally included in updates payload
  const { user_id, id, created_at, ...safeUpdates } = updates;

  const { data, error } = (await supabase
    .from('addresses')
    .update(safeUpdates)
    .eq('id', addressId)
    // Optional: Add .eq('user_id', user.id) for extra check, though RLS handles it
    .select()
    .single()) as { data: Address | null; error: any };

  if (error) {
    console.error('Error updating address:', error);
    throw error;
  }
  if (!data) {
    throw new Error('Failed to update address, no data returned.');
  }
  return data;
};

/**
 * Deletes an address.
 */
export const deleteAddress = async (
  supabase: SupabaseClient<Database>,
  addressId: string
): Promise<void> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('User not logged in');

  console.log('[deleteAddress] Attempting to delete address:', { addressId, userId: user.id });

  // First verify the address belongs to the user
  const { data: addressData, error: fetchError } = await supabase
    .from('addresses')
    .select('id')
    .eq('id', addressId)
    .eq('user_id', user.id)
    .single();

  if (fetchError) {
    console.error('[deleteAddress] Error verifying address ownership:', fetchError);
    throw new Error('Failed to verify address ownership');
  }

  if (!addressData) {
    console.error('[deleteAddress] Address not found or does not belong to user');
    throw new Error('Address not found or unauthorized');
  }

  // Proceed with deletion
  const { error: deleteError } = await supabase
    .from('addresses')
    .delete()
    .eq('id', addressId)
    .eq('user_id', user.id); // Add user_id check for extra security

  if (deleteError) {
    console.error('[deleteAddress] Error deleting address:', deleteError);
    throw deleteError;
  }

  console.log('[deleteAddress] Successfully deleted address:', addressId);
};

/**
 * Sets a specific address as the primary one for the user.
 */
export const setPrimaryAddress = async (
  supabase: SupabaseClient<Database>,
  addressId: string
): Promise<Address> => {
  // This simply updates the address with is_primary = true.
  // The database trigger `ensure_single_primary_address` will handle
  // unsetting other primary flags for the same user.
  return updateAddress(supabase, addressId, { is_primary: true });
};
