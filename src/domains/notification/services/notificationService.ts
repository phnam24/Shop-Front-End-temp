// src/domains/notification/services/notificationService.ts
import apiClient from '../../auth/services/authService';
import { mockNotificationService } from './mockNotificationData';
import type { Notification, ApiResponse } from '../types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export const notificationService = {
  getNotifications: async (): Promise<Notification[]> => {
    if (USE_MOCK) {
      return mockNotificationService.getNotifications();
    }
    const response = await apiClient.get<ApiResponse<Notification[]>>('/notifications');
    return response.data.result;
  },

  markAsRead: async (id: string): Promise<Notification> => {
    if (USE_MOCK) {
      return mockNotificationService.markAsRead(id);
    }
    const response = await apiClient.put<ApiResponse<Notification>>(`/notifications/${id}/read`);
    return response.data.result;
  },

  markAllAsRead: async (): Promise<Notification[]> => {
    if (USE_MOCK) {
        return mockNotificationService.markAllAsRead();
    }
    const response = await apiClient.put<ApiResponse<Notification[]>>('/notifications/read-all');
    return response.data.result;
  },
};