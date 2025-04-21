import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        set((state) => {
          // Check for existing item with same productId and selectedOptions
          const existingItem = state.items.find(
            (item) =>
              item.productId === newItem.productId &&
              areOptionsEqual(item.selectedOptions, newItem.selectedOptions)
          );

          let newState;
          if (existingItem) {
            // If item exists, update quantity
            newState = {
              items: state.items.map((item) =>
                item.id === existingItem.id
                  ? { ...item, quantity: item.quantity + newItem.quantity }
                  : item
              ),
            };
          } else {
            // If item doesn't exist, add new item with generated ID
            newState = {
              items: [
                ...state.items,
                {
                  ...newItem,
                  id: Math.random().toString(36).substr(2, 9),
                },
              ],
            };
          }

          // Log the new total items count
          const totalItems = newState.items.reduce((sum, item) => sum + item.quantity, 0);
          console.log('[cartStore addItem] New total items:', totalItems);
          console.log('[cartStore addItem] New state:', newState);

          return newState;
        });
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity < 1) return;

        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        const items = get().items;
        const total = items.reduce((sum, item) => sum + item.quantity, 0);
        console.log('[cartStore getTotalItems] Calculated:', total);
        return total;
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + (item.basePrice + item.optionsPrice) * item.quantity,
          0
        );
      },

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
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
); 