// src/domains/notification/store/notificationStore.ts
import { create } from 'zustand';
import { notificationService } from '../services/notificationService';
import type { Notification } from '../types';

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  addNotification: (notification: Notification) => void; // <-- THÊM DÒNG NÀY
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const notifications = await notificationService.getNotifications();
      const unreadCount = notifications.filter((n) => !n.isRead).length;
      set({ notifications, unreadCount, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      set({ isLoading: false });
    }
  },

  // THÊM ACTION MỚI
  addNotification: (notification: Notification) => {
    set(state => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  markAsRead: async (id: string) => {
    const { notifications } = get();
    const notification = notifications.find((n) => n.id === id);
    if (notification && !notification.isRead) {
      try {
        const updatedNotification = await notificationService.markAsRead(id);
        const newNotifications = notifications.map((n) =>
          n.id === id ? updatedNotification : n
        );
        const newUnreadCount = get().unreadCount - 1;
        set({ notifications: newNotifications, unreadCount: newUnreadCount > 0 ? newUnreadCount : 0 });
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }
  },

  markAllAsRead: async () => {
    try {
        await notificationService.markAllAsRead();
        const { notifications } = get();
        const newNotifications = notifications.map(n => ({...n, isRead: true}));
        set({ notifications: newNotifications, unreadCount: 0 });
    } catch (error) {
        console.error('Failed to mark all notifications as read:', error);
    }
  },
}));