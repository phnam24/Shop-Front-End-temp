// Cart Item Types
export interface CartItem {
  id: string; // Unique cart item ID
  productId: number;
  variantId: number;
  quantity: number;
  
  // Product Info (denormalized for display)
  productName: string;
  productSlug: string;
  productAvatar: string;
  brandName: string;
  
  // Variant Info
  variantSku: string;
  color?: string;
  ramGb?: number;
  storageGb?: number;
  
  // Pricing
  priceList: number;
  priceSale?: number;
  
  // Stock
  stock: number;
  
  // Metadata
  addedAt: string;
}

// Cart State
export interface Cart {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  
  // Discount Code
  discountCode?: string;
  discountPercent?: number;
}

// Add to Cart Request
export interface AddToCartRequest {
  productId: number;
  variantId: number;
  quantity: number;
}

// Update Cart Item Request
export interface UpdateCartItemRequest {
  itemId: string;
  quantity: number;
}

// Apply Discount Request
export interface ApplyDiscountRequest {
  code: string;
}

// API Response Types
export interface ApiResponse<T> {
  code: number;
  result: T;
  message?: string;
}

// Cart Summary for Checkout
export interface CartSummary {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
}

