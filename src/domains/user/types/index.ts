// User Profile Types
export interface UserProfile {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dob?: string; // ISO date string
  avatar?: string;
  roles: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

// Update Profile Request
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dob?: string;
}

// Address Types
export interface Address {
  id: string;
  userId: string;
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  ward?: string; // Phường/Xã
  district: string; // Quận/Huyện
  city: string; // Tỉnh/Thành phố
  isDefault: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateAddressRequest {
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  ward?: string;
  district: string;
  city: string;
  isDefault?: boolean;
}

export interface UpdateAddressRequest extends Partial<CreateAddressRequest> {
  id: string;
}

// Change Password Types
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// API Response Types
export interface ApiResponse<T> {
  code: number;
  result: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

