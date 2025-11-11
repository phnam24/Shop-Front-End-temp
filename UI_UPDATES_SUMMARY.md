# 🎨 Cập Nhật UI - ProductCard & Specs Display

## 📊 Tổng Quan

Đã cập nhật giao diện **ProductCard** và phần hiển thị **Thông số kỹ thuật** theo thiết kế mới.

---

## 1. 🎴 ProductCard - Design Mới

### Thay Đổi Chính:

#### ❌ Cũ:
- Rating stars nổi bật
- Specs dạng pills/badges
- Button "Thêm vào giỏ" có icon
- Font chữ đậm cho tên sản phẩm

#### ✅ Mới (Theo design DELL):

```
┌─────────────────────────────┐
│     [Product Image]         │
│                             │
├─────────────────────────────┤
│ DELL                  ♡     │ ← Brand (uppercase, clickable)
├─────────────────────────────┤
│ Laptop Dell Pro 14 Plus ... │ ← Tên SP (font medium, line-clamp-2)
├─────────────────────────────┤
│ COMBO GIẢM ~ 1.000.000₫    │ ← Badge giảm giá
├─────────────────────────────┤
│ 29.990.000₫                 │ ← Giá bán (đỏ, bold)
│ U5-235U                     │ ← Giá gốc (gạch ngang)
├─────────────────────────────┤
│ 🖥️ Intel Graphics           │ ← Specs với icons
│ 💾 16GB • 512GB             │
│ 🎮 IPS/ 60Hz                │
├─────────────────────────────┤
│    [Thêm vào giỏ]          │ ← Button đơn giản
└─────────────────────────────┘
```

### Chi Tiết Cập Nhật:

#### 1. **Brand Name**
```tsx
// Cũ
<span className="text-xs text-primary-700 font-bold uppercase">
  {product.brand?.name}
</span>

// Mới - Clickable + hover effect
<Link to={`/products/${product.slug}`}>
  <span className="text-xs text-primary-700 font-bold uppercase hover:text-primary-900">
    {product.brand?.name}
  </span>
</Link>
```

#### 2. **Product Name**
```tsx
// Cũ - Font đậm
font-bold text-sm md:text-base min-h-[3rem]

// Mới - Font medium, spacing tốt hơn
font-medium text-sm leading-relaxed min-h-[2.5rem]
```

#### 3. **Discount Badge**
```tsx
// Cũ - Không có
// Mới - Hiển thị số tiền tiết kiệm
{discountPercent > 0 && (
  <div className="inline-flex items-center gap-2 bg-red-50 px-2 py-1 rounded">
    <span className="text-xs font-bold text-red-600">
      COMBO GIẢM ~ {formatPrice(maxPrice - minPrice)}
    </span>
  </div>
)}
```

#### 4. **Price Display**
```tsx
// Cũ - Màu primary
text-primary-900

// Mới - Màu đỏ nổi bật
text-red-600
```

#### 5. **Specs với Icons**
```tsx
// Cũ - Dạng pills/badges
<span className="px-2 py-1 bg-gray-100 rounded">
  Intel Core i7
</span>

// Mới - Dạng list với icons
<div className="space-y-1.5 text-xs">
  <div className="flex items-center gap-2">
    <span>🖥️</span>
    <span>{cpuModel}</span>
  </div>
  <div className="flex items-center gap-2">
    <span>💾</span>
    <span>{ramGb}GB • {storageGb}GB</span>
  </div>
  <div className="flex items-center gap-2">
    <span>🎮</span>
    <span>{gpuModel}</span>
  </div>
</div>
```

#### 6. **Add to Cart Button**
```tsx
// Cũ - Có icon shopping cart
<ShoppingCart className="w-4 h-4 mr-2" />

// Mới - Button đơn giản, clean
className="btn bg-primary-600 hover:bg-primary-700 text-white w-full text-sm font-medium py-2.5 rounded-lg"
```

---

## 2. 📋 Thông Số Kỹ Thuật - Cấu Trúc Mới

### Layout Mới:

```
┌─ THÔNG TIN CƠ BẢN ──────────────────────┐
│                                          │
│ Nhu cầu:           Gaming                │
│ Thương hiệu:       Acer                  │
│ Series model:      Acer Aspire           │
│ Tên:               Gaming Aspire 7...    │
│ Màu sắc:           Đen                   │
│ Bảo hành:          24 tháng              │
│ Mô tả bảo hành:    Bảo hành Pin 12 tháng│
│ Part-number:       NH.QMFSV.002          │
│ Trong hộp có gì:   Adapter, dây nguồn   │
│ SKU:               230703419             │
│ Còn lại:           0 sản phẩm            │
│                                          │
└──────────────────────────────────────────┘

┌─ THÔNG SỐ KỸ THUẬT CHI TIẾT ────────────┐
│                                          │
│ CPU:               Intel Core i5-12450H  │
│ Chip đồ họa:       GeForce RTX 3050     │
│ Màn hình:          15.6" FHD IPS 144Hz  │
│ Webcam:            HD webcam             │
│ Ram:               2 x 8GB DDR4 3200MHz  │
│ Lưu trữ:           512GB SSD M.2 NVMe    │
│ Cổng kết nối:      3xUSB, 1xHDMI...    │
│ Kết nối không dây:  WiFi 6, Bluetooth   │
│ Bàn phím:          LED RGB               │
│ Hệ điều hành:      Windows 11 Home       │
│ Kích thước:        362x237x19.9 mm      │
│ Pin:               3 cell 50 Wh          │
│ Khối lượng:        2.1 kg                │
│ Chất liệu:         Nhôm                  │
│ Bảo mật:           Vân tay               │
│ Âm thanh:          TrueHarmony           │
│ Đèn LED:           không đèn             │
│                                          │
└──────────────────────────────────────────┘
```

### Code Implementation:

#### Section 1: Thông Tin Cơ Bản
```typescript
const basicSpecs = variantSpecs.filter(spec => 
  [
    'Nhu cầu',          // ← ĐÃ CHUYỂN LÊN
    'Thương hiệu',
    'Series model',
    'Tên',
    'Màu sắc',
    'Bảo hành',
    'Mô tả bảo hành',
    'Part-number',
    'Trong hộp có gì'
  ].includes(spec.attributeLabel)
);

// Thêm info từ variant
const variantBasics = [
  { label: 'SKU', value: selectedVariant.sku },
  { label: 'Còn lại', value: `${selectedVariant.stock} sản phẩm` },
];
```

#### Section 2: Thông Số Chi Tiết (Filtered)
```typescript
// CHỈ hiển thị những mục này (theo thứ tự)
const allowedSpecs = [
  'CPU',
  'NPU',
  'Chip đồ họa',
  'Card đồ hoạ',
  'Màn hình',
  'Webcam',
  'Ram',
  'Lưu trữ',
  'Cổng kết nối',
  'Kết nối không dây',
  'Bàn phím',
  'Hệ điều hành',
  'Kích thước',
  'Pin',
  'Khối lượng',
  'Chất liệu',
  'Bảo mật',
  'Âm thanh',
  'Đèn LED trên máy',
];

// Lọc và sắp xếp
const filteredSpecs = allowedSpecs
  .map(label => variantSpecs.find(spec => spec.attributeLabel === label))
  .filter(spec => spec !== undefined);
```

### Styling:

```tsx
// Headers với border
<h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-primary-600">
  Thông tin cơ bản
</h3>

// Spec rows
<div className="flex justify-between py-3 border-b border-gray-100">
  <span className="font-semibold text-gray-700 min-w-[120px]">
    {spec.attributeLabel}
  </span>
  <span 
    className="text-gray-600 text-right flex-1 ml-4"
    dangerouslySetInnerHTML={{ __html: spec.value }}
  />
</div>
```

---

## 3. 🎯 Specs Filtering Logic

### Tại Sao Cần Filter?

API trả về **RẤT NHIỀU** specs (25+ items), nhưng chỉ cần hiển thị những thông tin quan trọng nhất.

### Ví dụ API Response:
```json
{
  "result": [
    {"attributeLabel": "Ram", "value": "16GB"},
    {"attributeLabel": "Tên", "value": "Gaming Aspire 7"},
    {"attributeLabel": "Nhu cầu", "value": "Gaming"},
    {"attributeLabel": "Thương hiệu", "value": "Acer"},
    {"attributeLabel": "CPU", "value": "Intel Core i5"},
    {"attributeLabel": "Webcam", "value": "HD"},
    {"attributeLabel": "Pin", "value": "50Wh"},
    // ... 18 items khác
  ]
}
```

### Sau khi filter:

**Thông tin cơ bản (9 items):**
- Nhu cầu, Thương hiệu, Series, Tên, Màu sắc, Bảo hành, Part-number, SKU, Còn lại

**Thông số chi tiết (19 items max):**
- CPU, NPU, Chip đồ họa, Card đồ hoạ, Màn hình, Webcam, Ram, Lưu trữ, Cổng kết nối, Kết nối không dây, Bàn phím, Hệ điều hành, Kích thước, Pin, Khối lượng, Chất liệu, Bảo mật, Âm thanh, Đèn LED

**Items bị loại bỏ:**
- Các thông số không thuộc 2 danh sách trên

---

## 4. 📱 Responsive Design

### ProductCard:
```tsx
// Responsive text sizes
text-sm md:text-base           // Product name
text-xl md:text-2xl            // Price
w-3 h-3 md:w-4 md:h-4         // Stars

// Grid layout (tự động responsive với Tailwind)
grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
```

### Specs Display:
```tsx
// 2 columns trên desktop, 1 column trên mobile
grid-cols-1 md:grid-cols-2 gap-4
```

---

## 5. 🎨 Color Scheme

### ProductCard:
- **Brand**: `text-primary-700` (blue)
- **Product Name**: `text-gray-900` (dark)
- **Price**: `text-red-600` (red - nổi bật)
- **Discount Badge**: `bg-red-50 text-red-600`
- **Specs**: `text-gray-600`
- **Button**: `bg-primary-600 hover:bg-primary-700`

### Specs Display:
- **Headers**: `text-gray-900 border-primary-600`
- **Labels**: `text-gray-700 font-semibold`
- **Values**: `text-gray-600`
- **Borders**: `border-gray-100`

---

## 6. ✨ Hover Effects

### ProductCard:
```tsx
// Image zoom
group-hover:scale-110

// Card lift
hover:-translate-y-2

// Shadow enhancement
hover:shadow-2xl

// Border highlight
hover:border-primary-300

// Brand color change
hover:text-primary-900
```

---

## 7. 📦 Data Flow

### ProductCard:
```
product.brand.name          → DELL
product.name                → Laptop Dell Pro...
product.minPrice            → 29.990.000₫
product.maxPrice            → 30.990.000₫
product.discountPercent     → 3%
product.variants[0].cpuModel → Intel Graphics
product.variants[0].ramGb    → 16GB
product.variants[0].storageGb → 512GB
product.variants[0].gpuModel  → Intel Iris
```

### Specs Display:
```
variantSpecs[]              → Array from API
  ↓
Filter by attributeLabel    → Split to 2 sections
  ↓
Section 1: Basic Info       → Nhu cầu, Thương hiệu, etc.
Section 2: Detailed Specs   → CPU, RAM, Màn hình, etc.
  ↓
Render with dangerouslySetInnerHTML (support HTML in value)
```

---

## 8. 🔧 Files Modified

| File | Changes |
|------|---------|
| `ProductCard.tsx` | ✅ New layout design |
| | ✅ Price in red color |
| | ✅ Discount badge with amount |
| | ✅ Specs with icons |
| | ✅ Simplified button |
| `ProductDetailPage.tsx` | ✅ Split specs into 2 sections |
| | ✅ Filter specs by allowedSpecs list |
| | ✅ Move "Nhu cầu" to basic info |
| | ✅ Add SKU, Stock to basic info |
| | ✅ Sort specs by predefined order |

---

## 9. ✅ Features

### ProductCard:
- ✅ Clean, modern design
- ✅ Prominent pricing display
- ✅ Clear discount indication
- ✅ Icon-based specs preview
- ✅ Responsive layout
- ✅ Smooth hover effects
- ✅ Clickable brand name

### Specs Display:
- ✅ 2 clear sections
- ✅ Basic info prioritized
- ✅ Filtered technical specs
- ✅ Ordered display (CPU first, LED last)
- ✅ HTML support in values
- ✅ Clean typography
- ✅ Responsive 2-column layout

---

## 10. 📊 Before & After Comparison

### ProductCard Price Display:

**Before:**
```
27.990.000₫  30.000.000₫
[primary]    [gray-400]
```

**After:**
```
COMBO GIẢM ~ 1.000.000₫
[red badge]

29.990.000₫
[red-600, bold]

30.000.000₫
[gray-500, strikethrough]
```

### Specs Display:

**Before:**
- Single section with all 25+ specs
- No ordering
- Mixed basic + technical info

**After:**
- **Section 1**: Basic Info (9 items)
  - Includes "Nhu cầu" moved from technical
- **Section 2**: Technical Specs (19 items max)
  - Only important specs
  - Ordered by importance

---

## 🎉 Summary

✅ **ProductCard** - Design mới giống DELL, clean và professional
✅ **Specs Display** - Structured với 2 sections rõ ràng
✅ **Filtering** - Chỉ hiển thị 19 specs quan trọng nhất
✅ **Ordering** - Specs được sắp xếp theo thứ tự logic
✅ **Responsive** - Hoạt động tốt trên mọi màn hình
✅ **Performance** - Không ảnh hưởng tốc độ load

**UI đã được cập nhật hoàn chỉnh! 🚀**

