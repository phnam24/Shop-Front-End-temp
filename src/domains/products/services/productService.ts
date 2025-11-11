import axios from 'axios';
import type {
  Product,
  Brand,
  Category,
  ProductQueryParams,
  ApiResponse,
  PaginatedResponse,
  ProductVariant,
  VariantSpec,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8083/api';

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

// Helper function để normalize product data
const normalizeProduct = (product: any): Product => {
  return {
    ...product,
    // Parse images từ string JSON sang array
    images: typeof product.images === 'string' 
      ? JSON.parse(product.images || '[]') 
      : product.images || [],
    // Computed fields for backward compatibility
    categoryId: product.categories?.[0]?.id,
    brandId: product.brand?.id,
    minPrice: product.priceSale || product.priceList,
    maxPrice: product.priceList,
    hasDiscount: product.priceSale < product.priceList,
    discountPercent: product.priceSale < product.priceList 
      ? Math.round(((product.priceList - product.priceSale) / product.priceList) * 100)
      : 0,
  };
};

export const productService = {
  /**
   * Get products with filters and pagination
   */
  getProducts: async (params: ProductQueryParams): Promise<PaginatedResponse<Product>> => {
    try {
      const response = await apiClient.get<ApiResponse<Product[]>>(
        '/products',
        { params }
      );
      
      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Không thể tải danh sách sản phẩm');
      }
      
      // Normalize products
      const products = response.data.result.map(normalizeProduct);
      
      // API không trả về pagination, tạm thời return tất cả
      return {
        items: products,
        total: products.length,
        page: params.page || 1,
        pageSize: params.pageSize || 12,
        totalPages: Math.ceil(products.length / (params.pageSize || 12)),
      };
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
      
      return normalizeProduct(response.data.result);
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
      
      return normalizeProduct(response.data.result);
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
        throw new Error(response.data.message || 'Không thể tải danh mục');
      }
      
      return response.data.result;
    } catch (error) {
      console.error('Get categories error:', error);
      throw error;
    }
  },

  /**
   * Search categories by name
   */
  searchCategories: async (name: string): Promise<Category[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Category[]>>('/categories/search', {
        params: { name }
      });
      
      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Lỗi khi tìm kiếm danh mục');
      }
      
      return response.data.result;
    } catch (error) {
      console.error('Search categories error:', error);
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
      const params = { name: query, categoryId };
      const response = await apiClient.get<ApiResponse<Product[]>>('/products/search', { params });
      
      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Lỗi khi tìm kiếm');
      }
      
      return response.data.result.map(normalizeProduct);
    } catch (error) {
      console.error('Search products error:', error);
      throw error;
    }
  },

  /**
   * Search variant by SKU
   */
  searchVariantBySku: async (sku: string): Promise<ProductVariant | null> => {
    try {
      const response = await apiClient.get<ApiResponse<ProductVariant[]>>('/variants/search', {
        params: { sku }
      });
      
      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Lỗi khi tìm kiếm variant');
      }
      
      return response.data.result[0] || null;
    } catch (error) {
      console.error('Search variant by SKU error:', error);
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

  /**
   * Get variants by product ID
   */
  getVariantsByProductId: async (productId: number): Promise<ProductVariant[]> => {
    try {
      const response = await apiClient.get<ApiResponse<ProductVariant[]>>(`/variants/product/${productId}`);
      
      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Không thể tải variants');
      }
      
      return response.data.result;
    } catch (error) {
      console.error('Get variants error:', error);
      throw error;
    }
  },

  /**
   * Get variant specs by variant ID
   */
  getVariantSpecs: async (variantId: number): Promise<VariantSpec[]> => {
    try {
      const response = await apiClient.get<ApiResponse<VariantSpec[]>>(`/variant-specs/variant/${variantId}`);
      
      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Không thể tải specs');
      }
      
      return response.data.result;
    } catch (error) {
      console.error('Get variant specs error:', error);
      throw error;
    }
  },
};

export default apiClient;