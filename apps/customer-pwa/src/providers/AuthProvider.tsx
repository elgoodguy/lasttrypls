import React, { createContext, useState, useEffect, useContext, ReactNode, useMemo } from 'react';
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

  // Efecto para la carga inicial de sesión
  useEffect(() => {
    console.log('[AuthProvider Initial Load] Running initial session check.');
    
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setInitialSessionProcessed(true);
        setIsLoadingSession(false);
        console.log('[AuthProvider Initial Load] Finished. Session available:', !!session);
      })
      .catch(error => {
        console.error('[AuthProvider Initial Load] Error getting session:', error);
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

    console.log('[AuthProvider Listener] Setting up auth state change listener.');

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('[AuthProvider Listener] Event:', _event, 'Session:', !!session);

      if (_event === 'SIGNED_IN' && session) {
        const currentUser = user; // Captura el estado actual ANTES de los sets
        if (!currentUser && session.user) {
          console.log('[AuthProvider Listener] SIGNED_IN - Guest-to-User transition. Clearing guest data.');
          useCartStore.getState().clearCart();
          useAddressStore.getState().clearGuestAddressStorage();
          useAddressStore.getState().resetForNewUser();
        } else {
          console.log('[AuthProvider Listener] SIGNED_IN - Event received, but not clearing data (likely refresh or token update).');
        }
        setSession(session);
        setUser(session.user);

      } else if (_event === 'SIGNED_OUT') {
        console.log('[AuthProvider Listener] SIGNED_OUT - Clearing stores and resetting state.');
        useAddressStore.getState().resetStore();
        useCartStore.getState().clearCart();
        setSession(null);
        setUser(null);
        setInitialSessionProcessed(false); // Resetear para la próxima carga
        window.location.assign('/');

      } else if (_event === 'INITIAL_SESSION' && session) {
        console.log('[AuthProvider Listener] INITIAL_SESSION - Updating state.');
        setSession(session);
        setUser(session.user);
      }
    });

    return () => {
      console.log('[AuthProvider Listener] Cleaning up auth state change listener.');
      authListener?.subscription.unsubscribe();
    };
  }, [supabase, initialSessionProcessed, user]); // Incluimos user para acceder a su valor actual en el callback

  // Sign out function
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('[AuthProvider] Error signing out:', error);
    }
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
