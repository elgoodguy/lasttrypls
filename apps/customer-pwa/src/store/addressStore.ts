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
  addAddress: (address: AddressFormData) => Promise<void>;
  updateAddress: (id: string, address: AddressFormData) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setPrimaryAddress: (id: string) => Promise<void>;
  clearGuestAddressStorage: () => void;
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
          console.warn("Attempted to set an active address that is not in the store's list.");
          return;
        }
        set({ activeAddress: address });
        
        // If this is a guest address, persist it to localStorage
        if (address?.id === 'guest-address') {
          localStorage.setItem(GUEST_ADDRESS_STORAGE_KEY, JSON.stringify(address));
        }
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
        set(initialState);
      },

      clearGuestAddressStorage: () => {
        localStorage.removeItem(GUEST_ADDRESS_STORAGE_KEY);
      },

      addAddress: async (address: AddressFormData) => {
        const newAddress: Address = {
          ...address,
          id: Math.random().toString(36).substr(2, 9),
          user_id: '', // This will be set by the backend
          is_primary: get().addresses.length === 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        set(state => ({
          addresses: [...state.addresses, newAddress],
        }));
      },

      updateAddress: async (id: string, address: AddressFormData) => {
        set(state => ({
          addresses: state.addresses.map(a =>
            a.id === id
              ? {
                  ...a,
                  ...address,
                  updated_at: new Date().toISOString(),
                }
              : a
          ),
        }));
      },

      deleteAddress: async (id: string) => {
        set(state => ({
          addresses: state.addresses.filter(a => a.id !== id),
        }));
      },

      setPrimaryAddress: async (id: string) => {
        set(state => ({
          addresses: state.addresses.map(a => ({
            ...a,
            is_primary: a.id === id,
            updated_at: new Date().toISOString(),
          })),
        }));
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        addresses: state.addresses,
        activeAddress: state.activeAddress,
        primaryAddress: state.primaryAddress,
        isInitialized: state.isInitialized,
      }),
      onRehydrateStorage: () => (state) => {
        console.log('Address store hydrated from localStorage:', state);
      },
    }
  )
);

export const useInitializeAddressStore = () => {
  const { user } = useAuth();
  const supabase = useSupabase();
  const queryClient = useQueryClient();
  const { setLoading, setError, setAddresses, resetStore, isInitialized, clearGuestAddressStorage } = useAddressStore();

  useEffect(() => {
    console.log('useInitializeAddressStore - useEffect triggered', {
      hasUser: !!user,
      isInitialized,
      user: user?.id
    });

    if (!user) {
      // Handle guest user case
      if (!isInitialized) {
        console.log('useInitializeAddressStore - Initializing for guest user');
        const storedGuestAddress = localStorage.getItem(GUEST_ADDRESS_STORAGE_KEY);
        
        if (storedGuestAddress) {
          try {
            const guestAddress = JSON.parse(storedGuestAddress);
            console.log('useInitializeAddressStore - Loading guest address from localStorage:', guestAddress);
            setAddresses([guestAddress]);
          } catch (error) {
            console.error('useInitializeAddressStore - Failed to parse stored guest address:', error);
            localStorage.removeItem(GUEST_ADDRESS_STORAGE_KEY);
            setAddresses([]);
          }
        } else {
          console.log('useInitializeAddressStore - Initializing empty store for guest user');
          setAddresses([]);
        }
      }
    } else {
      // Handle authenticated user case
      clearGuestAddressStorage();
      
      if (!isInitialized) {
        console.log('useInitializeAddressStore - Initializing for authenticated user:', user.id);
        setLoading(true);

        console.log('useInitializeAddressStore - Attempting to fetch addresses for user:', user.id);
        getAddresses(supabase)
          .then(data => {
            console.log('useInitializeAddressStore - Successfully fetched addresses:', {
              addressCount: data?.length || 0,
              addresses: data
            });
            setAddresses(data || []);
            queryClient.setQueryData(['addresses', user.id], data);
          })
          .catch(err => {
            console.error('useInitializeAddressStore - Failed to fetch addresses:', err);
            setError(err);
          });
      }
    }
  }, [user, isInitialized, setLoading, setError, setAddresses, resetStore, supabase, queryClient, clearGuestAddressStorage]);
};
