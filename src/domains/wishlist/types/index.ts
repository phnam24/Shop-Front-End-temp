// Wishlist Types

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  addedAt: string;
}

export interface WishlistProduct {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    thumbnail: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    rating: number;
    reviewCount: number;
    inStock: boolean;
    brand: string;
  };
  addedAt: string;
}

export interface AddToWishlistRequest {
  productId: string;
}

// API Response type
export interface ApiResponse<T> {
  code: number;
  message?: string;
  result: T;
}

