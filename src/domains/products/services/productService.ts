import axios from 'axios';
import type {
  Product,
  Brand,
  Category,
  ProductQueryParams,
  ApiResponse,
  PaginatedResponse,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const productService = {
  /**
   * Get products with filters and pagination
   */
  getProducts: async (params: ProductQueryParams): Promise<PaginatedResponse<Product>> => {
    try {
      const response = await apiClient.get<ApiResponse<PaginatedResponse<Product>>>(
        '/products',
        { params }
      );
      
      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Không thể tải danh sách sản phẩm');
      }
      
      return response.data.result;
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  },

  /**
   * Get product by ID
   */
  getProductById: async (id: number): Promise<Product> => {
    try {
      const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
      
      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Không tìm thấy sản phẩm');
      }
      
      return response.data.result;
    } catch (error) {
      console.error('Get product by ID error:', error);
      throw error;
    }
  },

  /**
   * Get product by slug
   */
  getProductBySlug: async (slug: string): Promise<Product> => {
    try {
      const response = await apiClient.get<ApiResponse<Product>>(`/products/slug/${slug}`);
      
      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Không tìm thấy sản phẩm');
      }
      
      return response.data.result;
    } catch (error) {
      console.error('Get product by slug error:', error);
      throw error;
    }
  },

  /**
   * Get all brands
   */
  getBrands: async (categoryId?: number): Promise<Brand[]> => {
    try {
      const params = categoryId ? { categoryId } : {};
      const response = await apiClient.get<ApiResponse<Brand[]>>('/brands', { params });
      
      if (response.data.code !== 1000) {
        throw new Error('Không thể tải danh sách thương hiệu');
      }
      
      return response.data.result;
    } catch (error) {
      console.error('Get brands error:', error);
      throw error;
    }
  },

  /**
   * Get categories tree
   */
  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Category[]>>('/categories');
      
      if (response.data.code !== 1000) {
        throw new Error('Không thể tải danh mục');
      }
      
      return response.data.result;
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  },

  /**
   * Get category by ID with children
   */
  getCategoryById: async (id: number): Promise<Category> => {
    try {
      const response = await apiClient.get<ApiResponse<Category>>(`/categories/${id}`);
      
      if (response.data.code !== 1000) {
        throw new Error('Không tìm thấy danh mục');
      }
      
      return response.data.result;
    } catch (error) {
      console.error('Get category error:', error);
      throw error;
    }
  },

  /**
   * Search products
   */
  searchProducts: async (query: string, categoryId?: number): Promise<Product[]> => {
    try {
      const params = { q: query, categoryId };
      const response = await apiClient.get<ApiResponse<Product[]>>('/products/search', { params });
      
      if (response.data.code !== 1000) {
        throw new Error('Lỗi khi tìm kiếm');
      }
      
      return response.data.result;
    } catch (error) {
      console.error('Search products error:', error);
      throw error;
    }
  },

  /**
   * Get price range for a category
   */
  getPriceRange: async (categoryId?: number): Promise<{ min: number; max: number }> => {
    try {
      const params = categoryId ? { categoryId } : {};
      const response = await apiClient.get<ApiResponse<{ min: number; max: number }>>(
        '/products/price-range',
        { params }
      );
      
      if (response.data.code !== 1000) {
        throw new Error('Không thể tải khoảng giá');
      }
      
      return response.data.result;
    } catch (error) {
      console.error('Get price range error:', error);
      return { min: 0, max: 100000000 }; // Default range
    }
  },
};

export default apiClient;