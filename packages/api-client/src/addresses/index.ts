import { SupabaseClient } from '@supabase/supabase-js';

export interface Address {
  id: string;
  user_id: string;
  street_address: string;
  internal_number: string | null;
  neighborhood: string | null;
  city: string;
  postal_code: string;
  country: string;
  is_primary: boolean;
  delivery_instructions: string | null;
  google_place_id: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}

export type AddressInsert = Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

export const getAddresses = async (supabase: SupabaseClient): Promise<Address[]> => {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .order('is_primary', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching addresses:', error);
    throw error;
  }

  return data || [];
};

export const addAddress = async (
  supabase: SupabaseClient,
  address: AddressInsert
): Promise<Address> => {
  const { data, error } = await supabase.from('addresses').insert([address]).select().single();

  if (error) {
    console.error('Error adding address:', error);
    throw error;
  }

  return data;
};
