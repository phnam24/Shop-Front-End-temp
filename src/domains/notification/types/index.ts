// src/domains/notification/types/index.ts
export type NotificationType = 'order' | 'promotion' | 'system' | 'product';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  code: number;
  message?: string;
  result: T;
}