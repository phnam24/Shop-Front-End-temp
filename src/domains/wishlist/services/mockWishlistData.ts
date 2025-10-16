import type { WishlistProduct } from '../types';

// Mock wishlist database - stored per user
let mockWishlist: WishlistProduct[] = [
  {
    id: 'wish-1',
    productId: 'macbook-pro-14-m3-pro',
    product: {
      id: 'macbook-pro-14-m3-pro',
      name: 'MacBook Pro 14" M3 Pro',
      slug: 'macbook-pro-14-m3-pro',
      thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
      price: 52990000,
      originalPrice: 54990000,
      discount: 4,
      rating: 4.9,
      reviewCount: 234,
      inStock: true,
      brand: 'Apple',
    },
    addedAt: '2024-10-01T10:00:00Z',
  },
  {
    id: 'wish-2',
    productId: 'iphone-15-pro-max',
    product: {
      id: 'iphone-15-pro-max',
      name: 'iPhone 15 Pro Max 512GB',
      slug: 'iphone-15-pro-max',
      thumbnail: 'https://images.unsplash.com/photo-1696446702811-fd1b2e4e0156?w=400',
      price: 34990000,
      originalPrice: 36990000,
      discount: 5,
      rating: 4.8,
      reviewCount: 567,
      inStock: true,
      brand: 'Apple',
    },
    addedAt: '2024-09-28T14:30:00Z',
  },
];

/**
 * Mock Wishlist Service
 */
export const mockWishlistService = {
  /**
   * Get all wishlist items for current user
   */
  getWishlist: async (): Promise<WishlistProduct[]> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    return [...mockWishlist];
  },

  /**
   * Check if a product is in wishlist
   */
  isInWishlist: async (productId: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    
    return mockWishlist.some((item) => item.productId === productId);
  },

  /**
   * Add product to wishlist
   */
  addToWishlist: async (productId: string): Promise<WishlistProduct> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Check if already in wishlist
    const existing = mockWishlist.find((item) => item.productId === productId);
    if (existing) {
      return existing;
    }

    // In a real app, we'd fetch the product details from the products API
    // For mock, we'll create a basic wishlist item
    const newItem: WishlistProduct = {
      id: `wish-${Date.now()}`,
      productId,
      product: {
        id: productId,
        name: 'Product Name', // Would be fetched from API
        slug: productId,
        thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        price: 10000000,
        rating: 4.5,
        reviewCount: 100,
        inStock: true,
        brand: 'Brand',
      },
      addedAt: new Date().toISOString(),
    };

    mockWishlist.unshift(newItem);

    return newItem;
  },

  /**
   * Remove product from wishlist
   */
  removeFromWishlist: async (productId: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const index = mockWishlist.findIndex((item) => item.productId === productId);
    if (index > -1) {
      mockWishlist.splice(index, 1);
    }
  },

  /**
   * Clear entire wishlist
   */
  clearWishlist: async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    mockWishlist = [];
  },

  /**
   * Get wishlist item count
   */
  getWishlistCount: async (): Promise<number> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    
    return mockWishlist.length;
  },
};

