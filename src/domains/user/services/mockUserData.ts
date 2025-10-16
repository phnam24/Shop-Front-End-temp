import type { UserProfile, Address } from '../types';

/**
 * Mock User Data - Development Only
 */

// Mock current user profile
export const mockUserProfile: UserProfile = {
  id: 'user-001',
  username: 'johndoe123',
  firstName: 'Nguyễn',
  lastName: 'Văn An',
  email: 'nguyenvanan@example.com',
  phone: '0912345678',
  dob: '1995-05-15',
  avatar: 'https://i.pravatar.cc/150?img=33',
  roles: [
    {
      id: 'role-001',
      name: 'USER',
      description: 'Khách hàng thông thường',
    },
  ],
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-10-10T14:20:00Z',
};

// Mock addresses
export const mockAddresses: Address[] = [
  {
    id: 'addr-001',
    userId: 'user-001',
    recipientName: 'Nguyễn Văn An',
    phone: '0912345678',
    addressLine1: '123 Nguyễn Huệ',
    addressLine2: 'Tòa nhà ABC, Tầng 5',
    ward: 'Phường Bến Nghé',
    district: 'Quận 1',
    city: 'TP. Hồ Chí Minh',
    isDefault: true,
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-03-15T11:30:00Z',
  },
  {
    id: 'addr-002',
    userId: 'user-001',
    recipientName: 'Nguyễn Văn An',
    phone: '0987654321',
    addressLine1: '456 Lê Lợi',
    addressLine2: '',
    ward: 'Phường Bến Thành',
    district: 'Quận 1',
    city: 'TP. Hồ Chí Minh',
    isDefault: false,
    createdAt: '2024-02-10T14:20:00Z',
  },
  {
    id: 'addr-003',
    userId: 'user-001',
    recipientName: 'Trần Thị Bình',
    phone: '0901234567',
    addressLine1: '789 Trần Hưng Đạo',
    addressLine2: 'Chung cư XYZ',
    ward: 'Phường Cầu Ông Lãnh',
    district: 'Quận 1',
    city: 'TP. Hồ Chí Minh',
    isDefault: false,
    createdAt: '2024-03-01T08:15:00Z',
  },
];

// Helper functions for mock CRUD operations
let addressesData = [...mockAddresses];
let currentAddressId = 4;

export const mockUserService = {
  // Get user profile
  getProfile: async (): Promise<UserProfile> => {
    await delay(500);
    return { ...mockUserProfile };
  },

  // Update profile
  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    await delay(800);
    Object.assign(mockUserProfile, data);
    mockUserProfile.updatedAt = new Date().toISOString();
    return { ...mockUserProfile };
  },

  // Get addresses
  getAddresses: async (): Promise<Address[]> => {
    await delay(600);
    return [...addressesData];
  },

  // Create address
  createAddress: async (data: Omit<Address, 'id' | 'userId' | 'createdAt'>): Promise<Address> => {
    await delay(800);
    
    // If this is set as default, unset other defaults
    if (data.isDefault) {
      addressesData = addressesData.map(addr => ({ ...addr, isDefault: false }));
    }

    const newAddress: Address = {
      ...data,
      id: `addr-${String(currentAddressId++).padStart(3, '0')}`,
      userId: 'user-001',
      createdAt: new Date().toISOString(),
    };

    addressesData.push(newAddress);
    return { ...newAddress };
  },

  // Update address
  updateAddress: async (id: string, data: Partial<Address>): Promise<Address> => {
    await delay(700);
    
    const index = addressesData.findIndex(addr => addr.id === id);
    if (index === -1) {
      throw new Error('Không tìm thấy địa chỉ');
    }

    // If setting as default, unset other defaults
    if (data.isDefault) {
      addressesData = addressesData.map(addr => ({ ...addr, isDefault: false }));
    }

    addressesData[index] = {
      ...addressesData[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return { ...addressesData[index] };
  },

  // Delete address
  deleteAddress: async (id: string): Promise<void> => {
    await delay(500);
    
    const address = addressesData.find(addr => addr.id === id);
    if (address?.isDefault) {
      throw new Error('Không thể xóa địa chỉ mặc định');
    }

    addressesData = addressesData.filter(addr => addr.id !== id);
  },

  // Set default address
  setDefaultAddress: async (id: string): Promise<Address> => {
    await delay(600);
    
    const index = addressesData.findIndex(addr => addr.id === id);
    if (index === -1) {
      throw new Error('Không tìm thấy địa chỉ');
    }

    // Unset all other defaults
    addressesData = addressesData.map(addr => ({ ...addr, isDefault: false }));
    
    // Set this one as default
    addressesData[index].isDefault = true;
    addressesData[index].updatedAt = new Date().toISOString();

    return { ...addressesData[index] };
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await delay(1000);
    
    // Mock validation
    if (currentPassword !== 'oldpass123') {
      throw new Error('Mật khẩu hiện tại không đúng');
    }
    
    if (currentPassword === newPassword) {
      throw new Error('Mật khẩu mới phải khác mật khẩu cũ');
    }

    // Success - no return value
  },
};

// Utility: Simulate network delay
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

