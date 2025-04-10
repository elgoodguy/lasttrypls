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

  const { data, error } = (await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })) as { data: Address[] | null; error: any };

  if (error) {
    console.error('Error fetching addresses:', error);
    throw error;
  }
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
  if (!user) throw new Error('User not logged in'); // Or rely on RLS

  const { error } = await supabase.from('addresses').delete().eq('id', addressId);
  // Optional: .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting address:', error);
    throw error;
  }
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
