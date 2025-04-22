import { useEffect, useCallback } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useAddressStore } from '@/store/addressStore';
import { useCartStore } from '@/store/cartStore';

export const useInitializeAddressStore = () => {
  const { user, isGuest } = useAuth();
  const {
    addresses,
    activeAddress,
    setAddresses,
    setActiveAddress,
    setLoading,
    setError,
    fetchAddresses,
    setGuestAddress,
    getGuestAddress,
  } = useAddressStore();

  // Memoize the initialization functions
  const initializeUserAddresses = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const fetchedAddresses = await fetchAddresses();
      if (fetchedAddresses.length > 0) {
        setAddresses(fetchedAddresses);
        if (!activeAddress) {
          setActiveAddress(fetchedAddresses[0]);
        }
      }
    } catch (error) {
      console.error('Error initializing user addresses:', error);
      setError(error instanceof Error ? error.message : 'Failed to load addresses');
    } finally {
      setLoading(false);
    }
  }, [user, fetchAddresses, setAddresses, setActiveAddress, setLoading, setError, activeAddress]);

  const initializeGuestAddress = useCallback(() => {
    if (!isGuest) return;
    
    const guestAddress = getGuestAddress();
    if (guestAddress) {
      setAddresses([guestAddress]);
      setActiveAddress(guestAddress);
    }
  }, [isGuest, getGuestAddress, setAddresses, setActiveAddress]);

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