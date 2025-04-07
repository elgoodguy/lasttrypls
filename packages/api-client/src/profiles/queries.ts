import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@repo/types/src/database.types';

// Define el tipo para la fila del perfil basado en la generación de Supabase
type Tables = Database['public']['Tables'];
export type Profile = Tables['profiles']['Row'];
export type ProfileUpdate = Tables['profiles']['Update'];

/**
 * Fetches the profile for the currently authenticated user.
 * Returns null if no user is logged in or no profile exists.
 */
export const getProfile = async (
  supabase: SupabaseClient<Database>
): Promise<Profile | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log('No user logged in');
    return null;
  }

  console.log('Fetching profile for user:', user.id);

  const result = await supabase
    .from('profiles')
    .select()
    .eq('user_id', user.id)
    .maybeSingle();

  const { data, error, status } = result as unknown as {
    data: Profile | null;
    error: Error | null;
    status: number;
  };

  if (error && status !== 406) {
    console.error('Error fetching profile:', error);
    throw error;
  }

  if (!data) {
    console.log('No profile found for user:', user.id);
    return null;
  }

  console.log('Profile data fetched:', data);
  return data;
};

/**
 * Updates the profile for the currently authenticated user.
 * Also updates the user's metadata in Supabase Auth if `updateAuthMeta` is true.
 */
export const updateProfile = async (
  supabase: SupabaseClient<Database>,
  updates: ProfileUpdate,
  updateAuthMeta: boolean = true
): Promise<Profile> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not logged in');

  // 1. Update the profiles table
  const result = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', user.id)
    .select()
    .maybeSingle();

  const { data: profileData, error: profileError } = result as unknown as {
    data: Profile | null;
    error: Error | null;
  };

  if (profileError) {
    console.error('Error updating profile table:', profileError);
    throw profileError;
  }
  if (!profileData) {
    throw new Error('Profile not found after update.');
  }

  // 2. Optionally update Supabase Auth user_metadata
  if (updateAuthMeta) {
    const metadataUpdates: { [key: string]: any } = {};
    if ('full_name' in updates && updates.full_name !== undefined) {
      metadataUpdates.full_name = updates.full_name;
    }
    if ('avatar_url' in updates && updates.avatar_url !== undefined) {
      metadataUpdates.avatar_url = updates.avatar_url;
    }

    if (Object.keys(metadataUpdates).length > 0) {
      const { error: metaError } = await supabase.auth.updateUser({
        data: metadataUpdates,
      });

      if (metaError) {
        console.error('Error updating user metadata:', metaError);
      }
    }
  }

  return profileData;
}; 