import { create } from 'zustand';
import type { CartItem } from '@/types/cart';
import type { Address } from '@/types/address';

interface User {
  addresses?: Address[];
}

interface Cart {
  user?: User;
  deliveryAddress?: Address;
}

type State = {
  items: CartItem[];
  cart: Cart;
};

type Actions = {
  updateDeliveryAddress: (address: Address) => void;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  getSubtotal: () => number;
  clearCart: () => void;
};

export type CartState = State & Actions;

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  cart: {
    user: undefined,
    deliveryAddress: undefined,
  },
  updateDeliveryAddress: (address) => {
    set((state) => ({
      ...state,
      cart: {
        ...state.cart,
        deliveryAddress: address,
      },
    }));
  },
  addItem: (item) => {
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { 
        ...state,
        items: [...state.items, { ...item, quantity: 1 }] 
      };
    });
  },
  removeItem: (itemId) => {
    set((state) => ({
      ...state,
      items: state.items.filter((item) => item.id !== itemId),
    }));
  },
  updateItemQuantity: (itemId, quantity) => {
    set((state) => ({
      ...state,
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      ),
    }));
  },
  getSubtotal: () => {
    const { items } = get();
    return items.reduce((total, item) => 
      total + (item.basePrice + item.optionsPrice) * item.quantity, 0);
  },
  clearCart: () => {
    set({ 
      items: [], 
      cart: { 
        user: undefined, 
        deliveryAddress: undefined 
      } 
    });
  },
})); 