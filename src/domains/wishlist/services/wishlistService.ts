import apiClient from '../../auth/services/authService';
import { mockWishlistService } from './mockWishlistData';
import type { WishlistProduct, ApiResponse } from '../types';

// Toggle between mock and real API
const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

/**
 * Wishlist Service - Quản lý sản phẩm yêu thích
 */
export const wishlistService = {
  /**
   * Get all wishlist items
   */
  getWishlist: async (): Promise<WishlistProduct[]> => {
    if (USE_MOCK) {
      return mockWishlistService.getWishlist();
    }

    try {
      const response = await apiClient.get<ApiResponse<WishlistProduct[]>>('/wishlist');

      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Không thể tải danh sách yêu thích');
      }

      return response.data.result;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Check if product is in wishlist
   */
  isInWishlist: async (productId: string): Promise<boolean> => {
    if (USE_MOCK) {
      return mockWishlistService.isInWishlist(productId);
    }

    try {
      const response = await apiClient.get<ApiResponse<boolean>>(
        `/wishlist/check/${productId}`
      );

      if (response.data.code !== 1000) {
        return false;
      }

      return response.data.result;
    } catch (error) {
      return false;
    }
  },

  /**
   * Add product to wishlist
   */
  addToWishlist: async (productId: string): Promise<WishlistProduct> => {
    if (USE_MOCK) {
      return mockWishlistService.addToWishlist(productId);
    }

    try {
      const response = await apiClient.post<ApiResponse<WishlistProduct>>('/wishlist', {
        productId,
      });

      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Không thể thêm vào yêu thích');
      }

      return response.data.result;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Remove product from wishlist
   */
  removeFromWishlist: async (productId: string): Promise<void> => {
    if (USE_MOCK) {
      return mockWishlistService.removeFromWishlist(productId);
    }

    try {
      const response = await apiClient.delete<ApiResponse<void>>(
        `/wishlist/${productId}`
      );

      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Không thể xóa khỏi yêu thích');
      }
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Clear entire wishlist
   */
  clearWishlist: async (): Promise<void> => {
    if (USE_MOCK) {
      return mockWishlistService.clearWishlist();
    }

    try {
      const response = await apiClient.delete<ApiResponse<void>>('/wishlist');

      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Không thể xóa danh sách yêu thích');
      }
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Get wishlist item count
   */
  getWishlistCount: async (): Promise<number> => {
    if (USE_MOCK) {
      return mockWishlistService.getWishlistCount();
    }

    try {
      const response = await apiClient.get<ApiResponse<number>>('/wishlist/count');

      if (response.data.code !== 1000) {
        return 0;
      }

      return response.data.result;
    } catch (error) {
      return 0;
    }
  },
};

/**
 * Handle API errors
 */
const handleError = (error: any): Error => {
  if (error.response) {
    const message = error.response.data?.message || 'Có lỗi xảy ra';
    return new Error(message);
  }
  if (error.request) {
    return new Error('Không thể kết nối đến server');
  }
  return new Error(error.message || 'Có lỗi không xác định');
};

export default wishlistService;

