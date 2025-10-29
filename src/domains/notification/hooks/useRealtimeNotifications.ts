// src/domains/notification/hooks/useRealtimeNotifications.ts
import { useEffect, useRef } from 'react';
import { useAuthStore } from '../../auth/store/authStore';
import { useToast } from '../../../shared/hooks/useToast';
import { useNotificationStore } from '../store/notificationStore';
import { notificationService } from '../services/notificationService';
import type { Notification } from '../types';

// Hàm này sẽ lấy các thông báo mới mà client chưa có
async function getNewNotifications(existingIds: string[]): Promise<Notification[]> {
  const allNotifications = await notificationService.getNotifications();
  // Trong ứng dụng thực tế, API sẽ hiệu quả hơn, ví dụ: /notifications?since=<timestamp>
  // Ở đây, chúng ta lọc ra những thông báo mà client chưa có ID.
  return allNotifications.filter(n => !existingIds.includes(n.id));
}

export const useRealtimeNotifications = () => {
  const { isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const { notifications, addNotification } = useNotificationStore();
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Chỉ chạy khi người dùng đã đăng nhập
    if (isAuthenticated) {
      // Bắt đầu kiểm tra thông báo định kỳ
      intervalRef.current = setInterval(async () => {
        try {
          // Lấy ID của các thông báo hiện có
          const existingIds = notifications.map(n => n.id);
          
          // Chỉ trong mock mode: gọi hàm để mô phỏng có thông báo mới từ server
          if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
            const { mockNotificationService } = await import('../services/mockNotificationData');
            mockNotificationService.simulateNewNotification();
          }

          // Lấy danh sách thông báo và tìm ra những cái mới
          const newNotifications = await getNewNotifications(existingIds);

          if (newNotifications.length > 0) {
            for (const newNotification of newNotifications) {
              // Thêm vào store để cập nhật UI
              addNotification(newNotification);

              // Hiển thị toast
              toast.info(newNotification.title);
            }
          }
        } catch (error) {
          console.error("Lỗi khi kiểm tra thông báo mới:", error);
        }
      }, 15000); // Kiểm tra mỗi 15 giây
    }

    // Dọn dẹp khi component unmount hoặc user đăng xuất
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAuthenticated, notifications, addNotification, toast]);
};