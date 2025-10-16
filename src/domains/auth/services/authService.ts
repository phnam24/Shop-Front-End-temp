import axios, { AxiosError } from 'axios';
import type {
  LoginRequest,
  RegisterRequest,
  ApiResponse,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  UserInfoResponse,
  ApiError,
} from '../types';

// Base API URL - sẽ được config từ environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - thêm token vào header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - xử lý lỗi và refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as any;

    // Nếu lỗi 401 (Unauthorized) và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const currentToken = localStorage.getItem('token');
      
      if (currentToken) {
        try {
          // Thử refresh token
          const refreshResponse = await authService.refreshToken(currentToken);
          
          // Lưu token mới
          localStorage.setItem('token', refreshResponse.token);
          
          // Update Authorization header cho request gốc
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.token}`;
          
          // Retry request gốc với token mới
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh token thất bại, logout
          console.error('Refresh token failed:', refreshError);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // Không có token, redirect về login
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth Service Functions
export const authService = {
  /**
   * Đăng nhập
   */
  login: async (data: LoginRequest): Promise<{ token: string; user: UserInfoResponse }> => {
    try {
      // Step 1: Login để lấy token
      const loginResponse = await apiClient.post<ApiResponse<LoginResponse>>(
        '/identity/auth/token',
        data
      );

      if (loginResponse.data.code !== 1000) {
        throw new Error(loginResponse.data.message || 'Đăng nhập thất bại');
      }

      const { token } = loginResponse.data.result;

      // Step 2: Lưu token tạm để có thể gọi API my-info
      localStorage.setItem('token', token);

      // Step 3: Lấy thông tin user
      const userResponse = await apiClient.get<ApiResponse<UserInfoResponse>>(
        '/identity/users/my-info'
      );

      if (userResponse.data.code !== 1000) {
        throw new Error('Không thể lấy thông tin người dùng');
      }

      return {
        token,
        user: userResponse.data.result,
      };
    } catch (error) {
      // Clear token nếu có lỗi
      localStorage.removeItem('token');
      throw handleApiError(error);
    }
  },

  /**
   * Đăng ký - Chỉ tạo user, không login
   */
  register: async (data: RegisterRequest): Promise<UserInfoResponse> => {
    try {
      // Register chỉ trả về user info, không có token
      const registerResponse = await apiClient.post<ApiResponse<UserInfoResponse>>(
        '/identity/users/createUser',
        data
      );

      if (registerResponse.data.code !== 1000) {
        throw new Error(registerResponse.data.message || 'Đăng ký thất bại');
      }

      return registerResponse.data.result;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Đăng xuất
   */
  logout: async (): Promise<void> => {
    try {
      // Lấy token hiện có trong localStorage
      const token = localStorage.getItem('token');
  
      if (!token) {
        console.warn('Không có token để logout');
        return;
      }
  
      // Gửi request logout kèm body có token
      await apiClient.post('/identity/auth/logout', { token });
  
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Dù logout thành công hay thất bại, vẫn clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  /**
   * Lấy thông tin user hiện tại
   */
  getCurrentUser: async (): Promise<UserInfoResponse> => {
    try {
      const response = await apiClient.get<ApiResponse<UserInfoResponse>>(
        '/identity/users/my-info'
      );

      if (response.data.code !== 1000) {
        throw new Error('Không thể lấy thông tin người dùng');
      }

      return response.data.result;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Refresh token - Gửi token cũ để lấy token mới
   */
  refreshToken: async (token: string): Promise<RefreshTokenResponse> => {
    try {
      const response = await apiClient.post<ApiResponse<RefreshTokenResponse>>(
        '/identity/auth/refresh',
        { token } as RefreshTokenRequest
      );

      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Refresh token thất bại');
      }

      return response.data.result;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Kiểm tra username đã tồn tại chưa
   */
  checkUsernameAvailability: async (username: string): Promise<boolean> => {
    try {
      const response = await apiClient.get<ApiResponse<{ available: boolean }>>(
        `/identity/auth/check-username?username=${username}`
      );
      return response.data.result.available;
    } catch (error) {
      // Nếu API không có endpoint này, return true
      return true;
    }
  },
};

/**
 * Xử lý lỗi API
 */
const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;
    
    if (axiosError.response) {
      const data = axiosError.response.data;
      
      // Xử lý error từ backend API structure
      if (data.code && data.code !== 1000) {
        return {
          message: data.message || 'Có lỗi xảy ra',
          statusCode: axiosError.response.status,
          errors: data.errors,
        };
      }
      
      return {
        message: data.message || 'Có lỗi xảy ra',
        statusCode: axiosError.response.status,
        errors: data.errors,
      };
    }
    
    if (axiosError.request) {
      return {
        message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
        statusCode: 0,
      };
    }
  }

  return {
    message: 'Có lỗi không xác định xảy ra',
    statusCode: 500,
  };
};

export default apiClient;