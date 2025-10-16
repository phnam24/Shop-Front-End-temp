import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

/**
 * Hook chính để quản lý authentication
 */
export const useAuth = () => {
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  } = useAuthStore();

  // Auto refresh user khi mount
  useEffect(() => {
    if (isAuthenticated && !user) {
      refreshUser();
    }
  }, [isAuthenticated, user, refreshUser]);

  const handleLogin = async (username: string, password: string) => {
    await login(username, password);
    navigate('/');
  };

  const handleRegister = async (data: any) => {
    const result = await register(data);
    // Không redirect, để component tự handle
    return result;
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshUser,
  };
};

/**
 * Hook để protect routes - chuyển hướng nếu chưa login
 */
export const useRequireAuth = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return { isAuthenticated, isLoading };
};

/**
 * Hook để redirect nếu đã login
 */
export const useRedirectIfAuthenticated = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return { isAuthenticated, isLoading };
};