import React, { createContext, useState, useEffect, useContext, ReactNode, useMemo, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useSupabase } from './SupabaseProvider'; // Hook to get Supabase client
import { useAddressStore } from '@/store/addressStore';
import { useCartStore } from '@/store/cartStore';

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
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [initialSessionProcessed, setInitialSessionProcessed] = useState(false);

  // Memoize the signOut function
  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
  }, [supabase]);

  // Memoize the store reset functions
  const resetStores = useCallback(() => {
    useAddressStore.getState().resetStore();
    useCartStore.getState().clearCart();
  }, []);

  const resetForNewUser = useCallback(() => {
    useCartStore.getState().clearCart();
    useAddressStore.getState().clearGuestAddressStorage();
    useAddressStore.getState().resetForNewUser();
  }, []);

  // Efecto para la carga inicial de sesión
  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setInitialSessionProcessed(true);
        setIsLoadingSession(false);
      })
      .catch(error => {
        setSession(null);
        setUser(null);
        setInitialSessionProcessed(true);
        setIsLoadingSession(false);
      });
  }, [supabase]);

  // Efecto para el listener de cambios de autenticación
  useEffect(() => {
    // No configures el listener hasta que la carga inicial esté completa
    if (!initialSessionProcessed) return;

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (_event === 'SIGNED_IN' && session) {
        const currentUser = user; // Captura el estado actual ANTES de los sets
        if (!currentUser && session.user) {
          resetForNewUser();
        }
        setSession(session);
        setUser(session.user);

      } else if (_event === 'SIGNED_OUT') {
        resetStores();
        setSession(null);
        setUser(null);
        window.location.assign('/');

      } else if (_event === 'INITIAL_SESSION' && session) {
        setSession(session);
        setUser(session.user);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase, initialSessionProcessed, resetStores, resetForNewUser, user]);

  const value = useMemo(
    () => ({
      session,
      user,
      isLoading: isLoadingSession,
      isGuest: !isLoadingSession && !user,
      signOut,
    }),
    [session, user, isLoadingSession, signOut]
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
