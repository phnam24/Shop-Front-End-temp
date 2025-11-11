# Tổng Kết Tích Hợp API

## 📋 Tổng Quan
Đã hoàn thành việc chỉnh sửa source code để tích hợp với API thực thay vì sử dụng mock data.

## ✅ Các Thay Đổi Đã Thực Hiện

### 1. **Cấu Hình API** 
- **File**: `src/domains/products/services/productService.ts`
- Đổi base URL từ `http://localhost:8080` sang `http://localhost:8083/api`
- Cấu hình: Tạo file `.env` với `VITE_API_URL=http://localhost:8083/api`

### 2. **Cập Nhật Types/Interfaces**
- **File**: `src/domains/products/types/index.ts`

#### Product Interface:
```typescript
- images?: string[];              // CŨ
+ images?: string | string[];     // MỚI - API trả về JSON string
- status: 0 | 1;                  // CŨ
+ status: boolean;                // MỚI - API trả về boolean
- createdAt: string;              // CŨ
+ createdAt: string | null;       // MỚI - có thể null
```

#### ProductVariant Interface:
```typescript
- igpu?: string;                  // CŨ
+ igpu?: string | null;           // MỚI
- priceSale?: number;             // CŨ
+ priceSale?: number | null;      // MỚI
- createdAt: string;              // CŨ
+ createdAt: string | null;       // MỚI
```

#### VariantSpec Interface (HOÀN TOÀN MỚI):
```typescript
export interface VariantSpec {
  id: string;
  productVariantId: number;
  specAttributeId: number;
  attributeKey: string;
  attributeLabel: string;
  value: string;
}
```

### 3. **API Service Methods**

#### Category APIs:
```typescript
✅ getCategories()                 // GET /categories
✅ searchCategories(name)          // GET /categories/search?name=keyword
✅ getCategoryById(id)             // GET /categories/{id}
```

#### Product APIs:
```typescript
✅ getProducts(params)             // GET /products
   - Parse images từ JSON string sang array
   - Xử lý pagination
   
✅ getProductById(id)              // GET /products/{id}
   - Parse images từ JSON string
   
✅ getProductBySlug(slug)          // GET /products/slug/{slug}
   - Parse images từ JSON string
   
✅ searchProducts(name, categoryId) // GET /products/search?name=keyword
   - Đổi param từ 'q' sang 'name'
   - Parse images từ JSON string
```

#### ProductVariant APIs:
```typescript
✅ getVariantsByProductId(productId) // GET /variants/product/{productId}
```

#### VariantSpec APIs:
```typescript
✅ getVariantSpecs(variantId)        // GET /variant-specs/variant/{variantId}
```

### 4. **Cập Nhật UI Components**

#### ProductsPage.tsx:
- ✅ Thay `mockDataService` → `productService`
- ✅ Thay `mockBrands` → `brands` state (load từ API)
- ✅ Thay `mockCategories` → `categories` state (load từ API)
- ✅ Thêm `loadInitialData()` để load categories và brands khi khởi tạo

#### ProductDetailPage.tsx:
- ✅ Thay `mockDataService` → `productService`
- ✅ Load variants qua API: `getVariantsByProductId()`
- ✅ Xử lý product data với images đã được parse

#### ProductSearch.tsx:
- ✅ Thay `mockDataService.getProducts()` → `productService.searchProducts()`
- ✅ Xử lý kết quả trả về là array thay vì PaginatedResponse

#### ProductFilters.tsx:
- ✅ Thay `mockBrands` → `brands` state
- ✅ Load brands từ API trong `useEffect`

#### MegaMenu.tsx:
- ✅ Thêm import `productService` và `Category` type
- ✅ Load categories từ API (có thể dùng để động hóa menu sau này)

#### useProductDetail.ts (Hook):
- ✅ Thay `mockDataService` → `productService`
- ✅ Load variants qua API sau khi load product
- ✅ Xử lý product với images đã được parse

## 🔄 Xử Lý Đặc Biệt

### Parse Images từ JSON String:
API trả về `images` dưới dạng JSON string: `"[\"url1\", \"url2\"]"`

Đã thêm logic parse trong tất cả các API methods:
```typescript
images: typeof product.images === 'string' 
  ? JSON.parse(product.images || '[]') 
  : product.images || []
```

### Pagination:
API hiện tại không trả về pagination, tạm thời tự tạo structure:
```typescript
return {
  items: products,
  total: products.length,
  page: params.page || 1,
  pageSize: params.pageSize || 12,
  totalPages: Math.ceil(products.length / (params.pageSize || 12)),
};
```

## 📝 Lưu Ý Quan Trọng

### 1. Cấu hình môi trường:
Tạo file `.env` tại root project:
```env
VITE_API_URL=http://localhost:8083/api
```

### 2. CORS Configuration:
Đảm bảo backend cho phép CORS từ frontend origin.

### 3. Authentication:
Token được tự động thêm vào header nếu có trong localStorage:
```typescript
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 4. Error Handling:
Tất cả API calls đều có try-catch và log errors ra console.

## 🚀 Chạy Ứng Dụng

### Cách 1: Sử dụng file .env.local (Khuyến nghị)

1. Tạo file `.env.local` tại thư mục root:
```bash
# PowerShell
Set-Content -Path ".env.local" -Value "VITE_API_URL=http://localhost:8083/api"

# hoặc Bash/CMD
echo VITE_API_URL=http://localhost:8083/api > .env.local
```

2. **QUAN TRỌNG**: Restart lại dev server để load env variables mới:
```bash
# Tắt server hiện tại (Ctrl+C)
# Sau đó chạy lại:
npm run dev
```

3. Đảm bảo backend đang chạy tại `http://localhost:8083`

### Cách 2: Sử dụng Environment Variable trực tiếp

```bash
# PowerShell
$env:VITE_API_URL="http://localhost:8083/api"; npm run dev

# Bash
VITE_API_URL=http://localhost:8083/api npm run dev
```

### Kiểm Tra Cấu Hình

Mở browser console và check network requests, đảm bảo API calls đang gọi đến:
- ✅ `http://localhost:8083/api/products`
- ✅ `http://localhost:8083/api/categories`
- ❌ KHÔNG phải `http://localhost:8888/...` hoặc URL khác

## 🧪 Testing Checklist

- [ ] Load danh sách products từ `/products`
- [ ] Search products với keyword
- [ ] Xem chi tiết product
- [ ] Load variants của product
- [ ] Load specs của variant
- [ ] Filter products theo brand
- [ ] Filter products theo category
- [ ] Load categories trong MegaMenu
- [ ] Search categories

## 📂 Files Đã Chỉnh Sửa

1. `src/domains/products/types/index.ts` - Cập nhật interfaces
2. `src/domains/products/services/productService.ts` - Thêm/cập nhật API methods
3. `src/pages/ProductsPage.tsx` - Thay mock → real API
4. `src/pages/ProductDetailPage.tsx` - Thay mock → real API
5. `src/domains/products/components/ProductSearch.tsx` - Thay mock → real API
6. `src/domains/products/components/ProductFilters.tsx` - Thay mock → real API
7. `src/domains/products/hooks/useProductDetail.ts` - Thay mock → real API
8. `src/shared/components/layout/MegaMenu.tsx` - Thêm load categories từ API

## ⚠️ Lưu Ý Về Mock Data

File `mockDataService.ts` vẫn được giữ lại nhưng không còn được sử dụng trong code. Có thể xóa sau khi đã test kỹ API thật.

## 🎯 Kết Quả

✅ Tất cả components đã chuyển sang sử dụng API thực
✅ Không còn lỗi TypeScript/Linter
✅ Code structure được giữ nguyên, chỉ thay đổi data source
✅ Images được parse đúng format từ JSON string
✅ Tương thích với response structure của backend API

