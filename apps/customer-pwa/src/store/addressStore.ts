import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import {
  Address as ApiAddress,
  addAddress as apiAddAddress,
  updateAddress as apiUpdateAddress,
  deleteAddress as apiDeleteAddress,
  setPrimaryAddress as apiSetPrimaryAddress,
} from '@repo/api-client';
import { AddressFormData } from '@/lib/validations/address';
import type { SupabaseClient } from '@supabase/supabase-js';

export const GUEST_ADDRESS_STORAGE_KEY = 'guestActiveAddress';
const STORAGE_KEY = 'customer-address-storage';

interface AddressState {
  addresses: ApiAddress[];
  activeAddress: ApiAddress | null;
  primaryAddress: ApiAddress | null;
  isLoading: boolean;
  error: Error | null;
  isInitialized: boolean;

  setAddresses: (addresses: ApiAddress[]) => void;
  setActiveAddress: (address: ApiAddress | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  addOrUpdateAddressLocally: (address: ApiAddress) => void;
  removeAddressLocally: (addressId: string) => void;
  setPrimaryAddressLocally: (addressId: string) => void;
  resetStore: () => void;
  resetForNewUser: () => void;
  clearGuestAddressStorage: () => void;
  setIsInitialized: (initialized: boolean) => void;
}

export const useAddressStore = create<AddressState>()(
  devtools(
    persist(
      (set, get) => ({
        addresses: [],
        activeAddress: null,
        primaryAddress: null,
        isLoading: true,
        error: null,
        isInitialized: false,

        setAddresses: (addresses) => {
          const primary = addresses.find((addr) => addr.is_primary);
          set({ addresses: addresses, primaryAddress: primary || null, isLoading: false, error: null });
          console.log('[addressStore] Addresses set:', addresses);
          if (!get().activeAddress && primary) {
             console.log('[addressStore] Setting primary as active because no active address was set.');
             set({ activeAddress: primary });
          } else if (!get().activeAddress && addresses.length > 0) {
            console.log('[addressStore] No primary, setting first address as active.');
            set({ activeAddress: addresses[0] });
          }
        },

        setActiveAddress: (address) => {
           console.log('[addressStore] Setting active address:', address);
           set({ activeAddress: address });
           if(address?.is_primary){
             set(state => ({ primaryAddress: address }));
           }
        },

        setLoading: (loading) => {
          set({ isLoading: loading });
        },

        setError: (error) => {
          console.error('[addressStore] Setting error:', error);
          set({ error: error, isLoading: false });
        },

        addOrUpdateAddressLocally: (address) => {
          set((state) => {
            const existingIndex = state.addresses.findIndex((a) => a.id === address.id);
            let newAddresses: ApiAddress[];
            if (existingIndex >= 0) {
              newAddresses = [...state.addresses];
              newAddresses[existingIndex] = address;
              console.log('[addressStore] Updating address locally:', address);
            } else {
              newAddresses = [...state.addresses, address];
              console.log('[addressStore] Adding address locally:', address);
            }
            if (address.is_primary) {
              newAddresses = newAddresses.map(a => ({ ...a, is_primary: a.id === address.id }));
              return { addresses: newAddresses, primaryAddress: address };
            }
            return { addresses: newAddresses };
          });
        },

        removeAddressLocally: (addressId) => {
          set((state) => {
            const newAddresses = state.addresses.filter((a) => a.id !== addressId);
            let newActive = state.activeAddress;
            let newPrimary = state.primaryAddress;

            if (state.activeAddress?.id === addressId) {
              console.log('[addressStore] Active address removed, selecting new active.');
              newActive = state.primaryAddress?.id !== addressId ? state.primaryAddress : (newAddresses[0] || null);
            }
            if (state.primaryAddress?.id === addressId) {
               console.log('[addressStore] Primary address removed, selecting new primary.');
               newPrimary = newAddresses.find(a => a.is_primary) || (newAddresses[0] || null);
            }
            console.log('[addressStore] Removing address locally:', addressId);
            return { addresses: newAddresses, activeAddress: newActive, primaryAddress: newPrimary };
          });
        },

         setPrimaryAddressLocally: (addressId) => {
          set((state) => {
            let newPrimary: ApiAddress | null = null;
            const newAddresses = state.addresses.map((a) => {
               const isNowPrimary = a.id === addressId;
               if (isNowPrimary) newPrimary = a;
               return { ...a, is_primary: isNowPrimary };
            });
            console.log('[addressStore] Setting primary address locally:', addressId);
            const newActive = state.activeAddress?.id === addressId ? newPrimary : state.activeAddress;
            return { addresses: newAddresses, primaryAddress: newPrimary, activeAddress: newActive ?? newPrimary };
           });
         },

        resetStore: () => {
          console.log('[addressStore] Resetting store completely.');
          localStorage.removeItem(GUEST_ADDRESS_STORAGE_KEY);
          set({
            addresses: [],
            activeAddress: null,
            primaryAddress: null,
            isLoading: true,
            error: null,
            isInitialized: false,
          });
        },

        resetForNewUser: () => {
          console.log('[addressStore] Resetting for new user.');
          set({
            addresses: [],
            activeAddress: null,
            primaryAddress: null,
            error: null,
            isInitialized: false,
            isLoading: true,
          });
        },

        clearGuestAddressStorage: () => {
          console.log('[addressStore] Clearing guest address storage.');
          localStorage.removeItem(GUEST_ADDRESS_STORAGE_KEY);
        },

        setIsInitialized: (initialized) => {
          set({ isInitialized: initialized });
        },
      }),
      {
        name: STORAGE_KEY,
        storage: createJSONStorage(() => localStorage),
        partialize: (_state) => ({
          addresses: _state.addresses,
          activeAddress: _state.activeAddress,
          primaryAddress: _state.primaryAddress,
          isInitialized: _state.isInitialized
        }),
      }
    ),
    {
      name: "AddressStore",
    }
  )
);

export const addApiAddress = async (supabase: SupabaseClient, addressData: AddressFormData): Promise<ApiAddress> => {
  const newAddress = await apiAddAddress(supabase, addressData);
  useAddressStore.getState().addOrUpdateAddressLocally(newAddress);
  if (useAddressStore.getState().addresses.length === 1 || addressData.is_primary) {
    useAddressStore.getState().setPrimaryAddressLocally(newAddress.id);
    useAddressStore.getState().setActiveAddress(newAddress);
  }
  return newAddress;
};

export const updateApiAddress = async (supabase: SupabaseClient, addressId: string, updates: AddressFormData): Promise<ApiAddress> => {
  const updatedAddress = await apiUpdateAddress(supabase, addressId, updates);
  useAddressStore.getState().addOrUpdateAddressLocally(updatedAddress);
  if (updates.is_primary) {
     useAddressStore.getState().setPrimaryAddressLocally(addressId);
     useAddressStore.getState().setActiveAddress(updatedAddress);
  } else if (useAddressStore.getState().primaryAddress?.id === addressId && !updates.is_primary) {
     const newPrimary = useAddressStore.getState().addresses.find(a => a.is_primary && a.id !== addressId);
     useAddressStore.setState({ primaryAddress: newPrimary || null });
  }
  return updatedAddress;
};

export const deleteApiAddress = async (supabase: SupabaseClient, addressId: string): Promise<void> => {
  await apiDeleteAddress(supabase, addressId);
  useAddressStore.getState().removeAddressLocally(addressId);
};

export const setApiPrimaryAddress = async (supabase: SupabaseClient, addressId: string): Promise<void> => {
  const primaryAddress = await apiSetPrimaryAddress(supabase, addressId);
  useAddressStore.getState().setPrimaryAddressLocally(primaryAddress.id);
  useAddressStore.getState().setActiveAddress(primaryAddress);
};
