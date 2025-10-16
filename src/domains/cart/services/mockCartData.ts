import type { Cart, CartItem, AddToCartRequest } from '../types';

/**
 * Mock Cart Data - Development Only
 */

// Initial mock cart items
const initialCartItems: CartItem[] = [
  {
    id: 'cart-item-001',
    productId: 1,
    variantId: 1,
    quantity: 1,
    productName: 'Dell XPS 13 Plus - Intel Core i7 Gen 12',
    productSlug: 'dell-xps-13-plus-i7-gen-12',
    productAvatar: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400',
    brandName: 'Dell',
    variantSku: 'DELL-XPS13-I7-16-512-SLV',
    color: 'Bạc',
    ramGb: 16,
    storageGb: 512,
    priceList: 35990000,
    priceSale: 32990000,
    stock: 15,
    addedAt: '2024-10-10T10:30:00Z',
  },
  {
    id: 'cart-item-002',
    productId: 5,
    variantId: 10,
    quantity: 2,
    productName: 'Samsung Galaxy S24 Ultra 5G',
    productSlug: 'samsung-galaxy-s24-ultra-5g',
    productAvatar: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
    brandName: 'Samsung',
    variantSku: 'SAM-S24U-12-256-BLK',
    color: 'Đen',
    ramGb: 12,
    storageGb: 256,
    priceList: 29990000,
    priceSale: 27990000,
    stock: 25,
    addedAt: '2024-10-11T14:20:00Z',
  },
  {
    id: 'cart-item-003',
    productId: 8,
    variantId: 15,
    quantity: 1,
    productName: 'MacBook Pro 14" M3 Pro',
    productSlug: 'macbook-pro-14-m3-pro',
    productAvatar: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    brandName: 'Apple',
    variantSku: 'APPLE-MBP14-M3P-18-512-SG',
    color: 'Space Gray',
    ramGb: 18,
    storageGb: 512,
    priceList: 52990000,
    priceSale: undefined,
    stock: 8,
    addedAt: '2024-10-12T09:15:00Z',
  },
];

// Mock discount codes
const mockDiscountCodes = {
  'WELCOME10': { percent: 10, maxDiscount: 2000000 },
  'FLASH20': { percent: 20, maxDiscount: 5000000 },
  'VIP50': { percent: 50, maxDiscount: 10000000 },
};

// Cart state
let cartItems: CartItem[] = [...initialCartItems];
let appliedDiscountCode: string | undefined = undefined;
let nextItemId = 4;

// Helper: Calculate cart totals
function calculateCart(): Cart {
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.priceSale || item.priceList;
    return sum + (price * item.quantity);
  }, 0);

  // Calculate discount
  let discount = 0;
  let discountPercent = 0;
  
  if (appliedDiscountCode && mockDiscountCodes[appliedDiscountCode as keyof typeof mockDiscountCodes]) {
    const discountInfo = mockDiscountCodes[appliedDiscountCode as keyof typeof mockDiscountCodes];
    discountPercent = discountInfo.percent;
    discount = Math.min(
      (subtotal * discountInfo.percent) / 100,
      discountInfo.maxDiscount
    );
  }

  // Shipping: Free if subtotal > 5M, else 50k
  const shipping = subtotal > 5000000 ? 0 : 50000;

  const total = subtotal - discount + shipping;

  return {
    items: [...cartItems],
    itemCount,
    subtotal,
    discount,
    shipping,
    total,
    discountCode: appliedDiscountCode,
    discountPercent,
  };
}

// Mock cart service
export const mockCartService = {
  // Get cart
  getCart: async (): Promise<Cart> => {
    await delay(500);
    return calculateCart();
  },

  // Add item to cart
  addItem: async (request: AddToCartRequest): Promise<Cart> => {
    await delay(700);

    // Check if item already exists
    const existingIndex = cartItems.findIndex(
      item => item.productId === request.productId && item.variantId === request.variantId
    );

    if (existingIndex !== -1) {
      // Update quantity
      cartItems[existingIndex].quantity += request.quantity;
    } else {
      // Add new item (would need to fetch product/variant info in real scenario)
      const newItem: CartItem = {
        id: `cart-item-${String(nextItemId++).padStart(3, '0')}`,
        productId: request.productId,
        variantId: request.variantId,
        quantity: request.quantity,
        // Mock data - in reality would fetch from products
        productName: 'Sản phẩm mới',
        productSlug: 'san-pham-moi',
        productAvatar: 'https://via.placeholder.com/400',
        brandName: 'Brand',
        variantSku: 'SKU-NEW',
        color: 'Đen',
        ramGb: 8,
        storageGb: 256,
        priceList: 15000000,
        priceSale: undefined,
        stock: 10,
        addedAt: new Date().toISOString(),
      };
      cartItems.push(newItem);
    }

    return calculateCart();
  },

  // Update item quantity
  updateItem: async (itemId: string, quantity: number): Promise<Cart> => {
    await delay(400);

    const index = cartItems.findIndex(item => item.id === itemId);
    if (index === -1) {
      throw new Error('Không tìm thấy sản phẩm trong giỏ hàng');
    }

    if (quantity < 1) {
      throw new Error('Số lượng phải lớn hơn 0');
    }

    if (quantity > cartItems[index].stock) {
      throw new Error(`Chỉ còn ${cartItems[index].stock} sản phẩm`);
    }

    cartItems[index].quantity = quantity;
    return calculateCart();
  },

  // Remove item
  removeItem: async (itemId: string): Promise<Cart> => {
    await delay(500);

    const index = cartItems.findIndex(item => item.id === itemId);
    if (index === -1) {
      throw new Error('Không tìm thấy sản phẩm trong giỏ hàng');
    }

    cartItems.splice(index, 1);
    return calculateCart();
  },

  // Clear cart
  clearCart: async (): Promise<void> => {
    await delay(400);
    cartItems = [];
    appliedDiscountCode = undefined;
  },

  // Apply discount
  applyDiscount: async (code: string): Promise<Cart> => {
    await delay(800);

    const upperCode = code.toUpperCase();
    
    if (!mockDiscountCodes[upperCode as keyof typeof mockDiscountCodes]) {
      throw new Error('Mã giảm giá không hợp lệ hoặc đã hết hạn');
    }

    appliedDiscountCode = upperCode;
    return calculateCart();
  },

  // Remove discount
  removeDiscount: async (): Promise<Cart> => {
    await delay(300);
    appliedDiscountCode = undefined;
    return calculateCart();
  },
};

// Reset cart to initial state (for testing)
export const resetMockCart = () => {
  cartItems = [...initialCartItems];
  appliedDiscountCode = undefined;
  nextItemId = 4;
};

// Utility: Simulate network delay
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

