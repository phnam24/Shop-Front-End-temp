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
  igpu?: string;
  gpuModel?: string;
  chipsetModel?: string;
  os?: string;
  priceList: number;
  priceSale?: number;
  stock: number;
  weightG?: number;
  specs?: VariantSpec[];
  createdAt: string;
  updatedAt?: string;
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
  variantId: number;
  attributeId: number;
  value?: string;
  attribute?: SpecAttribute;
}

// Product Types
export interface Product {
  id: number;
  categoryId: number;
  brandId: number;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  avatar?: string;
  images?: string[];
  firstImage?: string;
  status: 0 | 1;
  createdAt: string;
  updatedAt?: string;
  
  // Relations (sẽ được populate từ API)
  category?: Category;
  brand?: Brand;
  variants?: ProductVariant[];
  
  // Computed fields
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