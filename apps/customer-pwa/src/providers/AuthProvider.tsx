import React, { createContext, useState, useEffect, useContext, ReactNode, useMemo } from 'react';
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
    console.log('AuthProvider: Initializing session check');
    setIsLoadingSession(true);

    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('AuthProvider: Initial session loaded', { hasSession: !!session });
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoadingSession(false);
    }).catch((error) => {
      console.error("AuthProvider: Error getting initial session:", error);
      setIsLoadingSession(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log('AuthProvider: Auth state changed', { event: _event, hasSession: !!session });
        if (_event === 'SIGNED_IN' && session) {
          setSession(session);
          setUser(session.user);
        } else if (_event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
        }
      }
    );

    return () => {
      console.log('AuthProvider: Cleaning up auth listener');
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]); // Re-run effect if Supabase client instance changes

  // Query to fetch user's addresses only if we have a user
  const addressQuery = useQuery<Address[]>({
    queryKey: ['addresses', user?.id],
    queryFn: () => {
      console.log('AuthProvider: Fetching addresses for user', { userId: user?.id });
      return getAddresses(supabase);
    },
    enabled: !!user && !isLoadingSession, // Only run if we have a user and session is loaded
    gcTime: 1000 * 60 * 30, // 30 minutes
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2 // Retry failed requests twice
  });

  // Memoize derived states to prevent unnecessary re-renders
  const { addresses, isLoadingAddresses, isAddressError, isLoadingAddressCheck, requiresAddress } = useMemo(() => {
    const addresses = addressQuery.data || [];
    const isLoadingAddresses = addressQuery.isLoading;
    const isAddressError = addressQuery.isError;
    const isLoadingAddressCheck = isLoadingSession || (!!user && isLoadingAddresses);
    const requiresAddress = !isLoadingSession && !!user && !isLoadingAddressCheck && !isAddressError && addresses.length === 0;

    return {
      addresses,
      isLoadingAddresses,
      isAddressError,
      isLoadingAddressCheck,
      requiresAddress
    };
  }, [addressQuery.data, addressQuery.isLoading, addressQuery.isError, isLoadingSession, user]);

  // Log state changes
  useEffect(() => {
    console.log('AuthProvider: Current state', {
      isLoadingSession,
      isLoadingAddresses,
      isLoadingAddressCheck,
      requiresAddress,
      hasUser: !!user,
      addressCount: addresses.length
    });
  }, [isLoadingSession, isLoadingAddresses, isLoadingAddressCheck, requiresAddress, user, addresses]);

  // Sign out function
  const signOut = async () => {
    console.log('AuthProvider: Signing out');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('AuthProvider: Error signing out:', error);
    }
    // State will be updated by the onAuthStateChange listener
  };

  const value = useMemo(() => ({
    session,
    user,
    isLoading: isLoadingSession,
    signOut,
    requiresAddress,
    isLoadingAddressCheck,
    // Add signIn methods here later
  }), [session, user, isLoadingSession, requiresAddress, isLoadingAddressCheck]);

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