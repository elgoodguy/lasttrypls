import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useSupabase } from './SupabaseProvider'; // Hook to get Supabase client

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
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
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start loading

  useEffect(() => {
    // Set loading to true initially
    setIsLoading(true);

    // 1. Attempt to get the initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false); // Stop loading after getting initial session
    }).catch((error) => {
      console.error("Error getting initial session:", error);
      setIsLoading(false); // Stop loading even if there's an error
    });

    // 2. Set up the auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("Auth state changed:", _event, session); // Log for debugging
        setSession(session);
        setUser(session?.user ?? null);
        // Note: We don't set loading false here again, only on initial load
      }
    );

    // Cleanup function to unsubscribe from the listener
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]); // Re-run effect if Supabase client instance changes

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
    isLoading,
    signOut,
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