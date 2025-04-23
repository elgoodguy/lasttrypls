import { useEffect, useCallback } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useAddressStore } from '@/store/addressStore';
import { getAddresses } from '@repo/api-client';
import { useSupabase } from '@/providers/SupabaseProvider';

export const useInitializeAddressStore = () => {
  const { user, isGuest } = useAuth();
  const supabase = useSupabase();
  const {
    addresses,
    activeAddress,
    setAddresses,
    setActiveAddress,
    setLoading,
    setError,
  } = useAddressStore();

  // Memoize the initialization functions
  const initializeUserAddresses = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const fetchedAddresses = await getAddresses(supabase);
      if (fetchedAddresses.length > 0) {
        setAddresses(fetchedAddresses);
        if (!activeAddress) {
          setActiveAddress(fetchedAddresses[0]);
        }
      }
    } catch (error) {
      console.error('Error initializing user addresses:', error);
      setError(error instanceof Error ? error : new Error('Failed to load addresses'));
    } finally {
      setLoading(false);
    }
  }, [user, supabase, setAddresses, setActiveAddress, setLoading, setError, activeAddress]);

  const initializeGuestAddress = useCallback(() => {
    if (!isGuest) return;
    
    const guestAddress = localStorage.getItem('guestActiveAddress');
    if (guestAddress) {
      try {
        const parsedAddress = JSON.parse(guestAddress);
        setAddresses([parsedAddress]);
        setActiveAddress(parsedAddress);
      } catch (error) {
        console.error('Error parsing guest address:', error);
        setError(error instanceof Error ? error : new Error('Failed to load guest address'));
      }
    }
  }, [isGuest, setAddresses, setActiveAddress, setError]);

  // Main initialization effect
  useEffect(() => {
    if (user) {
      initializeUserAddresses();
    } else if (isGuest) {
      initializeGuestAddress();
    }
  }, [user, isGuest, initializeUserAddresses, initializeGuestAddress]);

  // Effect to handle guest-to-user transition
  useEffect(() => {
    if (user && addresses.length === 0) {
      initializeUserAddresses();
    }
  }, [user, addresses.length, initializeUserAddresses]);
}; 