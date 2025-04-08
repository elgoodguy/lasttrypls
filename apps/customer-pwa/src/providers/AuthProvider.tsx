import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useSupabase } from './SupabaseProvider'; // Hook to get Supabase client
import { useQuery } from '@tanstack/react-query';
import { getAddresses, Address } from '@repo/api-client';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  requiresAddress: boolean;
  isLoadingAddressCheck: boolean;
  // Add signIn methods later
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const supabase = useSupabase(); // Get Supabase client instance
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState<boolean>(true);

  useEffect(() => {
    // Set loading to true initially
    setIsLoadingSession(true);

    // 1. Attempt to get the initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoadingSession(false); // Stop loading after getting initial session
    }).catch((error) => {
      console.error("Error getting initial session:", error);
      setIsLoadingSession(false); // Stop loading even if there's an error
    });

    // 2. Set up the auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (_event === 'SIGNED_IN' && session) {
          setSession(session);
          setUser(session.user);
        } else if (_event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
        }
      }
    );

    // Cleanup function to unsubscribe from the listener
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]); // Re-run effect if Supabase client instance changes

  // Query to fetch user's addresses
  const { data: addresses = [], isLoading: isLoadingAddresses, isError: isAddressError } = useQuery({
    queryKey: ['addresses', user?.id],
    queryFn: () => getAddresses(supabase),
    enabled: !!user && !isLoadingSession,
    gcTime: 1000 * 60 * 30, // 30 minutes
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Determine if user needs an address
  const isLoadingAddressCheck = isLoadingSession || (!!user && isLoadingAddresses);
  const requiresAddress = !isLoadingAddressCheck && !!user && !isAddressError && (addresses as Address[]).length === 0;

  // Sign out function
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      // Handle error appropriately (e.g., show a notification)
    }
    // State will be updated by the onAuthStateChange listener
  };

  const value = {
    session,
    user,
    isLoading: isLoadingSession,
    signOut,
    requiresAddress,
    isLoadingAddressCheck,
    // Add signIn methods here later
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the Auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 