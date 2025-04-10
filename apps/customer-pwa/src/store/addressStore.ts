import { create } from 'zustand';
import { Address } from '@repo/api-client';
import { useAuth } from '@/providers/AuthProvider';
import { useSupabase } from '@/providers/SupabaseProvider';
import { getAddresses } from '@repo/api-client';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { AddressFormData } from '@/lib/validations/address';

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
}

const initialState = {
  addresses: [],
  activeAddress: null,
  primaryAddress: null,
  isLoading: true,
  error: null,
  isInitialized: false,
};

export const useAddressStore = create<AddressState>((set, get) => ({
  ...initialState,

  setLoading: (loading) => set({ isLoading: loading, error: null, isInitialized: false }),

  setError: (error) => set({ error: error, isLoading: false, isInitialized: true }),

  setAddresses: (addresses) => {
    const primary = addresses.find(addr => addr.is_primary) || null;
    let currentActive = get().activeAddress;
    let newActive = currentActive && addresses.some(a => a.id === currentActive?.id)
      ? currentActive
      : (primary || addresses[0] || null);

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
    if (address && !get().addresses.some(a => a.id === address.id)) {
      console.warn("Attempted to set an active address that is not in the store's list.");
      return;
    }
    set({ activeAddress: address });
  },

  addOrUpdateAddress: (address) => set((state) => {
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

  removeAddress: (addressId) => set((state) => {
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

  resetStore: () => set(initialState),

  addAddress: async (address: AddressFormData) => {
    const newAddress: Address = {
      ...address,
      id: Math.random().toString(36).substr(2, 9),
      user_id: '', // This will be set by the backend
      is_primary: get().addresses.length === 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    set((state) => ({
      addresses: [...state.addresses, newAddress]
    }));
  },

  updateAddress: async (id: string, address: AddressFormData) => {
    set((state) => ({
      addresses: state.addresses.map((a) =>
        a.id === id
          ? {
              ...a,
              ...address,
              updated_at: new Date().toISOString()
            }
          : a
      )
    }));
  },

  deleteAddress: async (id: string) => {
    set((state) => ({
      addresses: state.addresses.filter((a) => a.id !== id)
    }));
  },

  setPrimaryAddress: async (id: string) => {
    set((state) => ({
      addresses: state.addresses.map((a) => ({
        ...a,
        is_primary: a.id === id,
        updated_at: new Date().toISOString()
      }))
    }));
  }
}));

export const useInitializeAddressStore = () => {
  const { user } = useAuth();
  const supabase = useSupabase();
  const { isInitialized, setLoading, setError, setAddresses, resetStore } = useAddressStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (user && !isInitialized) {
      setLoading(true);
      console.log("Initializing address store for user:", user.id);

      getAddresses(supabase)
        .then(data => {
          console.log("Fetched addresses for store initialization:", data);
          setAddresses(data || []); // Asegurarnos de que siempre sea un array
          queryClient.setQueryData(['addresses', user.id], data);
        })
        .catch(err => {
          console.error("Failed to initialize address store:", err);
          setError(err);
        });
    } else if (!user && isInitialized) {
      console.log("Resetting address store due to user logout");
      resetStore();
    }
  }, [user, isInitialized, setLoading, setError, setAddresses, resetStore, supabase, queryClient]);
}; 