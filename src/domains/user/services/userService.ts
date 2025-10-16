import apiClient from '../../auth/services/authService';
import type {
  UserProfile,
  UpdateProfileRequest,
  Address,
  CreateAddressRequest,
  UpdateAddressRequest,
  ChangePasswordRequest,
  ApiResponse,
} from '../types';

/**
 * User Service - Quản lý thông tin người dùng
 */
export const userService = {
  /**
   * Lấy thông tin profile người dùng hiện tại
   */
  getProfile: async (): Promise<UserProfile> => {
    try {
      const response = await apiClient.get<ApiResponse<UserProfile>>('/users/my-info');

      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Không thể lấy thông tin người dùng');
      }

      return response.data.result;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Cập nhật thông tin profile
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<UserProfile> => {
    try {
      const response = await apiClient.put<ApiResponse<UserProfile>>('/users/my-info', data);

      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Không thể cập nhật thông tin');
      }

      return response.data.result;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Đổi mật khẩu
   */
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    try {
      const response = await apiClient.put<ApiResponse<any>>('/users/change-password', data);

      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Không thể đổi mật khẩu');
      }
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Lấy danh sách địa chỉ
   */
  getAddresses: async (): Promise<Address[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Address[]>>('/users/addresses');

      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Không thể lấy danh sách địa chỉ');
      }

      return response.data.result;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Thêm địa chỉ mới
   */
  createAddress: async (data: CreateAddressRequest): Promise<Address> => {
    try {
      const response = await apiClient.post<ApiResponse<Address>>('/users/addresses', data);

      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Không thể thêm địa chỉ');
      }

      return response.data.result;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Cập nhật địa chỉ
   */
  updateAddress: async (id: string, data: Partial<CreateAddressRequest>): Promise<Address> => {
    try {
      const response = await apiClient.put<ApiResponse<Address>>(`/users/addresses/${id}`, data);

      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Không thể cập nhật địa chỉ');
      }

      return response.data.result;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Xóa địa chỉ
   */
  deleteAddress: async (id: string): Promise<void> => {
    try {
      const response = await apiClient.delete<ApiResponse<any>>(`/users/addresses/${id}`);

      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Không thể xóa địa chỉ');
      }
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Đặt địa chỉ mặc định
   */
  setDefaultAddress: async (id: string): Promise<Address> => {
    try {
      const response = await apiClient.put<ApiResponse<Address>>(
        `/users/addresses/${id}/set-default`
      );

      if (response.data.code !== 1000) {
        throw new Error(response.data.message || 'Không thể đặt địa chỉ mặc định');
      }

      return response.data.result;
    } catch (error) {
      throw handleError(error);
    }
  },
};

/**
 * Handle API errors
 */
const handleError = (error: any): Error => {
  if (error.response) {
    const message = error.response.data?.message || 'Có lỗi xảy ra';
    return new Error(message);
  }
  if (error.request) {
    return new Error('Không thể kết nối đến server');
  }
  return new Error(error.message || 'Có lỗi không xác định');
};

export default userService;

