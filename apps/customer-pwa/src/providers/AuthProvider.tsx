import React, { createContext, useState, useEffect, useContext, ReactNode, useMemo } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useSupabase } from './SupabaseProvider'; // Hook to get Supabase client
import { useAddressStore } from '@/store/addressStore';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isGuest: boolean;
  signOut: () => Promise<void>;
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

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        console.log('AuthProvider: Initial session loaded', { hasSession: !!session });
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoadingSession(false);
      })
      .catch(error => {
        console.error('AuthProvider: Error getting initial session:', error);
        setIsLoadingSession(false);
      });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('AuthProvider: Auth state changed', { event: _event, hasSession: !!session });
      if (_event === 'SIGNED_IN' && session) {
        // Clear guest address storage before updating session
        useAddressStore.getState().clearGuestAddressStorage();
        console.log('AuthProvider: Cleared guest address storage on sign in');
        setSession(session);
        setUser(session.user);
      } else if (_event === 'SIGNED_OUT') {
        // Clear guest address storage before clearing session
        useAddressStore.getState().clearGuestAddressStorage();
        console.log('AuthProvider: Cleared guest address storage on sign out');
        setSession(null);
        setUser(null);
      }
    });

    return () => {
      console.log('AuthProvider: Cleaning up auth listener');
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]); // Re-run effect if Supabase client instance changes

  // Sign out function
  const signOut = async () => {
    console.log('AuthProvider: Signing out');
    // Clear guest address storage before signing out
    useAddressStore.getState().clearGuestAddressStorage();
    console.log('AuthProvider: Cleared guest address storage before sign out');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('AuthProvider: Error signing out:', error);
    }
    // State will be updated by the onAuthStateChange listener
  };

  const value = useMemo(
    () => ({
      session,
      user,
      isLoading: isLoadingSession,
      isGuest: !isLoadingSession && !user,
      signOut,
    }),
    [session, user, isLoadingSession]
  );

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
