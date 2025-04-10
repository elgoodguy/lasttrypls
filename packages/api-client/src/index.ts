// Core API client functions and types
import { createClient } from '@supabase/supabase-js';
import { Database } from '@repo/types';

/**
 * Creates a Supabase client instance with proper typing
 * @param url - Supabase project URL
 * @param anonKey - Supabase anonymous key
 * @returns Typed Supabase client instance
 */
export const createSupabaseClient = (url: string, anonKey: string) => {
  return createClient<Database>(url, anonKey);
};

// Export core API functions
export * from './profiles/queries';
export * from './addresses/queries';
export * from './categories/queries';
export * from './stores/queries';

// Export orders queries
export * from './orders/queries';

// Export common types
export type { Database };

// Note: React hooks are exported separately through the hooks entry point
// They are not included in the main bundle to avoid React dependencies
