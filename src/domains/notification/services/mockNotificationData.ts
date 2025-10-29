// src/domains/notification/services/mockNotificationData.ts
import type { Notification } from '../types';

let mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'Đơn hàng #ORD-20241010-001 đang được giao',
    message: 'Đơn hàng của bạn đã được giao cho đơn vị vận chuyển. Dự kiến giao trong 2-3 ngày.',
    link: '/orders/order-001',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
  },
  {
    id: '2',
    type: 'promotion',
    title: '🔥 Flash Sale 11/11 - Giảm đến 50%!',
    message: 'Đừng bỏ lỡ cơ hội săn sale lớn nhất năm cho các sản phẩm laptop và điện thoại.',
    link: '/deals',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: '3',
    type: 'system',
    title: 'Cập nhật chính sách bảo hành',
    message: 'Chúng tôi đã cập nhật chính sách bảo hành vàng cho các sản phẩm Apple. Xem chi tiết ngay.',
    link: '/warranty-policy',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: '4',
    type: 'order',
    title: 'Đơn hàng #ORD-20241005-045 đã giao thành công',
    message: 'Cảm ơn bạn đã mua sắm tại TechStore! Vui lòng đánh giá sản phẩm để chúng tôi phục vụ tốt hơn.',
    link: '/orders/order-002',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
  },
  {
    id: '5',
    type: 'product',
    title: 'Sản phẩm bạn yêu thích đã có hàng lại!',
    message: 'MacBook Pro 14" M3 Pro mà bạn yêu thích đã có hàng trở lại. Mua ngay!',
    link: '/products/macbook-pro-14-m3-pro',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
  },
];

// HÀM MỚI để mô phỏng có thông báo mới từ server
const simulateNewNotification = () => {
  // Chỉ thêm thông báo mới một cách ngẫu nhiên để không spam
  if (Math.random() > 0.7) {
      const newNotification: Notification = {
          id: `noti-${Date.now()}`,
          type: 'promotion',
          title: '🎉 Chúc mừng! Bạn nhận được voucher 100K',
          message: 'Sử dụng ngay voucher giảm 100.000đ cho đơn hàng từ 2 triệu. Chỉ có hiệu lực trong 24h.',
          link: '/cart',
          isRead: false,
          createdAt: new Date().toISOString(),
      };
      mockNotifications.unshift(newNotification);
  }
};

export const mockNotificationService = {
simulateNewNotification, // Export hàm mới

getNotifications: async (): Promise<Notification[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [...mockNotifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
},

// ... (các hàm khác giữ nguyên)
markAsRead: async (id: string): Promise<Notification> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const notification = mockNotifications.find((n) => n.id === id);
  if (!notification) {
    throw new Error('Notification not found');
  }
  notification.isRead = true;
  return { ...notification };
},

markAllAsRead: async (): Promise<Notification[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  mockNotifications.forEach((n) => (n.isRead = true));
  return [...mockNotifications];
},
};