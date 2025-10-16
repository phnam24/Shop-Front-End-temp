// Order Status
export type OrderStatus = 
  | 'PENDING'        // Chờ xác nhận
  | 'CONFIRMED'      // Đã xác nhận
  | 'PROCESSING'     // Đang xử lý
  | 'SHIPPING'       // Đang giao hàng
  | 'DELIVERED'      // Đã giao hàng
  | 'CANCELLED'      // Đã hủy
  | 'RETURNED';      // Đã trả hàng

// Payment Method
export type PaymentMethod = 'COD' | 'VNPAY' | 'MOMO' | 'BANK_TRANSFER';

// Payment Status
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

// Order Item
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string;
  productName: string;
  productImage: string; // Changed from productAvatar
  productAvatar?: string; // Keep for backward compatibility
  variantInfo?: string; // e.g., "Xanh dương / 16GB / 512GB"
  variantSku?: string;
  color?: string;
  ramGb?: number;
  storageGb?: number;
  quantity: number;
  price: number; // Unit price - Changed from priceList
  priceList?: number; // Keep for backward compatibility
  priceSale?: number;
  subtotal: number; // price * quantity
}

// Shipping Address (embedded in order)
export interface ShippingAddress {
  fullName: string; // Changed from recipientName
  recipientName?: string; // Keep for backward compatibility
  phone: string;
  streetAddress: string; // Changed from addressLine1
  addressLine1?: string; // Keep for backward compatibility
  addressLine2?: string;
  ward: string;
  district: string;
  province: string; // Changed from city
  city?: string; // Keep for backward compatibility
}

// Order Timeline Event
export interface OrderTimeline {
  status: string; // Status label (e.g., "Đã xác nhận")
  timestamp: string;
  description?: string; // Changed from note
  note?: string; // Keep for backward compatibility
}

// Order
export interface Order {
  id: string;
  userId: string;
  orderCode: string; // e.g., "ORD-20241012-001"
  
  // Items
  items: OrderItem[];
  itemCount: number;
  
  // Pricing
  subtotal: number;
  discount: number;
  shipping: number; // Keep for backward compatibility
  shippingFee: number; // Alias for shipping
  tax: number;
  total: number;
  
  // Discount
  discountCode?: string;
  discountPercent?: number;
  
  // Shipping
  shippingAddress: ShippingAddress;
  shippingMethod: string;
  estimatedDelivery?: string;
  
  // Payment
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paidAt?: string;
  
  // Status
  status: OrderStatus;
  timeline: OrderTimeline[];
  
  // Notes
  note?: string; // Alias for customerNote
  customerNote?: string; // Keep for backward compatibility
  adminNote?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt?: string;
  cancelledAt?: string;
  deliveredAt?: string;
}

// Create Order Request
export interface CreateOrderRequest {
  addressId?: string; // Use existing address - alias for shippingAddressId
  shippingAddressId?: string; // Keep for backward compatibility
  shippingAddress?: Omit<ShippingAddress, 'id'>; // Or provide new address
  paymentMethod: PaymentMethod;
  note?: string; // Alias for customerNote
  customerNote?: string; // Keep for backward compatibility
}

// Order Summary (for display)
export interface OrderSummary {
  id: string;
  orderCode: string;
  itemCount: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

// API Response
export interface ApiResponse<T> {
  code: number;
  result: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

