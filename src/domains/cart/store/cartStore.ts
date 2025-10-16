import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartService } from '../services/cartService';
import type { Cart, CartItem, AddToCartRequest } from '../types';

interface CartStore {
  // State
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCart: () => Promise<void>;
  addItem: (request: AddToCartRequest) => Promise<void>;
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyDiscount: (code: string) => Promise<void>;
  removeDiscount: () => Promise<void>;
  
  // Local actions
  setCart: (cart: Cart) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Computed values
  getItemCount: () => number;
  getSubtotal: () => number;
  getTotal: () => number;
}

const EMPTY_CART: Cart = {
  items: [],
  itemCount: 0,
  subtotal: 0,
  discount: 0,
  shipping: 0,
  total: 0,
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Initial State
      cart: null,
      isLoading: false,
      error: null,

      // Fetch cart from server
      fetchCart: async () => {
        set({ isLoading: true, error: null });
        try {
          const cart = await cartService.getCart();
          set({ cart, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          // If error, use empty cart
          set({ cart: EMPTY_CART });
        }
      },

      // Add item to cart
      addItem: async (request: AddToCartRequest) => {
        set({ isLoading: true, error: null });
        try {
          const cart = await cartService.addItem(request);
          set({ cart, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      // Update item quantity
      updateItemQuantity: async (itemId: string, quantity: number) => {
        set({ isLoading: true, error: null });
        try {
          const cart = await cartService.updateItem(itemId, quantity);
          set({ cart, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      // Remove item
      removeItem: async (itemId: string) => {
        set({ isLoading: true, error: null });
        try {
          const cart = await cartService.removeItem(itemId);
          set({ cart, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      // Clear cart
      clearCart: async () => {
        set({ isLoading: true, error: null });
        try {
          await cartService.clearCart();
          set({ cart: EMPTY_CART, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      // Apply discount
      applyDiscount: async (code: string) => {
        set({ isLoading: true, error: null });
        try {
          const cart = await cartService.applyDiscount(code);
          set({ cart, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      // Remove discount
      removeDiscount: async () => {
        set({ isLoading: true, error: null });
        try {
          const cart = await cartService.removeDiscount();
          set({ cart, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      // Local setters
      setCart: (cart) => set({ cart }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      // Computed values
      getItemCount: () => {
        const cart = get().cart;
        return cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
      },

      getSubtotal: () => {
        const cart = get().cart;
        return cart?.subtotal || 0;
      },

      getTotal: () => {
        const cart = get().cart;
        return cart?.total || 0;
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        cart: state.cart,
      }),
    }
  )
);

