import { create } from 'zustand';
import { Address } from '@repo/api-client';
import { useAuth } from '@/providers/AuthProvider';
import { useSupabase } from '@/providers/SupabaseProvider';
import { getAddresses } from '@repo/api-client';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

interface AddressState {
  addresses: Address[];
  activeAddress: Address | null;
  primaryAddress: Address | null;
  isLoading: boolean;
  error: Error | null;

  setAddresses: (addresses: Address[]) => void;
  setActiveAddress: (address: Address | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  addOrUpdateAddress: (address: Address) => void;
  removeAddress: (addressId: string) => void;
}

export const useAddressStore = create<AddressState>((set, get) => ({
  addresses: [],
  activeAddress: null,
  primaryAddress: null,
  isLoading: true,
  error: null,

  setLoading: (loading) => set({ isLoading: loading, error: null }),

  setError: (error) => set({ error: error, isLoading: false }),

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
}));

export const useInitializeAddressStore = () => {
  const { user } = useAuth();
  const supabase = useSupabase();
  const { isLoading, setLoading, setError, setAddresses } = useAddressStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (user && isLoading) {
      setLoading(true);
      console.log("Initializing address store for user:", user.id);

      const cachedAddresses = queryClient.getQueryData<Address[]>(['addresses', user.id]);
      if (cachedAddresses) {
        console.log("Using cached addresses for store initialization");
        setAddresses(cachedAddresses);
      } else {
        getAddresses(supabase)
          .then(data => {
            console.log("Fetched addresses for store initialization:", data);
            setAddresses(data);
            queryClient.setQueryData(['addresses', user.id], data);
          })
          .catch(err => {
            console.error("Failed to initialize address store:", err);
            setError(err);
          });
      }
    } else if (!user && !isLoading) {
      console.log("Resetting address store due to user logout");
      setAddresses([]);
      setLoading(true);
      setError(null);
    }
  }, [user, isLoading, setLoading, setError, setAddresses, supabase, queryClient]);
}; 