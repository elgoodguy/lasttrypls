import { createContext, useContext, ReactNode } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';

// Create a context for the Supabase client
// The type parameter can be added later once you have Database types
// export const SupabaseContext = createContext<SupabaseClient<Database> | null>(null);
export const SupabaseContext = createContext<SupabaseClient | null>(null);

// Props for the SupabaseProvider component
interface SupabaseProviderProps {
  children: ReactNode;
  supabase: SupabaseClient;
}

/**
 * Provider component that makes Supabase client available to any
 * child component that calls useSupabase().
 */
export const SupabaseProvider = ({ children, supabase }: SupabaseProviderProps) => {
  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
};

/**
 * Hook that lets you access the Supabase client
 * from any component that is a descendant of SupabaseProvider.
 */
export const useSupabase = () => {
  const supabase = useContext(SupabaseContext);
  if (!supabase) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return supabase;
}; 