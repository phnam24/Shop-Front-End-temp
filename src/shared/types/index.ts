// Base types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Product types
export interface Product extends BaseEntity {
  name: string;
  slug: string;
  category: ProductCategory;
  brand: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  thumbnail: string;
  description: string;
  specifications: Specification[];
  variants: ProductVariant[];
  stock: number;
  rating: number;
  reviewCount: number;
  tags: string[];
}

export type ProductCategory = 'laptop' | 'smartphone';

export interface Specification {
  label: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  type: 'color' | 'storage' | 'ram';
  name: string;
  value: string;
  priceAdjustment: number;
  stock: number;
}

// User types
export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  addresses: Address[];
  defaultAddressId?: string;
}

export interface Address extends BaseEntity {
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  isDefault: boolean;
}

// Cart types
export interface CartItem {
  id: string;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  price: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}