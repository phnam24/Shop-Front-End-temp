import apiClient from '../../auth/services/authService';
import { mockReviewService } from './mockReviewData';
import type {
  Review,
  CreateReviewRequest,
  ReviewFilters,
  PaginatedReviews,
  ApiResponse,
} from '../types';

// Toggle between mock and real API
const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

/**
 * Review Service - Quản lý đánh giá sản phẩm
 */
export const reviewService = {
  /**
   * Get reviews for a product
   */
  getReviews: async (
    productId: string,
    filters: ReviewFilters = {}
  ): Promise<PaginatedReviews> => {
    if (USE_MOCK) {
      return mockReviewService.getReviews(productId, filters);
    }

    try {
      const params = new URLSearchParams();
      if (filters.rating) params.append('rating', filters.rating.toString());
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());

      const response = await apiClient.get<ApiResponse<PaginatedReviews>>(
        `/products/${productId}/reviews?${params.toString()}`
      );

      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Không thể tải đánh giá');
      }

      return response.data.result;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Get a single review by ID
   */
  getReviewById: async (id: string): Promise<Review> => {
    if (USE_MOCK) {
      return mockReviewService.getReviewById(id);
    }

    try {
      const response = await apiClient.get<ApiResponse<Review>>(`/reviews/${id}`);

      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Không tìm thấy đánh giá');
      }

      return response.data.result;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Create a new review
   */
  createReview: async (request: CreateReviewRequest): Promise<Review> => {
    if (USE_MOCK) {
      return mockReviewService.createReview(request);
    }

    try {
      // If there are images, upload them first
      let imageUrls: string[] = [];
      if (request.images && request.images.length > 0) {
        // In a real app, upload images to CDN/storage first
        // const uploadedUrls = await uploadImages(request.images);
        // imageUrls = uploadedUrls;
      }

      const payload = {
        productId: request.productId,
        variantId: request.variantId,
        rating: request.rating,
        title: request.title,
        comment: request.comment,
        images: imageUrls,
      };

      const response = await apiClient.post<ApiResponse<Review>>('/reviews', payload);

      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Không thể tạo đánh giá');
      }

      return response.data.result;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Mark review as helpful
   */
  markHelpful: async (reviewId: string): Promise<Review> => {
    if (USE_MOCK) {
      return mockReviewService.markHelpful(reviewId);
    }

    try {
      const response = await apiClient.post<ApiResponse<Review>>(
        `/reviews/${reviewId}/helpful`
      );

      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Không thể đánh dấu hữu ích');
      }

      return response.data.result;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Delete a review (only owner can delete)
   */
  deleteReview: async (id: string): Promise<void> => {
    if (USE_MOCK) {
      return mockReviewService.deleteReview(id);
    }

    try {
      const response = await apiClient.delete<ApiResponse<void>>(`/reviews/${id}`);

      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Không thể xóa đánh giá');
      }
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

export default reviewService;

