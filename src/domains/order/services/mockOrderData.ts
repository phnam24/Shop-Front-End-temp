import type { Order, OrderStatus, OrderTimeline, CreateOrderRequest } from '../types';

/**
 * Mock Order Data - Development Only
 */

// Mock orders
export const mockOrders: Order[] = [
  {
    id: 'order-001',
    userId: 'user-001',
    orderCode: 'ORD-20241010-001',
    items: [
      {
        id: 'order-item-001',
        orderId: 'order-001',
        productId: 'dell-xps-13-plus',
        variantId: 'variant-1',
        productName: 'Dell XPS 13 Plus - Intel Core i7 Gen 12',
        productImage: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400',
        productAvatar: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400',
        variantInfo: 'Bạc / 16GB / 512GB',
        variantSku: 'DELL-XPS13-I7-16-512-SLV',
        color: 'Bạc',
        ramGb: 16,
        storageGb: 512,
        quantity: 1,
        price: 32990000,
        priceList: 35990000,
        priceSale: 32990000,
        subtotal: 32990000,
      },
    ],
    itemCount: 1,
    subtotal: 32990000,
    discount: 3299000, // 10% with WELCOME10
    shipping: 0,
    shippingFee: 0,
    tax: 0,
    total: 29691000,
    discountCode: 'WELCOME10',
    discountPercent: 10,
    shippingAddress: {
      fullName: 'Nguyễn Văn An',
      recipientName: 'Nguyễn Văn An',
      phone: '0912345678',
      streetAddress: '123 Nguyễn Huệ',
      addressLine1: '123 Nguyễn Huệ',
      addressLine2: 'Tòa nhà ABC, Tầng 5',
      ward: 'Phường Bến Nghé',
      district: 'Quận 1',
      province: 'TP. Hồ Chí Minh',
      city: 'TP. Hồ Chí Minh',
    },
    shippingMethod: 'Giao hàng nhanh',
    estimatedDelivery: '2024-10-13',
    paymentMethod: 'COD',
    paymentStatus: 'PENDING',
    status: 'SHIPPING',
    timeline: [
      {
        status: 'Chờ xác nhận',
        timestamp: '2024-10-10T10:30:00Z',
        description: 'Đơn hàng đã được tạo',
        note: 'Đơn hàng đã được tạo',
      },
      {
        status: 'Đã xác nhận',
        timestamp: '2024-10-10T11:00:00Z',
        description: 'Đơn hàng đã được xác nhận',
        note: 'Đơn hàng đã được xác nhận',
      },
      {
        status: 'Đang xử lý',
        timestamp: '2024-10-10T14:30:00Z',
        description: 'Đang chuẩn bị hàng',
        note: 'Đang chuẩn bị hàng',
      },
      {
        status: 'Đang giao hàng',
        timestamp: '2024-10-11T09:00:00Z',
        description: 'Đơn hàng đã được giao cho đơn vị vận chuyển',
        note: 'Đơn hàng đã được giao cho đơn vị vận chuyển',
      },
    ],
    note: 'Giao hàng vào buổi sáng nhé',
    customerNote: 'Giao hàng vào buổi sáng nhé',
    createdAt: '2024-10-10T10:30:00Z',
    updatedAt: '2024-10-11T09:00:00Z',
  },
  {
    id: 'order-002',
    userId: 'user-001',
    orderCode: 'ORD-20241005-045',
    items: [
      {
        id: 'order-item-002',
        orderId: 'order-002',
        productId: 'samsung-galaxy-s24-ultra',
        variantId: 'variant-10',
        productName: 'Samsung Galaxy S24 Ultra 5G',
        productImage: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
        productAvatar: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
        variantInfo: 'Đen / 12GB / 256GB',
        variantSku: 'SAM-S24U-12-256-BLK',
        color: 'Đen',
        ramGb: 12,
        storageGb: 256,
        quantity: 2,
        price: 27990000,
        priceList: 29990000,
        priceSale: 27990000,
        subtotal: 55980000,
      },
    ],
    itemCount: 2,
    subtotal: 55980000,
    discount: 0,
    shipping: 0,
    shippingFee: 0,
    tax: 0,
    total: 55980000,
    shippingAddress: {
      fullName: 'Nguyễn Văn An',
      recipientName: 'Nguyễn Văn An',
      phone: '0912345678',
      streetAddress: '123 Nguyễn Huệ',
      addressLine1: '123 Nguyễn Huệ',
      ward: 'Phường Bến Nghé',
      district: 'Quận 1',
      province: 'TP. Hồ Chí Minh',
      city: 'TP. Hồ Chí Minh',
    },
    shippingMethod: 'Giao hàng tiêu chuẩn',
    paymentMethod: 'VNPAY',
    paymentStatus: 'PAID',
    paidAt: '2024-10-05T15:30:00Z',
    status: 'DELIVERED',
    timeline: [
      {
        status: 'Chờ xác nhận',
        timestamp: '2024-10-05T15:00:00Z',
        description: 'Đơn hàng đã được tạo',
      },
      {
        status: 'Đã xác nhận',
        timestamp: '2024-10-05T15:30:00Z',
        description: 'Đơn hàng đã được xác nhận',
      },
      {
        status: 'Đang xử lý',
        timestamp: '2024-10-05T16:00:00Z',
        description: 'Đang chuẩn bị hàng',
      },
      {
        status: 'Đang giao hàng',
        timestamp: '2024-10-06T09:00:00Z',
        description: 'Đơn hàng đã được giao cho đơn vị vận chuyển',
      },
      {
        status: 'Đã giao hàng',
        timestamp: '2024-10-08T14:30:00Z',
        description: 'Giao hàng thành công',
        note: 'Giao hàng thành công',
      },
    ],
    createdAt: '2024-10-05T15:00:00Z',
    updatedAt: '2024-10-08T14:30:00Z',
    deliveredAt: '2024-10-08T14:30:00Z',
  },
  {
    id: 'order-003',
    userId: 'user-001',
    orderCode: 'ORD-20240928-122',
    items: [
      {
        id: 'order-item-003',
        orderId: 'order-003',
        productId: 'macbook-pro-14-m3-pro',
        variantId: 'variant-15',
        productName: 'MacBook Pro 14" M3 Pro',
        productImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
        productAvatar: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
        variantInfo: 'Space Gray / 18GB / 512GB',
        variantSku: 'APPLE-MBP14-M3P-18-512-SG',
        color: 'Space Gray',
        ramGb: 18,
        storageGb: 512,
        quantity: 1,
        price: 52990000,
        priceList: 52990000,
        priceSale: undefined,
        subtotal: 52990000,
      },
    ],
    itemCount: 1,
    subtotal: 52990000,
    discount: 10598000, // 20% with FLASH20
    shipping: 0,
    shippingFee: 0,
    tax: 0,
    total: 42392000,
    discountCode: 'FLASH20',
    discountPercent: 20,
    shippingAddress: {
      fullName: 'Trần Thị Bình',
      recipientName: 'Trần Thị Bình',
      phone: '0901234567',
      streetAddress: '789 Trần Hưng Đạo',
      addressLine1: '789 Trần Hưng Đạo',
      addressLine2: 'Chung cư XYZ',
      ward: 'Phường Cầu Ông Lãnh',
      district: 'Quận 1',
      province: 'TP. Hồ Chí Minh',
      city: 'TP. Hồ Chí Minh',
    },
    shippingMethod: 'Giao hàng nhanh',
    paymentMethod: 'MOMO',
    paymentStatus: 'PAID',
    paidAt: '2024-09-28T10:15:00Z',
    status: 'DELIVERED',
    timeline: [
      {
        status: 'Chờ xác nhận',
        timestamp: '2024-09-28T10:00:00Z',
        description: 'Đơn hàng đã được tạo',
      },
      {
        status: 'Đã xác nhận',
        timestamp: '2024-09-28T10:15:00Z',
        description: 'Đơn hàng đã được xác nhận',
      },
      {
        status: 'Đang xử lý',
        timestamp: '2024-09-28T11:00:00Z',
        description: 'Đang chuẩn bị hàng',
      },
      {
        status: 'Đang giao hàng',
        timestamp: '2024-09-29T08:00:00Z',
        description: 'Đơn hàng đã được giao cho đơn vị vận chuyển',
      },
      {
        status: 'Đã giao hàng',
        timestamp: '2024-10-01T16:20:00Z',
        description: 'Giao hàng thành công',
      },
    ],
    createdAt: '2024-09-28T10:00:00Z',
    updatedAt: '2024-10-01T16:20:00Z',
    deliveredAt: '2024-10-01T16:20:00Z',
  },
];

// State
let ordersData = [...mockOrders];
let nextOrderNumber = 46;

// Mock order service
export const mockOrderService = {
  // Get all orders for current user
  getOrders: async (page = 1, pageSize = 10) => {
    await delay(600);
    
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const items = ordersData.slice(start, end);
    
    return {
      items,
      total: ordersData.length,
      page,
      pageSize,
      totalPages: Math.ceil(ordersData.length / pageSize),
    };
  },

  // Get order by ID
  getOrderById: async (id: string): Promise<Order> => {
    await delay(500);
    
    const order = ordersData.find(o => o.id === id);
    if (!order) {
      throw new Error('Không tìm thấy đơn hàng');
    }
    
    return { ...order };
  },

  // Get order by order code
  getOrderByCode: async (orderCode: string): Promise<Order> => {
    await delay(500);
    
    const order = ordersData.find(o => o.orderCode === orderCode);
    if (!order) {
      throw new Error('Không tìm thấy đơn hàng');
    }
    
    return { ...order };
  },

  // Create order
  createOrder: async (request: CreateOrderRequest): Promise<Order> => {
    await delay(1200);
    
    // This would typically get cart items from cart service
    // For now, simulate with mock data
    const today = new Date();
    const orderCode = `ORD-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${String(nextOrderNumber++).padStart(3, '0')}`;
    
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      userId: 'user-001',
      orderCode,
      items: [], // Would be populated from cart
      itemCount: 0,
      subtotal: 0,
      discount: 0,
      shipping: 0,
      shippingFee: 0,
      tax: 0,
      total: 0,
      shippingAddress: request.shippingAddress || {
        fullName: '',
        recipientName: '',
        phone: '',
        streetAddress: '',
        addressLine1: '',
        ward: '',
        district: '',
        province: '',
        city: '',
      },
      shippingMethod: 'Giao hàng tiêu chuẩn',
      paymentMethod: request.paymentMethod,
      paymentStatus: request.paymentMethod === 'COD' ? 'PENDING' : 'PAID',
      status: 'PENDING',
      timeline: [
        {
          status: 'Chờ xác nhận',
          timestamp: new Date().toISOString(),
          description: 'Đơn hàng đã được tạo',
          note: 'Đơn hàng đã được tạo',
        },
      ],
      note: request.note || request.customerNote,
      customerNote: request.note || request.customerNote,
      createdAt: new Date().toISOString(),
    };
    
    ordersData.unshift(newOrder);
    return { ...newOrder };
  },

  // Cancel order
  cancelOrder: async (id: string, reason?: string): Promise<Order> => {
    await delay(800);
    
    const index = ordersData.findIndex(o => o.id === id);
    if (index === -1) {
      throw new Error('Không tìm thấy đơn hàng');
    }
    
    const order = ordersData[index];
    
    // Can only cancel if not shipped or delivered
    if (['SHIPPING', 'DELIVERED'].includes(order.status)) {
      throw new Error('Không thể hủy đơn hàng đã giao hoặc đang giao');
    }
    
    order.status = 'CANCELLED';
    order.cancelledAt = new Date().toISOString();
    order.updatedAt = new Date().toISOString();
    order.timeline.push({
      status: 'CANCELLED',
      timestamp: new Date().toISOString(),
      note: reason || 'Khách hàng hủy đơn',
    });
    
    return { ...order };
  },
};

// Reset to initial state
export const resetMockOrders = () => {
  ordersData = [...mockOrders];
  nextOrderNumber = 46;
};

// Utility
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

