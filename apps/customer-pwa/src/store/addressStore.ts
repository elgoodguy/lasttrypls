import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Address as ApiAddress, 
  addAddress as apiAddAddress,
  updateAddress as apiUpdateAddress,
  deleteAddress as apiDeleteAddress,
  setPrimaryAddress as apiSetPrimaryAddress,
  getAddresses 
} from '@repo/api-client';
import { useAuth } from '@/providers/AuthProvider';
import { useSupabase } from '@/providers/SupabaseProvider';
import { useEffect } from 'react';
import { AddressFormData } from '@/lib/validations/address';

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
  addOrUpdateAddress: (address: ApiAddress) => void;
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

export const useAddressStore = create<AddressState>()(
  persist(
    (set) => ({
      addresses: [],
      activeAddress: null,
      primaryAddress: null,
      isLoading: false,
      error: null,
      isInitialized: false,

      setAddresses: (addresses) => {
        set({ addresses });
        // Update primary address if exists
        const primary = addresses.find((addr) => addr.is_primary);
        if (primary) {
          set({ primaryAddress: primary });
        }
      },

      setActiveAddress: (address) => {
        set({ activeAddress: address });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error });
      },

      addOrUpdateAddress: (address) => {
        set((state) => {
          const existingIndex = state.addresses.findIndex((a) => a.id === address.id);
          if (existingIndex >= 0) {
            const newAddresses = [...state.addresses];
            newAddresses[existingIndex] = address;
            return { addresses: newAddresses };
          }
          return { addresses: [...state.addresses, address] };
        });
      },

      removeAddress: (addressId) => {
        set((state) => ({
          addresses: state.addresses.filter((a) => a.id !== addressId),
          activeAddress: state.activeAddress?.id === addressId ? null : state.activeAddress,
          primaryAddress: state.primaryAddress?.id === addressId ? null : state.primaryAddress,
        }));
      },

      resetStore: () => {
        set({
          addresses: [],
          activeAddress: null,
          primaryAddress: null,
          isLoading: false,
          error: null,
          isInitialized: false,
        });
      },

      resetForNewUser: () => {
        set({
          addresses: [],
          activeAddress: null,
          primaryAddress: null,
          error: null,
          isInitialized: false,
        });
      },

      addAddress: async (address) => {
        const supabase = useSupabase();
        const apiAddress = await apiAddAddress(supabase, address);
        set((state) => ({
          addresses: [...state.addresses, apiAddress],
        }));
      },

      updateAddress: async (id, address) => {
        const supabase = useSupabase();
        const apiAddress = await apiUpdateAddress(supabase, id, address);
        set((state) => ({
          addresses: state.addresses.map((a) => (a.id === id ? apiAddress : a)),
          activeAddress: state.activeAddress?.id === id ? apiAddress : state.activeAddress,
          primaryAddress: state.primaryAddress?.id === id ? apiAddress : state.primaryAddress,
        }));
      },

      deleteAddress: async (id) => {
        const supabase = useSupabase();
        await apiDeleteAddress(supabase, id);
        set((state) => ({
          addresses: state.addresses.filter((a) => a.id !== id),
          activeAddress: state.activeAddress?.id === id ? null : state.activeAddress,
          primaryAddress: state.primaryAddress?.id === id ? null : state.primaryAddress,
        }));
      },

      setPrimaryAddress: async (id) => {
        const supabase = useSupabase();
        const apiAddress = await apiSetPrimaryAddress(supabase, id);
        set((state) => ({
          addresses: state.addresses.map((a) => ({
            ...a,
            is_primary: a.id === id,
          })),
          primaryAddress: apiAddress,
        }));
      },

      clearGuestAddressStorage: () => {
        localStorage.removeItem(GUEST_ADDRESS_STORAGE_KEY);
      },

      setIsInitialized: (initialized) => {
        set({ isInitialized: initialized });
      },

      setIsLoading: (loading) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const data = JSON.parse(str);
          return {
            ...data,
            state: {
              ...data.state,
              addresses: data.state.addresses,
              activeAddress: data.state.activeAddress,
              primaryAddress: data.state.primaryAddress,
            },
          };
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);

export const useInitializeAddressStore = () => {
  const { isGuest, isLoading: isLoadingAuth } = useAuth();
  const supabase = useSupabase();
  const {
    setAddresses,
    setActiveAddress,
    setIsInitialized,
    setIsLoading,
    setError,
    isInitialized,
  } = useAddressStore();

  useEffect(() => {
    const initializeAddresses = async () => {
      if (isInitialized || isLoadingAuth) return;

      try {
        setIsLoading(true);
        if (isGuest) {
          // For guest users, try to load the last active address from localStorage
          const savedAddress = localStorage.getItem(GUEST_ADDRESS_STORAGE_KEY);
          if (savedAddress) {
            const address = JSON.parse(savedAddress);
            setActiveAddress(address);
          }
        } else {
          // For logged-in users, fetch addresses from the API
          const apiAddresses = await getAddresses(supabase);
          setAddresses(apiAddresses);
          
          // Set active address to primary if exists
          const primary = apiAddresses.find((addr) => addr.is_primary);
          if (primary) {
            setActiveAddress(primary);
          }
        }
      } catch (error) {
        console.error('Error initializing addresses:', error);
        setError(error as Error);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAddresses();
  }, [
    isGuest,
    isLoadingAuth,
    isInitialized,
    setActiveAddress,
    setAddresses,
    setError,
    setIsInitialized,
    setIsLoading,
    supabase,
  ]);
};
