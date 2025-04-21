import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Address } from '@repo/api-client';
import { useAuth } from '@/providers/AuthProvider';
import { useSupabase } from '@/providers/SupabaseProvider';
import { getAddresses } from '@repo/api-client';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { AddressFormData } from '@/lib/validations/address';

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
  startInitialization: () => void;
  finishInitialization: (error: Error | null) => void;
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

      setLoading: loading => set({ isLoading: loading, error: null, isInitialized: false }),

      setError: error => set({ error: error, isLoading: false, isInitialized: true }),

      setAddresses: addresses => {
        const primary = addresses.find(addr => addr.is_primary) || null;
        let currentActive = get().activeAddress;
        let newActive =
          currentActive && addresses.some(a => a.id === currentActive?.id)
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

      setActiveAddress: address => {
        if (address && !get().addresses.some(a => a.id === address.id)) {
          // For guest addresses, we don't need to check if it's in the addresses list
          if (address.id !== 'guest-address') {
            console.warn("Attempted to set an active address that is not in the store's list.");
            return;
          }
        }
        set({ activeAddress: address });
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
        set({
          ...initialState,
          isLoading: false,
          isInitialized: true
        });
      },

      resetForNewUser: () => {
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

      startInitialization: () => {
        set({ isLoading: true, isInitialized: false, error: null });
      },

      finishInitialization: (error: Error | null) => {
        set({
          isLoading: false,
          isInitialized: true,
          error: error
        });
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({ activeAddress: state.activeAddress })
    }
  )
);

export const useInitializeAddressStore = () => {
  const { user } = useAuth();
  const supabase = useSupabase();
  const queryClient = useQueryClient();
  const {
    setAddresses,
    setLoading,
    setError,
    startInitialization,
    finishInitialization,
    resetStore,
    activeAddress
  } = useAddressStore();

  useEffect(() => {
    const currentUserId = user?.id;
    
    // If we already have an activeAddress (from persist), we can skip initialization
    if (activeAddress) {
      finishInitialization(null);
      return;
    }

    startInitialization();

    if (!currentUserId) {
      resetStore();
      finishInitialization(null);
      return;
    }

    // Handle authenticated user
    console.log('[useInitializeAddressStore] Fetching addresses for user:', currentUserId);
    
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Address fetch timed out after 15s')), 15000)
    );

    Promise.race<Address[]>([
      getAddresses(supabase),
      timeoutPromise
    ])
      .then(data => {
        console.log('[useInitializeAddressStore] Successfully fetched addresses:', {
          addressCount: data?.length || 0
        });
        setAddresses(data || []);
        finishInitialization(null);
        queryClient.setQueryData(['addresses', currentUserId], data);
      })
      .catch(err => {
        console.error('[useInitializeAddressStore] Failed to fetch addresses:', err);
        finishInitialization(err);
      });
  }, [user?.id, supabase, queryClient, setAddresses, setLoading, setError, startInitialization, finishInitialization, resetStore, activeAddress]);
};
