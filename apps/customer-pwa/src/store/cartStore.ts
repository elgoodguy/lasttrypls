import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';

export interface CartItem {
  id: string; // Unique client-side ID
  productId: string;
  storeId: string;
  name: string;
  quantity: number;
  selectedOptionsDescription: string;
  selectedOptions: Record<string, any>;
  basePrice: number;
  optionsPrice: number;
  itemNotes?: string;
}

interface CartState {
  items: CartItem[];
  
  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Selectors
  getTotalItems: () => number;
  getSubtotal: () => number;
  getItemsByStore: () => Record<string, CartItem[]>;
}

const STORAGE_KEY = 'customer-cart-storage';

// Helper function to compare selected options
const areOptionsEqual = (a: Record<string, any>, b: Record<string, any>): boolean => {
  const aKeys = Object.keys(a).sort();
  const bKeys = Object.keys(b).sort();
  
  if (aKeys.length !== bKeys.length) return false;
  
  return aKeys.every(key => {
    const aValue = a[key];
    const bValue = b[key];
    
    if (typeof aValue === 'object' && aValue !== null) {
      return JSON.stringify(aValue) === JSON.stringify(bValue);
    }
    
    return aValue === bValue;
  });
};

// Create initial state factory to ensure consistent state shape
const createInitialState = (): Omit<CartState, 'addItem' | 'removeItem' | 'updateQuantity' | 'clearCart' | 'getTotalItems' | 'getSubtotal' | 'getItemsByStore'> => ({
  items: [],
});

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        ...createInitialState(),

        addItem: (newItem) => {
          set((state) => {
            const existingItem = state.items.find(
              (item) =>
                item.productId === newItem.productId &&
                areOptionsEqual(item.selectedOptions, newItem.selectedOptions)
            );

            const newItems = existingItem
              ? state.items.map((item) =>
                  item.id === existingItem.id
                    ? { ...item, quantity: item.quantity + newItem.quantity }
                    : item
                )
              : [
                  ...state.items,
                  {
                    ...newItem,
                    id: Math.random().toString(36).substr(2, 9),
                  },
                ];

            return { ...state, items: newItems };
          });
        },

        removeItem: (itemId) => {
          set((state) => ({
            ...state,
            items: state.items.filter((item) => item.id !== itemId),
          }));
        },

        updateQuantity: (itemId, quantity) => {
          if (quantity < 1) return;
          set((state) => ({
            ...state,
            items: state.items.map((item) =>
              item.id === itemId ? { ...item, quantity } : item
            ),
          }));
        },

        clearCart: () => {
          set((state) => ({ ...state, items: [] }));
        },

        getTotalItems: () => {
          return get().items.reduce((sum, item) => sum + item.quantity, 0);
        },

        getSubtotal: () => get().items.reduce(
          (total, item) => total + (item.basePrice + item.optionsPrice) * item.quantity,
          0
        ),

        getItemsByStore: () => {
          const items = get().items;
          const storeItems: Record<string, CartItem[]> = {};
          items.forEach((item) => {
            if (!storeItems[item.storeId]) {
              storeItems[item.storeId] = [];
            }
            storeItems[item.storeId].push(item);
          });
          return storeItems;
        },
      }),
      {
        name: STORAGE_KEY,
        storage: createJSONStorage(() => ({
          getItem: (name) => {
            const str = localStorage.getItem(name);
            if (!str) return null;
            try {
              return JSON.parse(str);
            } catch (error) {
              console.error('[cartStore] Error parsing stored data:', error);
              return null;
            }
          },
          setItem: (name, value) => {
            localStorage.setItem(name, JSON.stringify(value));
          },
          removeItem: (name) => {
            localStorage.removeItem(name);
          },
        }))
      }
    ),
    {
      name: 'CartStore',
      enabled: true,
    }
  )
); 