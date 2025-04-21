import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Address } from '@repo/api-client';
import { useAuth } from '@/providers/AuthProvider';
import { useSupabase } from '@/providers/SupabaseProvider';
import { getAddresses } from '@repo/api-client';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { AddressFormData } from '@/lib/validations/address';
import React from 'react';

export const GUEST_ADDRESS_STORAGE_KEY = 'guestActiveAddress';
const STORAGE_KEY = 'customer-address-storage';

interface AddressState {
  addresses: Address[];
  activeAddress: Address | null;
  primaryAddress: Address | null;
  isLoading: boolean;
  error: Error | null;
  isInitialized: boolean;

  setAddresses: (addresses: Address[]) => void;
  setActiveAddress: (address: Address | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  addOrUpdateAddress: (address: Address) => void;
  removeAddress: (addressId: string) => void;
  resetStore: () => void;
  resetForNewUser: () => void;
  addAddress: (address: AddressFormData) => Promise<void>;
  updateAddress: (id: string, address: AddressFormData) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setPrimaryAddress: (id: string) => Promise<void>;
  clearGuestAddressStorage: () => void;
  setIsInitialized: (initialized: boolean) => void;
  setIsLoading: (loading: boolean) => void;
}

const initialState = {
  addresses: [],
  activeAddress: null,
  primaryAddress: null,
  isLoading: true,
  error: null,
  isInitialized: false,
};

export const useAddressStore = create<AddressState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setLoading: loading => set({ isLoading: loading, error: null }),

      setIsLoading: loading => set({ isLoading: loading }),

      setIsInitialized: initialized => set({ isInitialized: initialized }),

      setError: error => set({ error: error, isLoading: false }),

      setAddresses: addresses => {
        const primary = addresses.find(addr => addr.is_primary) || null;
        let currentActive = get().activeAddress;
        
        // Only keep currentActive if it exists in the new addresses list
        let newActive = currentActive && addresses.some(a => a.id === currentActive?.id)
          ? currentActive
          : primary || addresses[0] || null;

        set({
          addresses: addresses,
          primaryAddress: primary,
          activeAddress: newActive,
          isLoading: false,
          error: null,
          isInitialized: true,
        });
      },

      setActiveAddress: (address) => {
        console.log('[addressStore setActiveAddress] Called with:', address);
        set({ activeAddress: address });
        console.log('[addressStore setActiveAddress] State potentially updated. New activeAddress:', get().activeAddress);
      },

      addOrUpdateAddress: address =>
        set(state => {
          const index = state.addresses.findIndex(a => a.id === address.id);
          let newAddresses = [...state.addresses];
          if (index > -1) {
            newAddresses[index] = address;
          } else {
            newAddresses.push(address);
          }

          const newPrimary = newAddresses.find(addr => addr.is_primary) || null;
          let newActive = state.activeAddress;

          if (address.is_primary) {
            newActive = address;
          } else if (!state.activeAddress && newAddresses.length > 0) {
            newActive = newPrimary || newAddresses[0];
          }

          return {
            addresses: newAddresses,
            primaryAddress: newPrimary,
            activeAddress: newActive,
          };
        }),

      removeAddress: addressId =>
        set(state => {
          const newAddresses = state.addresses.filter(a => a.id !== addressId);
          const removedAddressWasActive = state.activeAddress?.id === addressId;
          const removedAddressWasPrimary = state.primaryAddress?.id === addressId;

          let newPrimary = removedAddressWasPrimary ? null : state.primaryAddress;
          if (!newPrimary && !removedAddressWasPrimary) {
            newPrimary = newAddresses.find(addr => addr.is_primary) || null;
          }

          let newActive = state.activeAddress;
          if (removedAddressWasActive) {
            newActive = newPrimary || newAddresses[0] || null;
          }

          return {
            addresses: newAddresses,
            primaryAddress: newPrimary,
            activeAddress: newActive,
          };
        }),

      resetStore: () => {
        localStorage.removeItem(GUEST_ADDRESS_STORAGE_KEY);
        set({
          ...initialState,
          isLoading: false,
          isInitialized: true
        });
      },

      resetForNewUser: () => {
        localStorage.removeItem(GUEST_ADDRESS_STORAGE_KEY);
        set({
          ...initialState,
          isLoading: true,
          isInitialized: false
        });
      },

      addAddress: async (address: AddressFormData) => {
        // Implementation will be added later
      },

      updateAddress: async (id: string, address: AddressFormData) => {
        // Implementation will be added later
      },

      deleteAddress: async (id: string) => {
        // Implementation will be added later
      },

      setPrimaryAddress: async (id: string) => {
        // Implementation will be added later
      },

      clearGuestAddressStorage: () => {
        localStorage.removeItem(GUEST_ADDRESS_STORAGE_KEY);
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({ activeAddress: state.activeAddress }),
      // Ensure we clear guest address from storage on hydration if needed
      onRehydrateStorage: () => (state) => {
        if (state?.activeAddress?.id === 'guest-address') {
          state.activeAddress = null;
        }
      }
    }
  )
);

export const useInitializeAddressStore = () => {
  const { user } = useAuth();
  const currentUserId = user?.id;
  const supabase = useSupabase();
  const { setAddresses, setIsInitialized, setIsLoading } = useAddressStore();

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!currentUserId) {
        setIsInitialized(true);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const addresses = await getAddresses(supabase);
        setAddresses(addresses);
      } catch (error) {
        console.error('[useInitializeAddressStore] Error fetching addresses:', error);
      } finally {
        setIsInitialized(true);
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, [currentUserId, supabase]);
};
