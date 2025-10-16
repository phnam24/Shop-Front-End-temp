import type { Brand, Category, Product, ProductVariant, PaginatedResponse, ProductQueryParams } from '../types';

// Mock Brands
export const mockBrands: Brand[] = [
  { id: 1, name: 'Apple (Macbook)', logo: '/brands/apple.png' },
  { id: 2, name: 'Dell', logo: '/brands/dell.png' },
  { id: 3, name: 'HP', logo: '/brands/hp.png' },
  { id: 4, name: 'Lenovo', logo: '/brands/lenovo.png' },
  { id: 5, name: 'ASUS', logo: '/brands/asus.png' },
  { id: 6, name: 'Acer', logo: '/brands/acer.png' },
  { id: 7, name: 'MSI', logo: '/brands/msi.png' },
  { id: 8, name: 'LG Gram', logo: '/brands/lg.png' },
  { id: 9, name: 'Gigabyte', logo: '/brands/gigabyte.png' },
  { id: 10, name: 'Samsung', logo: '/brands/samsung.png' },
];

// Mock Categories with hierarchy
export const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Laptop',
    children: [
      { id: 11, name: 'Laptop Gaming', parentId: 1 },
      { id: 12, name: 'Laptop AI', parentId: 1 },
      { id: 13, name: 'Laptop đồ họa', parentId: 1 },
      { id: 14, name: 'Laptop Sinh viên', parentId: 1 },
      { id: 15, name: 'Laptop Văn phòng', parentId: 1 },
      { id: 16, name: 'Laptop cắm ứng 2 in 1', parentId: 1 },
      { id: 17, name: 'Laptop mỏng nhẹ', parentId: 1 },
      { id: 18, name: 'Laptop Doanh nhân', parentId: 1 },
    ],
  },
  {
    id: 2,
    name: 'Điện thoại',
    children: [
      { id: 21, name: 'iPhone', parentId: 2 },
      { id: 22, name: 'Samsung', parentId: 2 },
      { id: 23, name: 'Xiaomi', parentId: 2 },
      { id: 24, name: 'OPPO', parentId: 2 },
      { id: 25, name: 'Vivo', parentId: 2 },
      { id: 26, name: 'Realme', parentId: 2 },
    ],
  },
];

// Mock Products
const generateMockProducts = (): Product[] => {
  const products: Product[] = [];
  const laptopNames = [
    'Dell XPS 13 Plus',
    'MacBook Air M2',
    'HP Pavilion 15',
    'Lenovo ThinkPad X1 Carbon',
    'ASUS ROG Strix G15',
    'Acer Nitro 5',
    'MSI Stealth 15',
    'LG Gram 17',
    'Dell Inspiron 15',
    'HP Omen 16',
    'Lenovo Legion 5',
    'ASUS Vivobook 15',
    'Acer Swift 3',
    'MacBook Pro 14 M3',
    'Dell Latitude 5440',
  ];

  laptopNames.forEach((name, index) => {
    const brandId = (index % 9) + 1;
    const basePrice = 15000000 + (index * 2000000);
    const salePrice = Math.random() > 0.5 ? basePrice * 0.85 : undefined;
    
    products.push({
      id: index + 1,
      categoryId: 11 + (index % 8),
      brandId,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      shortDescription: `${name} - Hiệu năng mạnh mẽ, thiết kế tinh tế`,
      description: `<p>${name} là sản phẩm laptop cao cấp với hiệu năng vượt trội, phù hợp cho công việc và giải trí.</p>`,
      avatar: `/products/laptop-${index + 1}.jpg`,
      images: [
        `/products/laptop-${index + 1}-1.jpg`,
        `/products/laptop-${index + 1}-2.jpg`,
        `/products/laptop-${index + 1}-3.jpg`,
      ],
      firstImage: `/products/laptop-${index + 1}-1.jpg`,
      status: 1,
      createdAt: new Date().toISOString(),
      brand: mockBrands[brandId - 1],
      minPrice: salePrice || basePrice,
      maxPrice: basePrice,
      hasDiscount: !!salePrice,
      discountPercent: salePrice ? Math.round(((basePrice - salePrice) / basePrice) * 100) : 0,
      rating: 4 + Math.random(),
      reviewCount: Math.floor(Math.random() * 200) + 10,
      variants: [
        {
          id: index * 10 + 1,
          productId: index + 1,
          sku: `LAP-${index + 1}-001`,
          color: 'Bạc',
          ramGb: 16,
          storageGb: 512,
          cpuModel: 'Intel Core i7-1360P',
          gpuModel: 'Intel Iris Xe',
          os: 'Windows 11 Home',
          priceList: basePrice,
          priceSale: salePrice,
          stock: Math.floor(Math.random() * 50) + 5,
          weightG: 1500,
          createdAt: new Date().toISOString(),
        },
        {
          id: index * 10 + 2,
          productId: index + 1,
          sku: `LAP-${index + 1}-002`,
          color: 'Đen',
          ramGb: 32,
          storageGb: 1024,
          cpuModel: 'Intel Core i7-1360P',
          gpuModel: 'NVIDIA RTX 3050',
          os: 'Windows 11 Pro',
          priceList: basePrice + 5000000,
          priceSale: salePrice ? salePrice + 5000000 : undefined,
          stock: Math.floor(Math.random() * 30) + 3,
          weightG: 1600,
          createdAt: new Date().toISOString(),
        },
      ],
    });
  });

  return products;
};

export const mockProducts = generateMockProducts();

// Mock Service Functions
export const mockDataService = {
  getProducts: async (params: ProductQueryParams): Promise<PaginatedResponse<Product>> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filtered = [...mockProducts];

    // Apply filters
    if (params.categoryId) {
      filtered = filtered.filter((p) => p.categoryId === params.categoryId);
    }

    if (params.brandIds && params.brandIds.length > 0) {
      filtered = filtered.filter((p) => params.brandIds!.includes(p.brandId));
    }

    if (params.minPrice !== undefined) {
      filtered = filtered.filter((p) => (p.minPrice || 0) >= params.minPrice!);
    }

    if (params.maxPrice !== undefined) {
      filtered = filtered.filter((p) => (p.minPrice || 0) <= params.maxPrice!);
    }

    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchLower)
      );
    }

    if (params.inStock) {
      filtered = filtered.filter((p) =>
        p.variants?.some((v) => v.stock > 0)
      );
    }

    if (params.onSale) {
      filtered = filtered.filter((p) => p.hasDiscount);
    }

    // Apply sorting
    if (params.sort) {
      filtered.sort((a, b) => {
        const field = params.sort!.field;
        const order = params.sort!.order === 'asc' ? 1 : -1;

        if (field === 'name') {
          return a.name.localeCompare(b.name) * order;
        }
        if (field === 'priceList') {
          return ((a.minPrice || 0) - (b.minPrice || 0)) * order;
        }
        return 0;
      });
    }

    // Pagination
    const page = params.page || 1;
    const pageSize = params.pageSize || 12;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedItems = filtered.slice(start, end);

    return {
      items: paginatedItems,
      total: filtered.length,
      page,
      pageSize,
      totalPages: Math.ceil(filtered.length / pageSize),
    };
  },

  getProductById: async (id: number): Promise<Product> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const product = mockProducts.find((p) => p.id === id);
    if (!product) {
      throw new Error('Không tìm thấy sản phẩm');
    }
    return product;
  },

  getProductBySlug: async (slug: string): Promise<Product> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const product = mockProducts.find((p) => p.slug === slug);
    if (!product) {
      throw new Error('Không tìm thấy sản phẩm');
    }
    return product;
  },

  getBrands: async (): Promise<Brand[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockBrands;
  },

  getCategories: async (): Promise<Category[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockCategories;
  },

  getPriceRange: async (): Promise<{ min: number; max: number }> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const prices = mockProducts.map((p) => p.minPrice || 0);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  },
};