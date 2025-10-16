# 🧪 TESTING GUIDE - E-COMMERCE PLATFORM

**Dev Server:** `http://localhost:5173`

**Mock Mode:** Enabled (no backend required)

---

## 🎯 TEST SCENARIOS - STEP BY STEP

### ✅ SETUP

1. **Ensure `.env` exists:**
```env
VITE_API_URL=http://localhost:8080
VITE_USE_MOCK_DATA=true
```

2. **Dev server running:**
```bash
npm run dev
```

3. **Open browser:**
```
http://localhost:5173
```

---

## 📝 TEST CHECKLIST

### 🏠 **PHASE 1: HOMEPAGE & NAVIGATION**

#### Test 1.1: Homepage Load
```
✅ Navigate to: http://localhost:5173
✅ Check: Hero section với slogan
✅ Check: Featured products hiển thị
✅ Check: Category cards (Laptops, Smartphones)
✅ Check: Smooth animations (fade-in, slide-up)
✅ Check: Footer links
```

#### Test 1.2: Header Navigation
```
✅ Check: Logo clickable → home
✅ Check: Search bar visible
✅ Check: Cart icon (badge = 0)
✅ Check: User icon (Đăng nhập button)
✅ Check: Mega menu on hover (Laptop, Điện thoại)
```

---

### 🔐 **PHASE 2: AUTHENTICATION**

#### Test 2.1: Register New Account
```
1. Click "Đăng nhập" → Chuyển tab "Đăng ký"
2. Fill form:
   - Họ: "Nguyễn"
   - Tên: "Văn A"
   - Username: "testuser123"
   - Password: "Test@123"
   - Confirm Password: "Test@123"
3. Click "Đăng ký"
4. ✅ Success modal appears
5. ✅ Auto-login sau 2s
6. ✅ Redirect to homepage
7. ✅ Header shows user avatar với "Nguyễn Văn A"
```

**Expected:**
- ✅ Form validation works (required fields)
- ✅ Password strength indicator shows
- ✅ Username availability check (mock)
- ✅ Success modal with confetti animation

#### Test 2.2: Login
```
1. Logout nếu đang login
2. Click "Đăng nhập"
3. Enter any username/password (mock accepts all)
4. Click "Đăng nhập"
5. ✅ Login successful
6. ✅ Token saved to localStorage
7. ✅ User info in header
```

#### Test 2.3: Forgot Password
```
1. From login page → Click "Quên mật khẩu?"
2. Enter email: test@example.com
3. Click "Gửi yêu cầu"
4. ✅ Success message appears
5. ✅ Mock email sent notification
```

---

### 👤 **PHASE 3: PROFILE MANAGEMENT**

#### Test 3.1: View Profile
```
1. Login first
2. Click user avatar → Dropdown appears
3. Click "Tài khoản của tôi"
4. ✅ Navigate to: http://localhost:5173/profile
5. ✅ See 4 tabs: Thông tin cá nhân, Địa chỉ, Đơn hàng, Mật khẩu
6. ✅ Default tab: Thông tin cá nhân
```

#### Test 3.2: Edit Profile Info
```
1. In "Thông tin cá nhân" tab
2. Click "Chỉnh sửa"
3. Update fields:
   - Email: youremail@gmail.com
   - Phone: 0901234567
   - DOB: 1990-01-01
4. Click "Lưu thay đổi"
5. ✅ Toast success notification
6. ✅ Info updated immediately
```

#### Test 3.3: Address Management
```
1. Click "Địa chỉ của tôi" tab
2. ✅ See 3 mock addresses (1 is default)
3. Click "Thêm địa chỉ mới"
4. Fill form:
   - Họ và tên: "Nguyễn Văn B"
   - SĐT: "0912345678"
   - Địa chỉ: "123 Nguyễn Huệ"
   - Phường: "Phường 1"
   - Quận: "Quận 1"
   - Tỉnh/TP: "TP. Hồ Chí Minh"
5. Click "Lưu địa chỉ"
6. ✅ New address appears in list
7. ✅ Toast success

Test Edit:
8. Click "Chỉnh sửa" on any address
9. Update phone number
10. Click "Lưu"
11. ✅ Updated successfully

Test Delete:
12. Click "Xóa" on any address
13. ✅ Confirmation modal appears
14. Click "Xóa"
15. ✅ Address removed
16. ✅ Toast success

Test Set Default:
17. Click "Đặt mặc định" on any address
18. ✅ Badge "Mặc định" appears
19. ✅ Previous default badge removed
```

#### Test 3.4: Change Password
```
1. Click "Đổi mật khẩu" tab
2. Fill form:
   - Mật khẩu hiện tại: "Test@123"
   - Mật khẩu mới: "NewPass@123"
   - Xác nhận: "NewPass@123"
3. ✅ Password strength indicator shows "Rất mạnh"
4. Click "Đổi mật khẩu"
5. ✅ Success toast
6. ✅ Auto logout sau 3s
7. ✅ Redirect to login page
```

---

### 🛍️ **PHASE 4: PRODUCT BROWSING**

#### Test 4.1: Browse Products
```
1. Navigate to: http://localhost:5173/products
2. ✅ See grid of products (8+ items)
3. ✅ Filters sidebar visible
4. ✅ Sort dropdown (Mới nhất, Giá thấp → cao, etc.)
```

#### Test 4.2: Product Filters
```
1. Select Category: "Laptop"
2. ✅ Products filtered
3. Select Brand: "Apple"
4. ✅ Further filtered
5. Set Price range: 20M - 50M
6. ✅ Matching products only
7. Click "Xóa bộ lọc"
8. ✅ All filters reset
```

#### Test 4.3: Product Detail Page
```
1. Click any product card
2. ✅ Navigate to: /products/[slug]
3. ✅ Product gallery (main + thumbnails)
4. ✅ Product name, price, rating
5. ✅ Variants selection (Color, RAM, Storage)
6. ✅ Stock status visible
7. ✅ Add to cart button
8. ✅ Wishlist heart icon (top right)
9. ✅ 3 tabs: Mô tả, Thông số kỹ thuật, Đánh giá
```

#### Test 4.4: Product Variants
```
1. On product detail page
2. Select Color: "Xanh dương"
3. ✅ Price updates if different
4. Select RAM: "16GB"
5. ✅ Price updates again
6. Select Storage: "512GB"
7. ✅ Final price shown
8. ✅ Selected variant info displayed
9. ✅ Stock status updates
```

---

### ⭐ **PHASE 5: REVIEWS & RATING**

#### Test 5.1: View Reviews
```
1. On product detail page
2. Click "Đánh giá" tab
3. ✅ Rating summary card:
   - Average rating (e.g., 4.7)
   - Total reviews (e.g., 7)
   - Star distribution bars
4. ✅ Reviews list below
5. ✅ Each review shows:
   - User avatar & name
   - Rating stars
   - Verified badge
   - Review title & comment
   - Review images (if any)
   - Helpful count
```

#### Test 5.2: Filter & Sort Reviews
```
1. Click "5 sao" filter button
2. ✅ Only 5-star reviews shown
3. Click again to remove filter
4. Change sort to "Hữu ích nhất"
5. ✅ Reviews reordered by helpful count
6. Click "Xóa bộ lọc"
7. ✅ Back to all reviews
```

#### Test 5.3: Write a Review
```
1. Click "Viết đánh giá" button
2. ✅ Review form appears
3. Click stars: 5 stars
4. ✅ "Rất tốt" label shows
5. Fill:
   - Tiêu đề: "Sản phẩm tuyệt vời!"
   - Nội dung: "Tôi rất hài lòng với sản phẩm này..."
6. (Optional) Click "Thêm ảnh" to upload
7. Click "Gửi đánh giá"
8. ✅ Success modal với checkmark
9. ✅ Toast notification
10. ✅ Form closes after 2s
11. ✅ New review appears (mock creates it)
```

#### Test 5.4: Mark Review Helpful
```
1. On any review, click "Hữu ích (24)"
2. ✅ Count increases to 25
3. ✅ Toast "Cảm ơn bạn đã đánh giá hữu ích!"
```

---

### 💖 **PHASE 6: WISHLIST**

#### Test 6.1: Add to Wishlist
```
1. On any product card or detail page
2. Click heart icon (empty)
3. ✅ Heart fills với red color
4. ✅ Toast "Đã thêm vào danh sách yêu thích"
5. ✅ Animation smooth
```

#### Test 6.2: View Wishlist Page
```
1. Navigate to: http://localhost:5173/wishlist
2. ✅ See 2 pre-added items (MacBook, iPhone)
3. ✅ Plus any items you just added
4. ✅ Grid layout responsive
5. ✅ Each card shows:
   - Product image
   - Name, brand
   - Rating
   - Price (with discount if any)
   - Heart icon (filled)
   - "Thêm vào giỏ" button
```

#### Test 6.3: Manage Wishlist
```
Test Remove:
1. Click filled heart on any product
2. ✅ Heart empties
3. ✅ Product removed from wishlist
4. ✅ Toast "Đã xóa khỏi danh sách yêu thích"

Test Add to Cart:
5. Click "Thêm vào giỏ" on wishlist item
6. ✅ Toast "Đã thêm vào giỏ hàng"
7. ✅ Cart badge increments

Test Clear All:
8. Click "Xóa tất cả" (desktop) or bottom button (mobile)
9. ✅ Confirmation modal appears
10. Click "Xóa tất cả"
11. ✅ All items removed
12. ✅ Empty state shows
```

---

### 🛒 **PHASE 7: SHOPPING CART**

#### Test 7.1: Add to Cart
```
1. On product detail page
2. Select quantity: 2
3. Click "Thêm vào giỏ hàng"
4. ✅ Toast "Đã thêm vào giỏ hàng"
5. ✅ Cart badge in header = 2
```

#### Test 7.2: View Cart
```
1. Click cart icon in header
2. ✅ Navigate to: http://localhost:5173/cart
3. ✅ See 3 pre-filled mock items:
   - Dell XPS 13 Plus
   - Samsung Galaxy S24 Ultra (x2)
   - MacBook Pro 14" M3 Pro
4. ✅ Plus your added item
```

#### Test 7.3: Update Cart Items
```
Test Quantity:
1. Click "+" on any item
2. ✅ Quantity increases
3. ✅ Subtotal updates
4. ✅ Total updates
5. Click "-" to decrease
6. ✅ Works smoothly

Test Remove:
7. Click "Xóa" on any item
8. ✅ Confirmation overlay
9. Click "Xóa"
10. ✅ Item removed
11. ✅ Totals recalculated
```

#### Test 7.4: Apply Discount Code
```
1. In cart page, find discount input
2. Enter: "WELCOME10"
3. Click "Áp dụng"
4. ✅ Toast "Mã giảm giá đã được áp dụng!"
5. ✅ Discount row appears: "-2,000,000đ" (10%, max 2M)
6. ✅ Total updates

Try other codes:
- FLASH20 (20% off, max 5M)
- VIP50 (50% off, max 10M)

Test Invalid Code:
7. Enter: "INVALID123"
8. Click "Áp dụng"
9. ✅ Error toast "Mã giảm giá không hợp lệ"

Remove Code:
10. Click "Xóa mã" (X button)
11. ✅ Discount removed
12. ✅ Total back to original
```

---

### 💳 **PHASE 8: CHECKOUT FLOW**

#### Test 8.1: Start Checkout
```
1. In cart page, click "Tiến hành thanh toán"
2. ✅ Navigate to: http://localhost:5173/checkout
3. ✅ Protected route (must be logged in)
4. ✅ Stepper shows: Step 1/3 active
5. ✅ Sticky order summary on right
```

#### Test 8.2: Step 1 - Address Selection
```
1. ✅ See list of saved addresses (3 mock)
2. ✅ Default address pre-selected (highlighted)
3. Click another address
4. ✅ Selection changes

Test Add New Address:
5. Click "Thêm mới"
6. ✅ Inline form appears (not modal)
7. Fill all fields
8. Click "Lưu địa chỉ"
9. ✅ New address added to list
10. ✅ Auto-selected
11. Click "Tiếp tục"
12. ✅ Move to Step 2
```

#### Test 8.3: Step 2 - Payment Method
```
1. ✅ See 3 payment options:
   - COD (Thanh toán khi nhận hàng)
   - VNPay
   - MoMo
2. Click each option
3. ✅ Selection highlights
4. ✅ Radio button checked
5. Select "COD"
6. Click "Tiếp tục"
7. ✅ Move to Step 3
```

#### Test 8.4: Step 3 - Review Order
```
1. ✅ See summary cards:
   - Địa chỉ giao hàng (with "Thay đổi" link)
   - Phương thức thanh toán (with "Thay đổi" link)
   - Sản phẩm (list all items)
2. ✅ Order note textarea (optional)
3. Type note: "Giao hàng giờ hành chính"
4. ✅ Sticky summary shows correct total

Test Edit:
5. Click "Thay đổi" on address
6. ✅ Back to Step 1
7. Click "Tiếp tục" twice to return
8. ✅ All info preserved

Place Order:
9. Click "Đặt hàng"
10. ✅ Loading spinner
11. ✅ Toast "Đặt hàng thành công!"
12. ✅ Cart cleared
13. ✅ Navigate to order success page
```

---

### ✅ **PHASE 9: ORDER SUCCESS & TRACKING**

#### Test 9.1: Order Success Page
```
1. After checkout complete
2. ✅ URL: http://localhost:5173/orders/[id]/success
3. ✅ See:
   - Green checkmark animation
   - "Đặt hàng thành công!" heading
   - Order code (e.g., ORD-20241012-0001)
   - Order status badge
   - Created date
   - Payment method
   - Shipping address card
   - All order items with prices
   - Order summary (subtotal, shipping, discount, total)
4. ✅ Note shown if entered
5. Click "Xem chi tiết đơn hàng"
6. ✅ Navigate to order detail
```

#### Test 9.2: Order Detail Page
```
1. ✅ URL: http://localhost:5173/orders/[id]
2. ✅ Breadcrumb: Home > Đơn hàng > [Order Code]
3. ✅ Header: Order code + Status badge
4. ✅ Left column:
   - Order timeline (if any)
   - Order items list
   - Order note
5. ✅ Right sidebar (sticky):
   - Order summary
   - Shipping address
   - Payment method
6. ✅ "Hủy đơn hàng" button (if status allows)
```

#### Test 9.3: Cancel Order
```
1. If status = PENDING or CONFIRMED
2. Click "Hủy đơn hàng"
3. ✅ Modal appears
4. ✅ Warning message
5. Type reason: "Đặt nhầm địa chỉ"
6. Click "Xác nhận hủy"
7. ✅ Loading state
8. ✅ Order status → CANCELLED
9. ✅ "Hủy đơn hàng" button disappears
10. ✅ Toast success
```

#### Test 9.4: View Order History
```
1. Navigate to: http://localhost:5173/profile?tab=orders
2. ✅ See "Đơn hàng của tôi" tab
3. ✅ Mock: 3 historical orders
4. ✅ Plus any orders you just created
5. Click any order
6. ✅ Navigate to order detail
```

---

### 🔍 **PHASE 10: SEARCH & NAVIGATION**

#### Test 10.1: Search Products
```
1. In header search bar
2. Type: "macbook"
3. Press Enter
4. ✅ Navigate to products page with filter
5. ✅ Results show MacBook products
```

#### Test 10.2: Mega Menu Navigation
```
1. Hover over "Laptop" in header
2. ✅ Mega menu drops down (if implemented)
3. Click category
4. ✅ Navigate to filtered products
```

---

### 📱 **PHASE 11: RESPONSIVE DESIGN**

#### Test 11.1: Mobile View (< 768px)
```
Open DevTools → Toggle device toolbar → iPhone 12 Pro

1. ✅ Header: Hamburger menu appears
2. ✅ Search bar adapts
3. ✅ Product grid: 1-2 columns
4. ✅ Cart summary: Stacks vertically
5. ✅ Checkout stepper: Compact mode
6. ✅ Profile tabs: Vertical list
7. ✅ All buttons touch-friendly (44px min)
```

#### Test 11.2: Tablet View (768px - 1024px)
```
iPad Pro view

1. ✅ Product grid: 2-3 columns
2. ✅ Checkout: 2 columns
3. ✅ Profile: Sidebar + content
4. ✅ All features accessible
```

---

### 🎨 **PHASE 12: UI/UX ELEMENTS**

#### Test 12.1: Animations
```
1. Page load: ✅ Fade-in, slide-up
2. Modal open: ✅ Scale-in
3. Toast: ✅ Slide-in from right
4. Button hover: ✅ Scale, color change
5. Heart icon: ✅ Fill animation
6. Loading: ✅ Spin, pulse
```

#### Test 12.2: Toast Notifications
```
1. Perform any action (add to cart, etc.)
2. ✅ Toast appears bottom-right
3. ✅ Auto-dismiss after 5s
4. ✅ Can click X to close
5. ✅ Multiple toasts stack
```

#### Test 12.3: Loading States
```
1. Any async action
2. ✅ Spinner or skeleton loader
3. ✅ Button disabled during load
4. ✅ "Đang tải..." text
```

#### Test 12.4: Error Handling
```
1. Trigger an error (e.g., invalid input)
2. ✅ Error message shows
3. ✅ Red color scheme
4. ✅ Clear error text in Vietnamese
```

---

### 🔐 **PHASE 13: PROTECTED ROUTES**

#### Test 13.1: Access Protected Page (Not Logged In)
```
1. Logout if logged in
2. Navigate to: http://localhost:5173/profile
3. ✅ Auto-redirect to: /auth?mode=login
4. ✅ Toast: "Vui lòng đăng nhập"
```

#### Test 13.2: Access After Login
```
1. Login
2. Navigate to: http://localhost:5173/profile
3. ✅ Page loads successfully
4. ✅ User data displayed
```

---

### 🧹 **PHASE 14: EDGE CASES**

#### Test 14.1: Empty States
```
1. Clear cart → ✅ Empty cart UI with CTA
2. Clear wishlist → ✅ Empty wishlist UI
3. No orders → ✅ "Chưa có đơn hàng" (in profile)
4. No addresses → ✅ "Chưa có địa chỉ" with add button
```

#### Test 14.2: Form Validation
```
1. Submit any form with empty required fields
2. ✅ Validation errors show
3. ✅ Field borders turn red
4. ✅ Error message below field

Try invalid formats:
- Email: "invalid" → ✅ "Email không hợp lệ"
- Phone: "123" → ✅ "SĐT không hợp lệ"
- Password: "123" → ✅ "Mật khẩu phải có ít nhất 6 ký tự"
```

#### Test 14.3: Stock Validation
```
1. Try to add quantity > stock
2. ✅ Error or max at stock limit
3. Out of stock product
4. ✅ "Hết hàng" badge
5. ✅ Add to cart button disabled
```

---

## ✅ FINAL CHECKLIST

### Core Features:
- [ ] Homepage loads correctly
- [ ] User can register & login
- [ ] Profile management works
- [ ] Address CRUD functional
- [ ] Change password works
- [ ] Products browse & filter
- [ ] Product detail complete
- [ ] Reviews system working
- [ ] Wishlist add/remove
- [ ] Cart operations smooth
- [ ] Discount codes apply
- [ ] Checkout 3-step flow
- [ ] Order created successfully
- [ ] Order tracking visible
- [ ] Protected routes work

### UI/UX:
- [ ] All animations smooth
- [ ] Toast notifications work
- [ ] Loading states present
- [ ] Error handling graceful
- [ ] Responsive mobile/tablet
- [ ] All buttons clickable
- [ ] Forms validate properly
- [ ] Vietnamese language correct

### Performance:
- [ ] Page loads < 3s
- [ ] No console errors
- [ ] Smooth scrolling
- [ ] Images load properly
- [ ] No layout shifts

---

## 🐛 KNOWN ISSUES (Optional Features Pending)

1. **Advanced Search** - Basic search works, autocomplete pending
2. **Notifications** - System not yet implemented
3. **Product Comparison** - Not implemented
4. **Live Chat** - Not implemented

---

## 🎯 SUCCESS CRITERIA

**TEST PASSED IF:**
- ✅ All 14 phases completed
- ✅ No critical bugs
- ✅ All core features functional
- ✅ UI/UX smooth & responsive
- ✅ Mock data works correctly
- ✅ Ready for backend integration

---

## 📞 SUPPORT

**If you encounter issues:**

1. Check browser console for errors
2. Verify `.env` has `VITE_USE_MOCK_DATA=true`
3. Clear browser cache & localStorage
4. Restart dev server
5. Check this guide for expected behavior

**Happy Testing! 🚀**

