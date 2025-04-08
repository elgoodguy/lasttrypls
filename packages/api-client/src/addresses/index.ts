import { SupabaseClient } from '@supabase/supabase-js';

export interface Address {
  id: string;
  user_id: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export const getAddresses = async (supabase: SupabaseClient): Promise<Address[]> => {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching addresses:', error);
    throw error;
  }

  return data || [];
};

export const addAddress = async (
  supabase: SupabaseClient,
  address: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<Address> => {
  const { data, error } = await supabase
    .from('addresses')
    .insert([address])
    .select()
    .single();

  if (error) {
    console.error('Error adding address:', error);
    throw error;
  }

  return data;
}; 