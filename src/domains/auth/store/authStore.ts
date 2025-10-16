import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthState } from '../types';
import { authService } from '../services/authService';

interface AuthStore extends AuthState {
  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string) => void;
  login: (username: string, password: string) => Promise<void>;
  register: (data: any) => Promise<{ success: boolean; username: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshAuthToken: () => Promise<boolean>; // Return true if success, false if failed
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      // Set user
      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      // Set token (combined access + refresh)
      setToken: (token) => {
        set({ accessToken: token, refreshToken: token });
        localStorage.setItem('token', token);
      },

      // Login
      login: async (username, password) => {
        set({ isLoading: true });
        try {
          const response = await authService.login({ username, password });
          
          // Lưu token
          get().setToken(response.token);
          
          // Lưu user
          get().setUser(response.user);
          
          set({ isLoading: false });
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Register - Chỉ tạo user, không login
      register: async (data) => {
        set({ isLoading: true });
        try {
          const userResponse = await authService.register(data);
          
          set({ isLoading: false });
          
          // Return thông tin để có thể tự động login sau
          return {
            success: true,
            username: userResponse.username,
          };
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Logout
      logout: async () => {
        try {
          await authService.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Reset state
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
          });
          
          // Clear localStorage
          localStorage.removeItem('token');
        }
      },

      // Refresh user data
      refreshUser: async () => {
        set({ isLoading: true });
        try {
          const user = await authService.getCurrentUser();
          get().setUser(user);
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          // Nếu không lấy được user, logout
          get().logout();
        }
      },

      // Refresh token
      refreshAuthToken: async () => {
        const currentToken = get().accessToken;
        if (!currentToken) {
          return false;
        }

        try {
          const response = await authService.refreshToken(currentToken);
          
          // Cập nhật token mới
          get().setToken(response.token);
          
          return true;
        } catch (error) {
          console.error('Refresh token failed:', error);
          // Refresh token thất bại, logout
          get().logout();
          return false;
        }
      },

      // Set loading
      setLoading: (isLoading) => {
        set({ isLoading });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);