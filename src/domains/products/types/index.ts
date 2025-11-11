// Brand Types
export interface Brand {
  id: number;
  name: string;
  logo?: string;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  parentId?: number;
  children?: Category[];
}

// Product Variant Types
export interface ProductVariant {
  id: number;
  productId: number;
  sku: string;
  color?: string;
  ramGb?: number;
  storageGb?: number;
  cpuModel?: string;
  igpu?: string | null;
  gpuModel?: string;
  chipsetModel?: string | null;
  os?: string;
  priceList: number;
  priceSale?: number | null;
  stock: number;
  weightG?: number;
  specs?: VariantSpec[] | null;
  createdAt: string | null;
  updatedAt?: string | null;
}

// Spec Attribute Types
export interface SpecAttribute {
  id: number;
  keyName: string;
  label: string;
  dataType: 'TEXT' | 'INT' | 'DECIMAL' | 'BOOL';
  searchable: boolean;
  facetable: boolean;
}

export interface VariantSpec {
  id: string;
  productVariantId: number;
  specAttributeId: number;
  attributeKey: string;
  attributeLabel: string;
  value: string;
}

// Product Types
export interface Product {
  id: number;
  categories: Category[]; // Array of categories
  brand: Brand; // Brand object embedded
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  priceList: number; // Giá niêm yết
  priceSale: number; // Giá khuyến mãi
  avatar?: string;
  images?: string | string[]; // API trả về string (JSON), cần parse
  firstImage?: string | null;
  status: boolean;
  createdAt: string | null;
  updatedAt?: string | null;
  
  // Relations
  variants?: ProductVariant[];
  
  // Computed fields (for backward compatibility)
  categoryId?: number; // Lấy từ categories[0].id nếu cần
  brandId?: number; // Lấy từ brand.id nếu cần
  minPrice?: number;
  maxPrice?: number;
  hasDiscount?: boolean;
  discountPercent?: number;
  rating?: number;
  reviewCount?: number;
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

// Filter & Sort Types
export interface ProductFilters {
  categoryId?: number;
  brandIds?: number[];
  minPrice?: number;
  maxPrice?: number;
  ramGb?: number[];
  storageGb?: number[];
  cpuModel?: string[];
  gpuModel?: string[];
  colors?: string[];
  inStock?: boolean;
  onSale?: boolean;
  search?: string;
}

export interface ProductSortOption {
  field: 'name' | 'priceList' | 'priceSale' | 'createdAt';
  order: 'asc' | 'desc';
}

export interface ProductQueryParams extends ProductFilters {
  page?: number;
  pageSize?: number;
  sort?: ProductSortOption;
}

// UI State Types
export interface ProductListState {
  products: Product[];
  filters: ProductFilters;
  sort: ProductSortOption;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  isLoading: boolean;
  error?: string;
}

// Mega Menu Types
export interface MegaMenuItem {
  category: Category;
  subCategories: Category[];
  featured?: {
    brands: Brand[];
    links: Array<{
      label: string;
      href: string;
    }>;
  };
}