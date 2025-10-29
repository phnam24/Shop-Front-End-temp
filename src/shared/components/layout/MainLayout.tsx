// src/shared/components/layout/MainLayout.tsx
import React, { useState } from 'react'; // <-- THÊM useState
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ToastContainer } from '../ui/Toast';
import { useToastStore } from '../../hooks/useToast';
import { useRealtimeNotifications } from '../../../domains/notification/hooks/useRealtimeNotifications';

export const MainLayout: React.FC = () => {
  const { toasts, removeToast } = useToastStore();
  
  // Khởi tạo hook để lắng nghe thông báo real-time
  useRealtimeNotifications();

  // KHÔNG cần state ở đây nữa vì đã chuyển vào Header

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header sẽ tự quản lý NotificationPanel */}
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
    </div>
  );
};