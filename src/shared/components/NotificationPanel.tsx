// src/shared/components/NotificationPanel.tsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotificationStore } from '../../domains/notification/store/notificationStore';
import { Bell, Package, Tag, Settings, Loader2, X, CheckCheck } from 'lucide-react';
import { clsx } from 'clsx';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'order': return <Package className="w-5 h-5 text-primary-600" />;
        case 'promotion': return <Tag className="w-5 h-5 text-accent-600" />;
        case 'product': return <Package className="w-5 h-5 text-green-600" />;
        default: return <Settings className="w-5 h-5 text-gray-500" />;
    }
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const { notifications, isLoading, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();

  useEffect(() => {
    // Fetch notifications when the panel opens for the first time or if it's empty
    if (isOpen && notifications.length === 0) {
      fetchNotifications();
    }
  }, [isOpen, notifications.length, fetchNotifications]);

  const handleMarkAll = () => {
    markAllAsRead();
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={clsx(
          "fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ease-out",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={clsx(
          "fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <h3 className="font-bold text-lg text-gray-900 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-primary-600"/>
            Tất cả thông báo
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAll}
              className="text-xs text-primary-600 font-semibold hover:underline p-1"
              title="Đánh dấu tất cả đã đọc"
            >
              <CheckCheck className="w-4 h-4 mr-1 inline"/>
              Đọc tất cả
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Đóng"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Panel Body */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <Bell className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-base font-semibold text-gray-700">Chưa có thông báo nào</p>
              <p className="text-sm text-gray-500 mt-1">Thông báo mới sẽ xuất hiện ở đây.</p>
            </div>
          ) : (
            <div>
              {notifications.map(notification => (
                <Link
                  key={notification.id}
                  to={notification.link || '#'}
                  onClick={() => {
                    markAsRead(notification.id);
                    onClose(); // Optional: close panel on click
                  }}
                  className={clsx(
                    "flex items-start gap-4 p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors relative",
                    !notification.isRead && "bg-blue-50 font-semibold"
                  )}
                >
                  {/* Read Indicator */}
                  {!notification.isRead && (
                    <div className="absolute top-4 left-1.5 w-2 h-2 rounded-full bg-primary-600"></div>
                  )}
                  <div className={clsx(
                      "w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center",
                      !notification.isRead ? "bg-blue-100" : "bg-gray-100"
                  )}>
                    <NotificationIcon type={notification.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={clsx("text-sm mb-1 line-clamp-2", !notification.isRead ? "text-gray-900 font-bold" : "text-gray-800")}>
                        {notification.title}
                    </p>
                    <p className={clsx("text-xs line-clamp-2", !notification.isRead ? "text-gray-700" : "text-gray-600")}>
                        {notification.message}
                    </p>
                    <p className={clsx("text-xs mt-1.5", !notification.isRead ? "text-primary-700" : "text-gray-400")}>
                        {new Date(notification.createdAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </Link>
              ))}
              {/* Add Load More button here if needed */}
            </div>
          )}
        </div>
      </div>
    </>
  );
};