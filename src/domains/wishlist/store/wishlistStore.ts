import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { wishlistService } from '../services/wishlistService';
import type { WishlistProduct } from '../types';

interface WishlistState {
  items: WishlistProduct[];
  isLoading: boolean;
  
  // Actions
  fetchWishlist: () => Promise<void>;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  getItemCount: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      fetchWishlist: async () => {
        set({ isLoading: true });
        try {
          const items = await wishlistService.getWishlist();
          set({ items });
        } catch (error) {
          console.error('Failed to fetch wishlist:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      addToWishlist: async (productId: string) => {
        try {
          const newItem = await wishlistService.addToWishlist(productId);
          set((state) => ({
            items: [newItem, ...state.items.filter(item => item.productId !== productId)],
          }));
        } catch (error) {
          console.error('Failed to add to wishlist:', error);
          throw error;
        }
      },

      removeFromWishlist: async (productId: string) => {
        try {
          await wishlistService.removeFromWishlist(productId);
          set((state) => ({
            items: state.items.filter((item) => item.productId !== productId),
          }));
        } catch (error) {
          console.error('Failed to remove from wishlist:', error);
          throw error;
        }
      },

      clearWishlist: async () => {
        try {
          await wishlistService.clearWishlist();
          set({ items: [] });
        } catch (error) {
          console.error('Failed to clear wishlist:', error);
          throw error;
        }
      },

      isInWishlist: (productId: string) => {
        return get().items.some((item) => item.productId === productId);
      },

      getItemCount: () => {
        return get().items.length;
      },
    }),
    {
      name: 'wishlist-storage',
      // Only persist items, not loading state
      partialize: (state) => ({ items: state.items }),
    }
  )
);

