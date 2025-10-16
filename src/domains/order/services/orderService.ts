import apiClient from '../../auth/services/authService';
import { mockOrderService } from './mockOrderData';
import type {
  Order,
  CreateOrderRequest,
  PaginatedResponse,
  ApiResponse,
} from '../types';

// Toggle between mock and real API
const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

/**
 * Order Service - Quản lý đơn hàng
 */
export const orderService = {
  /**
   * Get all orders for current user
   */
  getOrders: async (page = 1, pageSize = 10): Promise<PaginatedResponse<Order>> => {
    if (USE_MOCK) {
      return mockOrderService.getOrders(page, pageSize);
    }

    try {
      const response = await apiClient.get<ApiResponse<PaginatedResponse<Order>>>(
        `/orders?page=${page}&pageSize=${pageSize}`
      );

      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Không thể lấy danh sách đơn hàng');
      }

      return response.data.result;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Get order by ID
   */
  getOrderById: async (id: string): Promise<Order> => {
    if (USE_MOCK) {
      return mockOrderService.getOrderById(id);
    }

    try {
      const response = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);

      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Không tìm thấy đơn hàng');
      }

      return response.data.result;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Get order by order code
   */
  getOrderByCode: async (orderCode: string): Promise<Order> => {
    if (USE_MOCK) {
      return mockOrderService.getOrderByCode(orderCode);
    }

    try {
      const response = await apiClient.get<ApiResponse<Order>>(
        `/orders/code/${orderCode}`
      );

      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Không tìm thấy đơn hàng');
      }

      return response.data.result;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Create new order
   */
  createOrder: async (request: CreateOrderRequest): Promise<Order> => {
    if (USE_MOCK) {
      return mockOrderService.createOrder(request);
    }

    try {
      const response = await apiClient.post<ApiResponse<Order>>('/orders', request);

      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Không thể tạo đơn hàng');
      }

      return response.data.result;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Cancel order
   */
  cancelOrder: async (id: string, reason?: string): Promise<Order> => {
    if (USE_MOCK) {
      return mockOrderService.cancelOrder(id, reason);
    }

    try {
      const response = await apiClient.put<ApiResponse<Order>>(`/orders/${id}/cancel`, {
        reason,
      });

      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Không thể hủy đơn hàng');
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

export default orderService;

