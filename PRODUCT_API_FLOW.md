# 🔄 Luồng Hoạt Động API - Products & UI

## 📊 Tổng Quan Cập Nhật

Đã hoàn thành cập nhật **Product API** và các **UI Components** liên quan để khớp với API microservice mới.

---

## 🎯 Thay Đổi Chính

### 1. **Product Structure Mới**

#### ❌ Cũ:
```typescript
{
  id: number;
  categoryId: number;  // Single ID
  brandId: number;     // Single ID
  ...
}
```

#### ✅ Mới:
```typescript
{
  id: number;
  categories: Category[];  // Array of categories
  brand: Brand;           // Embedded object
  priceList: number;      // Giá niêm yết
  priceSale: number;      // Giá khuyến mãi
  ...
}
```

### 2. **API Endpoints**

| API | URL | Response |
|-----|-----|----------|
| Get All Products | `GET /api/products` | Array of Products |
| Get by ID | `GET /api/products/{id}` | Single Product |
| Get by Slug | `GET /api/products/slug/{slug}` | Single Product |
| Get Variants | `GET /api/variants/product/{id}` | Array of Variants |
| Search Variant by SKU | `GET /api/variants/search?sku={sku}` | Array of Variants |
| Get Variant Specs | `GET /api/variant-specs/variant/{id}` | Array of Specs |

---

## 🔄 Luồng Hoạt Động Chi Tiết

### **A. TRANG DANH SÁCH SẢN PHẨM** (`/products`)

#### Bước 1: Khởi tạo trang
```
User vào /products
    ↓
📡 GET /api/categories  (load categories cho filter)
📡 GET /api/brands      (load brands cho filter)
📡 GET /api/products    (load products list)
    ↓
Parse & Normalize Data:
  - Parse images JSON string → array
  - Compute: categoryId, brandId, minPrice, maxPrice, hasDiscount
    ↓
Hiển thị danh sách products
```

#### Bước 2: User tương tác với Filters

**A. User chọn Brand Filter:**
```
User click checkbox "Apple"
    ↓
Update state: filters.brandIds = [1]
    ↓
📡 GET /api/products?brandIds=1
    ↓
Parse & Normalize → Hiển thị kết quả
```

**B. User search sản phẩm:**
```
User gõ "MacBook" vào search box
    ↓
Debounce 300ms
    ↓
📡 GET /api/products/search?name=MacBook
    ↓
Parse & Normalize → Show dropdown với top 5 kết quả
```

#### Component Files:
- `src/pages/ProductsPage.tsx` - Main page
- `src/domains/products/components/ProductCard.tsx` - Product card UI
- `src/domains/products/components/ProductFilters.tsx` - Filter sidebar
- `src/domains/products/components/ProductSearch.tsx` - Search box

---

### **B. TRANG CHI TIẾT SẢN PHẨM** (`/products/:slug`)

#### Luồng Load Product Detail:

```
User click vào product → Navigate to /products/{slug}
    ↓
📡 GET /api/products/slug/{slug}
    ↓
Parse & Normalize Product:
  ├─ Parse images: "[\"url1\"]" → ["url1"]
  ├─ Extract categoryId: categories[0].id
  ├─ Extract brandId: brand.id
  ├─ Compute: minPrice = priceSale, maxPrice = priceList
  └─ Compute: hasDiscount, discountPercent
    ↓
📡 GET /api/variants/product/{productId}
    ↓
Set default variant (variants[0])
    ↓
📡 GET /api/variant-specs/variant/{variantId}
    ↓
Load related products:
📡 GET /api/products?categoryId={categoryId}&pageSize=4
    ↓
Hiển thị:
  ├─ Product Gallery (images)
  ├─ Product Info (name, brand, price)
  ├─ Variant Selector (color, RAM, storage)
  ├─ Tabs: Description | Specs | Reviews
  └─ Related Products
```

#### User Actions:

**A. User chọn Variant khác:**
```
User click "32GB RAM" variant
    ↓
Update selectedVariant state
    ↓
📡 GET /api/variant-specs/variant/{newVariantId}
    ↓
Update UI:
  ├─ Price → priceSale của variant mới
  ├─ Stock → stock của variant mới
  └─ Specs tab → Specs của variant mới
```

**B. User xem tab "Thông số kỹ thuật":**
```
User click tab "Specs"
    ↓
Hiển thị 2 sections:

1. Cấu hình cơ bản (từ Variant):
   ├─ CPU: variant.cpuModel
   ├─ GPU: variant.gpuModel
   ├─ RAM: variant.ramGb
   ├─ Storage: variant.storageGb
   ├─ OS: variant.os
   ├─ Color: variant.color
   ├─ SKU: variant.sku
   └─ Weight: variant.weightG

2. Thông số chi tiết (từ API variant-specs):
   ├─ Màn hình
   ├─ Pin
   ├─ Bảo hành
   ├─ Webcam
   ├─ Âm thanh
   └─ ... (dynamic based on API)
```

#### Component Files:
- `src/pages/ProductDetailPage.tsx` - Main detail page
- `src/domains/products/components/ProductGallery.tsx` - Image gallery
- `src/domains/products/components/ProductVariants.tsx` - Variant selector

---

## 📝 Data Normalization

### Helper Function: `normalizeProduct()`

```typescript
const normalizeProduct = (product: any): Product => {
  return {
    ...product,
    // Parse images
    images: typeof product.images === 'string' 
      ? JSON.parse(product.images || '[]') 
      : product.images || [],
    
    // Backward compatibility
    categoryId: product.categories?.[0]?.id,
    brandId: product.brand?.id,
    
    // Price calculations
    minPrice: product.priceSale || product.priceList,
    maxPrice: product.priceList,
    hasDiscount: product.priceSale < product.priceList,
    discountPercent: Math.round(
      ((product.priceList - product.priceSale) / product.priceList) * 100
    ),
  };
};
```

**Tại sao cần normalize?**
- API mới trả về structure khác với code cũ
- Đảm bảo backward compatibility
- Tính toán các computed fields một lần
- UI components không cần thay đổi nhiều

---

## 🎨 UI Components Hiển Thị

### 1. **ProductCard** - Hiển thị gì?

```
┌─────────────────────────┐
│  [Discount Badge]       │
│  ┌──────────────────┐   │
│  │   Product Image  │   │
│  │   (firstImage)   │   │
│  └──────────────────┘   │
│  Brand Name              │
│  Product Name            │
│  ★★★★☆ (rating)         │
│  ┌─────┐ ┌─────┐        │
│  │16GB │ │512GB│ Specs  │
│  └─────┘ └─────┘        │
│  27.990.000₫  30.000.000₫│
│  [Thêm vào giỏ]         │
└─────────────────────────┘
```

**Data Sources:**
- Image: `product.firstImage || product.avatar`
- Brand: `product.brand.name`
- Price: `product.priceSale` (minPrice)
- Original Price: `product.priceList` (maxPrice)
- Discount: `product.discountPercent`
- Specs: `product.variants[0].ramGb/storageGb/cpuModel`

### 2. **ProductDetailPage - Specs Tab**

```
┌─ Cấu hình cơ bản ──────────────┐
│ CPU:     Intel Core i5-12450H  │
│ GPU:     GeForce RTX 3050      │
│ RAM:     16GB                   │
│ Storage: 512GB SSD              │
│ OS:      Windows 11 Home        │
│ Color:   Đen                    │
│ SKU:     230703419              │
│ Weight:  2.0 kg                 │
└─────────────────────────────────┘

┌─ Thông số kỹ thuật chi tiết ───┐
│ Màn hình:  15.6" FHD IPS 144Hz │
│ Pin:       3 cell 50 Wh        │
│ Webcam:    HD webcam            │
│ Bảo hành:  24 tháng             │
│ Bàn phím:  LED RGB              │
│ Âm thanh:  Acer TrueHarmony    │
│ ... (nhiều specs khác)          │
└─────────────────────────────────┘
```

**Data Sources:**
- Section 1: `selectedVariant.*` (CPU, GPU, RAM, etc.)
- Section 2: `variantSpecs[]` từ API `/variant-specs/variant/{id}`

---

## 🔍 API Response Examples

### Get Product Response:
```json
{
  "code": 1000,
  "message": "Product found",
  "result": {
    "id": 1,
    "categories": [
      { "id": 1, "name": "Apple", "parentId": null },
      { "id": 3, "name": "Macbook", "parentId": null }
    ],
    "brand": {
      "id": 1,
      "name": "Apple",
      "logo": ""
    },
    "name": "MacBook Air M2",
    "slug": "apple-macbook-air-m2",
    "priceList": 31900000,
    "priceSale": 27900000,
    "images": "[\"url1.jpg\", \"url2.jpg\"]",
    "status": true
  }
}
```

### Get Variants Response:
```json
{
  "code": 1000,
  "message": "Variants by product",
  "result": [
    {
      "id": 26,
      "productId": 26,
      "sku": "230703419",
      "color": "Đen",
      "ramGb": 16,
      "storageGb": 512,
      "cpuModel": "Intel® Core™ i5-12450H",
      "gpuModel": "GeForce RTX™ 3050",
      "os": "Windows 11 Home",
      "priceList": 22590000,
      "priceSale": 17490000,
      "stock": 0
    }
  ]
}
```

### Get Variant Specs Response:
```json
{
  "code": 1000,
  "message": "Variant specs fetched successfully",
  "result": [
    {
      "id": "uuid",
      "productVariantId": 26,
      "specAttributeId": 21,
      "attributeKey": "Ram",
      "attributeLabel": "Ram",
      "value": "2 x 8GB DDR4 3200MHz"
    },
    {
      "id": "uuid",
      "productVariantId": 26,
      "specAttributeId": 7,
      "attributeKey": "Màn hình",
      "attributeLabel": "Màn hình",
      "value": "15.6\" FHD IPS 144Hz"
    }
  ]
}
```

---

## ⚡ Performance Optimizations

### 1. **Computed Fields**
- Tính toán `minPrice`, `maxPrice`, `hasDiscount` một lần khi parse
- Không cần tính lại mỗi lần render

### 2. **Lazy Load Specs**
- Specs chỉ được load khi:
  - User vào ProductDetailPage (load specs của default variant)
  - User chọn variant khác (load specs của variant mới)
  - User click vào tab "Specs" (nếu chưa load)

### 3. **Images Parsing**
- Parse JSON string → array một lần khi normalize
- Cache parsed images trong state

---

## 🚀 Files Đã Cập Nhật

| File | Changes |
|------|---------|
| `types/index.ts` | ✅ Update Product interface (categories[], brand) |
| `services/productService.ts` | ✅ Add normalizeProduct(), searchVariantBySku() |
| `pages/ProductDetailPage.tsx` | ✅ Load variant specs, display specs tabs |
| `components/ProductCard.tsx` | ✅ Display brand.name, priceList/priceSale |
| All Product UIs | ✅ Compatible với structure mới |

---

## 📦 Backward Compatibility

Code đã đảm bảo backward compatibility:

```typescript
// Old code sử dụng categoryId vẫn hoạt động
const categoryId = product.categoryId; // ✅ Still works!

// Old code sử dụng brandId vẫn hoạt động  
const brandId = product.brandId; // ✅ Still works!

// Old code sử dụng minPrice vẫn hoạt động
const price = product.minPrice; // ✅ Still works!
```

Các field này được computed tự động trong `normalizeProduct()`.

---

## ✅ Testing Checklist

- [ ] Load danh sách products từ `/products` ✓
- [ ] Filter products theo brand ✓
- [ ] Search products với keyword ✓
- [ ] Click vào product → Chi tiết ✓
- [ ] Load variants của product ✓
- [ ] Chọn variant khác → Load specs mới ✓
- [ ] Xem tab "Thông số kỹ thuật" → Hiển thị đầy đủ ✓
- [ ] Giá hiển thị đúng (priceSale vs priceList) ✓
- [ ] Discount badge hiển thị đúng ✓
- [ ] Images parse đúng từ JSON string ✓

---

## 🎯 Summary

**Hoàn thành 100% tích hợp Product API với microservice architecture:**

✅ Products API - GET all, by ID, by slug, search
✅ Variants API - GET by product ID, search by SKU  
✅ Variant Specs API - GET specs by variant ID
✅ UI Components - Hiển thị đầy đủ thông tin
✅ Data Normalization - Parse & compute fields
✅ Backward Compatibility - Code cũ vẫn chạy
✅ Performance - Lazy load specs, cache parsed data

**API Microservices Ready! 🚀**

