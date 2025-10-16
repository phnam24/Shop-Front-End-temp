import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../domains/auth/store/authStore';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Component bảo vệ routes - chỉ cho phép truy cập khi đã đăng nhập
 * Redirect về /auth nếu chưa login, lưu previous location để redirect lại sau khi login
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  // Đang loading authentication state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Đang xác thực...</p>
        </div>
      </div>
    );
  }

  // Chưa đăng nhập -> redirect về auth page
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Đã đăng nhập -> render children
  return <>{children}</>;
};

