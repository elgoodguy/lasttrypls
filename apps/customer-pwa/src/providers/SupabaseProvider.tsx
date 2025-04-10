import React, { createContext, useContext, ReactNode } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
// import { Database } from '@repo/types/database'; // Import if using DB types

// Define the context type, potentially using the generated Database type
// type SupabaseContextType = SupabaseClient<Database> | null;
type SupabaseContextType = SupabaseClient | null;

const SupabaseContext = createContext<SupabaseContextType>(null);

// Props for the SupabaseProvider component
interface SupabaseProviderProps {
  children: ReactNode;
  supabase: SupabaseClient; // Or SupabaseClient<Database>
}

/**
 * Provider component that makes Supabase client available to any
 * child component that calls useSupabase().
 */
export const SupabaseProvider: React.FC<SupabaseProviderProps> = ({ children, supabase }) => {
  return <SupabaseContext.Provider value={supabase}>{children}</SupabaseContext.Provider>;
};

/**
 * Hook that lets you access the Supabase client
 * from any component that is a descendant of SupabaseProvider.
 */
export const useSupabase = (): SupabaseClient => {
  // Or SupabaseClient<Database>
  const context = useContext(SupabaseContext);
  if (context === null) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};
