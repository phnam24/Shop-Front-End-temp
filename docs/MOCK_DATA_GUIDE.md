# 🎭 Mock Data Guide - Development Mode

## Tổng Quan

Để phát triển frontend mà không phụ thuộc vào backend API, project đã được setup với **Mock Data System** hoàn chỉnh.

## 🔧 Setup

### 1. Tạo file `.env` trong root project:

```env
# API Configuration
VITE_API_URL=http://localhost:8080

# Mock Data Mode
# Set to 'true' to use mock data (for development without backend)
# Set to 'false' to use real API
VITE_USE_MOCK_DATA=true
```

### 2. Khởi động development server:

```bash
npm run dev
```

## 📦 Mock Data Available

### ✅ User Domain

**File:** `src/domains/user/services/mockUserData.ts`

#### Mock User Profile:
```typescript
{
  id: 'user-001',
  username: 'johndoe123',
  firstName: 'Nguyễn',
  lastName: 'Văn An',
  email: 'nguyenvanan@example.com',
  phone: '0912345678',
  dob: '1995-05-15',
  roles: ['USER']
}
```

#### Mock Addresses (3 addresses):
- Address 1: 123 Nguyễn Huệ, Quận 1 (Default)
- Address 2: 456 Lê Lợi, Quận 1
- Address 3: 789 Trần Hưng Đạo, Quận 1

**Supported Operations:**
- ✅ Get Profile
- ✅ Update Profile
- ✅ Get Addresses
- ✅ Create Address
- ✅ Update Address
- ✅ Delete Address
- ✅ Set Default Address
- ✅ Change Password

---

### ✅ Cart Domain

**File:** `src/domains/cart/services/mockCartData.ts`

#### Mock Cart Items (3 items):
1. **Dell XPS 13 Plus** - 16GB/512GB - Bạc - 32,990,000₫
2. **Samsung Galaxy S24 Ultra** - 12GB/256GB - Đen - 27,990,000₫ (x2)
3. **MacBook Pro 14" M3 Pro** - 18GB/512GB - Space Gray - 52,990,000₫

#### Mock Discount Codes:
- `WELCOME10`: Giảm 10%, tối đa 2,000,000₫
- `FLASH20`: Giảm 20%, tối đa 5,000,000₫
- `VIP50`: Giảm 50%, tối đa 10,000,000₫

**Supported Operations:**
- ✅ Get Cart
- ✅ Add Item
- ✅ Update Item Quantity
- ✅ Remove Item
- ✅ Clear Cart
- ✅ Apply Discount Code
- ✅ Remove Discount

**Business Logic:**
- Shipping: FREE if subtotal > 5,000,000₫, else 50,000₫
- Auto-increment quantity if same product+variant added
- Stock validation

---

### ✅ Order Domain

**File:** `src/domains/order/services/mockOrderData.ts`

#### Mock Orders (3 orders):

**Order 1:** ORD-20241010-001
- Status: SHIPPING
- Payment: COD (Pending)
- Items: Dell XPS 13 Plus
- Total: 29,691,000₫ (with WELCOME10)

**Order 2:** ORD-20241005-045
- Status: DELIVERED
- Payment: VNPAY (Paid)
- Items: Samsung Galaxy S24 Ultra (x2)
- Total: 55,980,000₫

**Order 3:** ORD-20240928-122
- Status: DELIVERED
- Payment: MOMO (Paid)
- Items: MacBook Pro 14" M3 Pro
- Total: 42,392,000₫ (with FLASH20)

**Supported Operations:**
- ✅ Get Orders (with pagination)
- ✅ Get Order by ID
- ✅ Get Order by Code
- ✅ Create Order
- ✅ Cancel Order

**Order Status Flow:**
```
PENDING → CONFIRMED → PROCESSING → SHIPPING → DELIVERED
                                      ↓
                                  CANCELLED
```

---

## 🧪 Test Scenarios

### 1. User Profile Flow

```typescript
// Login (mock credentials)
username: 'johndoe123'
password: 'any-password-works'

// Navigate to /profile
// ✓ View profile info
// ✓ Edit profile (firstName, lastName, email, phone, dob)
// ✓ View 3 addresses
// ✓ Add new address
// ✓ Set default address
// ✓ Delete non-default address
// ✓ Change password
```

### 2. Shopping Cart Flow

```typescript
// Navigate to /cart
// ✓ View 3 cart items
// ✓ Update quantities
// ✓ Remove items
// ✓ Apply discount code: WELCOME10, FLASH20, VIP50
// ✓ Remove discount
// ✓ Clear entire cart
// ✓ See shipping calculation (FREE if > 5M)
```

### 3. Order History Flow

```typescript
// Navigate to /profile → Orders tab
// ✓ View 3 historical orders
// ✓ See order status & timeline
// ✓ View order details
// ✓ Cancel pending orders
```

---

## 🔄 Switching Between Mock & Real API

### Development với Mock Data:

```env
VITE_USE_MOCK_DATA=true
```

**Pros:**
- ✅ Không cần backend running
- ✅ Instant responses (no network delay)
- ✅ Consistent test data
- ✅ Easy debugging

### Production / Testing với Real API:

```env
VITE_USE_MOCK_DATA=false
VITE_API_URL=http://localhost:8080
```

**Pros:**
- ✅ Test real backend integration
- ✅ Validate API contracts
- ✅ Test error handling
- ✅ Performance testing

---

## 🎯 Mock Data Features

### ✅ Network Delay Simulation

Tất cả mock services đều có `delay()` function để simulate network latency:

```typescript
// Trong mockCartData.ts
await delay(500);  // Simulate 500ms network delay
```

### ✅ Error Handling

Mock services throw proper errors:

```typescript
// Invalid discount code
throw new Error('Mã giảm giá không hợp lệ hoặc đã hết hạn');

// Out of stock
throw new Error('Chỉ còn 5 sản phẩm');

// Delete default address
throw new Error('Không thể xóa địa chỉ mặc định');
```

### ✅ State Persistence

Cart và Address state được persist trong mock để simulate real database:

```typescript
let cartItems: CartItem[] = [...initialCartItems];
let addressesData = [...mockAddresses];
```

### ✅ Business Logic

Mock data implements real business logic:

- **Cart:**
  - Auto-merge items with same product+variant
  - Stock validation
  - Discount calculation
  - Shipping calculation

- **Addresses:**
  - Only one default address
  - Cannot delete default address
  - Validate required fields

- **Orders:**
  - Order code generation
  - Status timeline
  - Payment status

---

## 📂 Files Structure

```
src/domains/
├── user/
│   └── services/
│       ├── userService.ts          # Real API calls
│       └── mockUserData.ts         # Mock data & logic
├── cart/
│   └── services/
│       ├── cartService.ts          # Switchable (mock/real)
│       └── mockCartData.ts         # Mock cart data
└── order/
    ├── types/
    │   └── index.ts                # Order types
    └── services/
        └── mockOrderData.ts        # Mock orders
```

---

## 🐛 Debugging

### Check which mode is active:

```typescript
// In browser console
console.log(import.meta.env.VITE_USE_MOCK_DATA);
// 'true' = mock mode
// 'false' = real API mode
```

### Reset mock data to initial state:

```typescript
import { resetMockCart } from './domains/cart/services/mockCartData';
import { resetMockOrders } from './domains/order/services/mockOrderData';

resetMockCart();
resetMockOrders();
```

---

## 🚀 Next Steps

1. **Test all mock flows** - Đảm bảo UI/UX hoạt động tốt với mock data
2. **Integrate real API** - Chuyển `VITE_USE_MOCK_DATA=false` và test với backend
3. **Handle edge cases** - Test error scenarios, loading states
4. **Optimize performance** - Remove mock delays nếu cần faster development

---

## 📝 Notes

- Mock data reset khi reload page (cart và orders giữ state trong session)
- Discount codes case-insensitive
- All timestamps in ISO 8601 format
- Currency format: VND (Vietnamese Dong)
- Mock authentication: any password works in mock mode

---

Happy Coding! 🎉

