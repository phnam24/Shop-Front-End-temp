import apiClient from '../../auth/services/authService';
import { mockCartService } from './mockCartData';
import type {
  Cart,
  AddToCartRequest,
  ApiResponse,
} from '../types';

// Toggle between mock and real API
const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

/**
 * Cart Service - Quản lý giỏ hàng
 */
export const cartService = {
  /**
   * Lấy giỏ hàng hiện tại
   */
  getCart: async (): Promise<Cart> => {
    if (USE_MOCK) {
      return mockCartService.getCart();
    }

    try {
      const response = await apiClient.get<ApiResponse<Cart>>('/cart');

      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Không thể lấy giỏ hàng');
      }

      return response.data.result;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Thêm sản phẩm vào giỏ hàng
   */
  addItem: async (data: AddToCartRequest): Promise<Cart> => {
    if (USE_MOCK) {
      return mockCartService.addItem(data);
    }

    try {
      const response = await apiClient.post<ApiResponse<Cart>>('/cart/items', data);

      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Không thể thêm vào giỏ hàng');
      }

      return response.data.result;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Cập nhật số lượng item trong giỏ
   */
  updateItem: async (itemId: string, quantity: number): Promise<Cart> => {
    if (USE_MOCK) {
      return mockCartService.updateItem(itemId, quantity);
    }

    try {
      const response = await apiClient.put<ApiResponse<Cart>>(
        `/cart/items/${itemId}`,
        { quantity }
      );

      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Không thể cập nhật giỏ hàng');
      }

      return response.data.result;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Xóa item khỏi giỏ hàng
   */
  removeItem: async (itemId: string): Promise<Cart> => {
    if (USE_MOCK) {
      return mockCartService.removeItem(itemId);
    }

    try {
      const response = await apiClient.delete<ApiResponse<Cart>>(`/cart/items/${itemId}`);

      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Không thể xóa khỏi giỏ hàng');
      }

      return response.data.result;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Xóa toàn bộ giỏ hàng
   */
  clearCart: async (): Promise<void> => {
    if (USE_MOCK) {
      return mockCartService.clearCart();
    }

    try {
      const response = await apiClient.delete<ApiResponse<any>>('/cart');

      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Không thể xóa giỏ hàng');
      }
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Áp dụng mã giảm giá
   */
  applyDiscount: async (code: string): Promise<Cart> => {
    if (USE_MOCK) {
      return mockCartService.applyDiscount(code);
    }

    try {
      const response = await apiClient.post<ApiResponse<Cart>>('/cart/apply-discount', {
        code,
      });

      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Mã giảm giá không hợp lệ');
      }

      return response.data.result;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Xóa mã giảm giá
   */
  removeDiscount: async (): Promise<Cart> => {
    if (USE_MOCK) {
      return mockCartService.removeDiscount();
    }

    try {
      const response = await apiClient.delete<ApiResponse<Cart>>('/cart/discount');

      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Không thể xóa mã giảm giá');
      }

      return response.data.result;
    } catch (error) {
      throw handleError(error);
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

export default cartService;

