// src/shared/components/NotificationCenter.tsx
import React, { useEffect } from 'react';
// Bỏ import Link
import { useNotificationStore } from '../../domains/notification/store/notificationStore';
import { Bell, Package, Tag, Settings, Loader2 } from 'lucide-react';

interface NotificationCenterProps {
  onClose: () => void;
  onViewAllClick: () => void; // <-- THÊM PROP MỚI
}

// ... (NotificationIcon component giữ nguyên)
const NotificationIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'order': return <Package className="w-5 h-5 text-primary-600" />;
        case 'promotion': return <Tag className="w-5 h-5 text-accent-600" />;
        case 'product': return <Package className="w-5 h-5 text-green-600" />;
        default: return <Settings className="w-5 h-5 text-gray-500" />;
    }
}


export const NotificationCenter: React.FC<NotificationCenterProps> = ({ onClose, onViewAllClick }) => { // <-- Thêm onViewAllClick
  const { notifications, isLoading, fetchNotifications, markAsRead, markAllAsRead, unreadCount } = useNotificationStore();

  useEffect(() => {
    // Chỉ fetch nếu chưa có dữ liệu hoặc đã lâu
    if (notifications.length === 0) {
        fetchNotifications();
    }
  }, []);

  const handleMarkAll = () => {
    markAllAsRead();
  }

  const handleViewAll = () => {
      onViewAllClick(); // <-- Gọi hàm mở panel
      onClose(); // Đóng dropdown
  }

  // Lấy 5 thông báo gần nhất để hiển thị trong dropdown
  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="absolute top-full right-0 mt-2 w-80 md:w-96 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 animate-slide-down">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-bold text-lg text-gray-900">Thông báo</h3>
        {unreadCount > 0 && (
            <button onClick={handleMarkAll} className="text-xs text-primary-600 font-semibold hover:underline">
            Đánh dấu đã đọc tất cả
            </button>
        )}
      </div>
      
      {isLoading ? (
        <div className="h-48 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
        </div>
      ) : recentNotifications.length === 0 ? (
        <div className="h-48 flex flex-col items-center justify-center text-center p-4">
            <Bell className="w-12 h-12 text-gray-300 mb-2" />
            <p className="text-sm font-semibold text-gray-700">Không có thông báo mới</p>
            <p className="text-xs text-gray-500">Bạn sẽ nhận được thông báo tại đây.</p>
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto">
          {recentNotifications.map(notification => (
            // Thay Link bằng div hoặc button nếu không muốn điều hướng ngay
            <div
              key={notification.id}
              onClick={() => {
                markAsRead(notification.id);
                // Optional: Điều hướng nếu có link
                // if (notification.link) navigate(notification.link);
                onClose();
              }}
              className={`flex items-start gap-3 p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.isRead ? 'bg-blue-50' : ''}`}
            >
              <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-gray-100">
                <NotificationIcon type={notification.type} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm mb-1 ${!notification.isRead ? 'font-bold text-gray-900' : 'font-semibold text-gray-800'}`}>{notification.title}</p>
                <p className="text-xs text-gray-600 line-clamp-2">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(notification.createdAt).toLocaleString('vi-VN')}</p>
              </div>
              {!notification.isRead && (
                 <div className="w-2.5 h-2.5 rounded-full bg-primary-600 mt-1 flex-shrink-0"></div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <div className="p-2 bg-gray-50 rounded-b-xl">
        {/* Thay Link bằng Button */}
        <button onClick={handleViewAll} className="block w-full text-center text-sm font-semibold text-primary-600 py-2 hover:bg-gray-100 rounded-md">
            Xem tất cả thông báo
        </button>
      </div>
    </div>
  );
};