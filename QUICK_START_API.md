# ⚡ Quick Start - Tích Hợp API

## 🎯 Tóm Tắt
Đã hoàn thành chỉnh sửa toàn bộ source code để sử dụng API thực thay vì mock data.

## 🚀 Các Bước Để Chạy

### Bước 1: Cấu Hình API URL

File `.env.local` đã được tạo sẵn với nội dung:
```
VITE_API_URL=http://localhost:8083/api
```

### Bước 2: Khởi Động Backend API

Đảm bảo backend của bạn đang chạy tại: `http://localhost:8083`

### Bước 3: Restart Frontend Dev Server

**QUAN TRỌNG:** Bạn cần restart lại dev server để load environment variables mới:

```bash
# 1. Dừng server hiện tại (nhấn Ctrl+C trong terminal)
# 2. Chạy lại:
npm run dev
```

### Bước 4: Kiểm Tra

1. Mở browser và truy cập: `http://localhost:5173`
2. Mở DevTools (F12) → Console/Network tab
3. Kiểm tra API requests đang gọi đến đúng URL:
   - ✅ `http://localhost:8083/api/categories`
   - ✅ `http://localhost:8083/api/products`
   - ✅ `http://localhost:8083/api/variants/...`

## ✅ Những Gì Đã Được Thay Đổi

### 1. API Endpoints Đã Được Tích Hợp:

#### Categories:
- `GET /api/categories` - Lấy tất cả danh mục
- `GET /api/categories/search?name=keyword` - Tìm kiếm danh mục

#### Products:
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/search?name=keyword` - Tìm kiếm sản phẩm
- `GET /api/products/{id}` - Lấy chi tiết sản phẩm theo ID
- `GET /api/products/slug/{slug}` - Lấy chi tiết sản phẩm theo slug

#### Product Variants:
- `GET /api/variants/product/{productId}` - Lấy variants của product

#### Variant Specs:
- `GET /api/variant-specs/variant/{variantId}` - Lấy specs của variant

#### Brands:
- `GET /api/brands` - Lấy danh sách thương hiệu

### 2. Components Đã Được Cập Nhật:

✅ ProductsPage - Load products, categories, brands từ API  
✅ ProductDetailPage - Load product detail và variants từ API  
✅ ProductSearch - Search products qua API  
✅ ProductFilters - Load brands để filter từ API  
✅ MegaMenu - Load categories từ API  
✅ useProductDetail Hook - Load product và variants từ API  

### 3. Xử Lý Đặc Biệt:

**Parse Images từ JSON String:**
API trả về `images` dưới dạng chuỗi JSON. Code đã tự động parse:
```typescript
images: "[\"url1.jpg\", \"url2.jpg\"]" → ["url1.jpg", "url2.jpg"]
```

**Status Field:**
- API trả về: `status: true/false` (boolean)
- Code đã cập nhật type để xử lý đúng

## ⚠️ Lưu Ý Quan Trọng

### 1. Environment Variables
Vite chỉ load env vars khi **khởi động** dev server. Nếu bạn thay đổi `.env` hoặc `.env.local`, phải **restart** server.

### 2. CORS Configuration
Nếu gặp lỗi CORS, cần cấu hình backend để cho phép:
```
Access-Control-Allow-Origin: http://localhost:5173
```

### 3. Authentication
Token được tự động gửi trong header nếu user đã đăng nhập:
```
Authorization: Bearer <token>
```

## 🐛 Troubleshooting

### Vấn đề: API vẫn gọi đến URL sai (localhost:8888)
**Giải pháp:** Restart dev server sau khi tạo `.env.local`

### Vấn đề: Lỗi 404 Not Found
**Giải pháp:** 
1. Kiểm tra backend có đang chạy không
2. Kiểm tra endpoint URL có đúng không

### Vấn đề: Lỗi CORS
**Giải pháp:** Cấu hình CORS trên backend server

### Vấn đề: Images không hiển thị
**Giải pháp:** Kiểm tra API có trả về đúng format JSON string không

## 📝 File Tham Khảo Chi Tiết

Xem file `API_INTEGRATION_SUMMARY.md` để biết chi tiết đầy đủ về:
- Tất cả các thay đổi code
- Cấu trúc API đầy đủ
- Type definitions
- Testing checklist

## 🎉 Hoàn Thành

Sau khi restart dev server với `.env.local` đã được cấu hình, ứng dụng sẽ hoàn toàn sử dụng API thực!

**Happy Coding! 🚀**

