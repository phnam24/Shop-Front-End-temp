<!-- 26941162-1e5c-4f07-93d3-6e284ed0c7d1 086ec789-a1c9-4b05-a929-38c2a0f3a310 -->
# Kế hoạch Phát triển E-Commerce Platform

## Tổng quan

Xây dựng nền tảng e-commerce hoàn chỉnh với 3 giai đoạn phát triển từng bước, dựa trên codebase hiện có đã có auth system và product foundation.

---

## 🎯 Giai đoạn 1: User System & Profile Management ✅ COMPLETED

**Mục tiêu:** Hoàn thiện hệ thống người dùng với profile, address và payment info management

### Tasks:

#### 1.1. Hoàn thiện Auth Flow ✅

- Kiểm tra và test lại LoginForm và RegisterForm với API backend
- Thêm forgot password page
- Thêm protected routes (PrivateRoute component)
- Implement auto-login khi có token trong localStorage

**Acceptance Criteria:** ✅ ALL PASSED

- User có thể đăng ký tài khoản mới và nhận được thông báo thành công
- User có thể đăng nhập và được redirect về trang trước đó
- Token được lưu và tự động attach vào API requests
- Protected routes redirect về /auth nếu chưa login

#### 1.2. Profile Management Page ✅

- Tạo `src/pages/ProfilePage.tsx` với tab navigation (Thông tin cá nhân, Địa chỉ, Đơn hàng, Mật khẩu)
- Tạo `src/domains/user/` domain structure
- Component `ProfileInfo.tsx` - hiển thị và edit thông tin cá nhân (firstName, lastName, email, phone, dob)
- API integration: GET/PUT `/users/my-info`

**Acceptance Criteria:** ✅ ALL PASSED

#### 1.3. Address Management ✅

- Component `AddressManager.tsx` - CRUD addresses
- API endpoints: GET/POST/PUT/DELETE `/users/addresses`
- Modal thêm/sửa địa chỉ với form validation
- Set default address
- UI hiển thị danh sách addresses dạng cards

**Acceptance Criteria:** ✅ ALL PASSED

#### 1.4. Change Password & Security ✅

- Component `ChangePassword.tsx` 
- API: PUT `/users/change-password`
- Form với current password, new password, confirm password
- Password strength indicator

**Acceptance Criteria:** ✅ ALL PASSED

#### 1.5. UI/UX Enhancement ✅

- Thêm loading skeletons cho profile page
- Toast notifications cho success/error actions
- Smooth animations khi chuyển tabs
- Mobile responsive design

---

## 🛒 Giai đoạn 2: Core Shopping Flow ✅ COMPLETED

**Mục tiêu:** Xây dựng flow mua hàng hoàn chỉnh từ xem sản phẩm → chọn variant → giỏ hàng → checkout → thanh toán

### Tasks:

#### 2.1. Product Detail Page Enhancement ✅

- Hoàn thiện `ProductDetailPage.tsx` với đầy đủ thông tin sản phẩm
- Gallery ảnh sản phẩm với zoom và preview (dùng Swiper)
- Section mô tả chi tiết, thông số kỹ thuật (dùng tabs)
- Breadcrumb navigation
- Related products carousel

**Acceptance Criteria:** ✅ ALL PASSED

#### 2.2. Product Variants Selection ✅

- Component `ProductVariants.tsx` - chọn màu, RAM, storage
- Real-time price update khi chọn variant
- Hiển thị stock status của từng variant
- Disabled variant hết hàng
- API: GET `/products/:slug/variants`

**Acceptance Criteria:** ✅ ALL PASSED

#### 2.3. Cart Domain & Shopping Cart ✅

- Tạo `src/domains/cart/` structure
- `cartStore.ts` - Zustand store quản lý cart state
- `cartService.ts` - API integration
- Cart items với variant info, quantity, price
- API: GET/POST/PUT/DELETE `/cart`

**Cart actions:** ✅ ALL IMPLEMENTED

#### 2.4. Cart Page ✅

- `src/pages/CartPage.tsx`
- Danh sách items với thumbnail, name, variant info, price, quantity controls
- Summary section: subtotal, shipping, discount, total
- Apply discount code
- "Tiếp tục mua sắm" và "Thanh toán" buttons
- Empty cart state

**Acceptance Criteria:** ✅ ALL PASSED

#### 2.5. Checkout Flow ✅

- `src/pages/CheckoutPage.tsx` - Multi-step form
- Step 1: Chọn địa chỉ giao hàng (từ addresses đã lưu hoặc thêm mới)
- Step 2: Chọn phương thức thanh toán
- Step 3: Review order và xác nhận
- Sticky order summary sidebar
- API: POST `/orders`

**Acceptance Criteria:** ✅ ALL PASSED

#### 2.6. Payment Integration ✅

- Component `PaymentMethods.tsx` - chọn payment gateway
- Mock integration: COD (Cash on Delivery), VNPay, MoMo
- Payment success/failure handling
- API: POST `/payments/:orderId/process`

**Acceptance Criteria:** ✅ ALL PASSED

#### 2.7. Order Success & Tracking ✅

- `src/pages/OrderSuccessPage.tsx` - hiển thị order info
- `src/pages/OrderDetailPage.tsx` - chi tiết order
- Order status tracking
- API: GET `/orders/:id`

**Acceptance Criteria:** ✅ ALL PASSED

---

## ⭐ Giai đoạn 3: Advanced Features ⏳ IN PROGRESS

**Mục tiêu:** Bổ sung các tính năng nâng cao để tăng trải nghiệm người dùng

### Tasks:

#### 3.1. Product Reviews & Rating

- Component `ProductReviews.tsx` - hiển thị reviews
- Component `ReviewForm.tsx` - viết review (chỉ cho user đã mua)
- Rating summary với star distribution
- Filter/sort reviews
- API: GET/POST `/products/:id/reviews`

**Acceptance Criteria:**

- Hiển thị reviews với rating, comment, images, author, date
- User đã mua có thể viết review và upload ảnh
- Review form validation
- Tính average rating và hiển thị distribution

#### 3.2. Wishlist/Favorites

- Tạo `src/domains/wishlist/` domain
- Add/remove from wishlist với heart icon
- `WishlistPage.tsx` - hiển thị danh sách yêu thích
- API: GET/POST/DELETE `/wishlist`

**Acceptance Criteria:**

- User có thể thêm/xóa products khỏi wishlist
- Heart icon toggle animation smooth
- Wishlist page hiển thị grid products
- Sync với backend

#### 3.3. Advanced Search & Filters

- Nâng cấp `ProductSearch.tsx` với autocomplete
- Search suggestions dựa trên history và popular keywords
- Quick filters (price range, brand) trong search dropdown
- Highlight search keywords trong results
- API: GET `/products/search?q=...`

**Acceptance Criteria:**

- Autocomplete hiển thị khi typing (debounced)
- Show search history (lưu localStorage)
- Highlight keywords trong product name
- Navigate to search results page khi submit

#### 3.4. Notifications System

- Component `NotificationCenter.tsx` - dropdown notifications
- Notification types: order updates, promotions, system
- Mark as read/unread
- API: GET/PUT `/notifications`

**Acceptance Criteria:**

- Bell icon ở header với badge số unread
- Dropdown hiển thị latest notifications
- Click notification navigate đến related page
- Mark all as read

#### 3.5. Discount/Promo Codes ✅ PARTIALLY DONE

- Validate discount codes trong cart/checkout
- Display applied discount clearly
- Promo banner trong homepage
- API: POST `/cart/apply-discount`

**Acceptance Criteria:**

- User nhập mã và nhận discount
- Hiển thị discount amount trong order summary
- Validate mã hợp lệ, còn hiệu lực
- Error message khi mã không hợp lệ

#### 3.6. Performance & UX Polish

- Implement lazy loading cho images
- Add skeleton loaders cho tất cả data fetching
- Optimize re-renders với React.memo
- Add error boundaries
- SEO optimization (meta tags, Open Graph)

**Files cần tạo/chỉnh sửa:**

- `src/domains/reviews/` - domain mới
- `src/domains/wishlist/` - domain mới
- `src/pages/WishlistPage.tsx`
- `src/domains/products/components/ProductSearch.tsx` (enhance)
- `src/shared/components/NotificationCenter.tsx`
- `src/domains/promotions/` - domain mới

---

## 📋 Technical Guidelines

### Domain Structure

```
src/domains/{domain}/
  ├── components/
  ├── hooks/
  ├── services/
  ├── store/
  └── types/
```

### API Base URL

- Development: `http://localhost:8080`
- Production: Sẽ config qua `VITE_API_URL` env variable

### State Management

- Local UI state: `useState`, `useReducer`
- Global app state: Zustand với persist middleware
- Server state: React Query (nếu cần optimize caching)

### Styling

- TailwindCSS classes
- Custom animations đã define trong `index.css`
- Component-scoped styles nếu cần đặc biệt

### Form Handling

- React Hook Form cho complex forms
- Zod cho schema validation (nếu cần)

### Testing (Optional cho các stages sau)

- Unit tests: Vitest
- Component tests: React Testing Library
- E2E tests: Playwright

---

## 🚀 Development Workflow

**Mỗi giai đoạn:**

1. **Planning** - Review tasks và acceptance criteria
2. **Implementation** - Code từng task theo thứ tự
3. **Testing** - Manual testing với backend API
4. **Review** - Kiểm tra UI/UX, responsive, performance
5. **Demo** - Show kết quả và nhận feedback trước khi sang stage tiếp

**Best Practices:**

- Commit thường xuyên với clear messages
- Test responsive trên mobile/tablet/desktop
- Validate tất cả user inputs
- Handle loading và error states
- Accessible UI (keyboard navigation, ARIA labels)
- Vietnamese language cho tất cả UI text

### To-dos

- [x] Hoàn thiện Auth Flow: test login/register, forgot password, protected routes, auto-login
- [x] Xây dựng Profile Management Page với tab navigation và ProfileInfo component
- [x] Implement Address Management: CRUD addresses, set default, validation
- [x] Xây dựng Change Password feature với password strength indicator
- [x] UI/UX enhancement cho User System: skeletons, toasts, animations
- [x] Hoàn thiện Product Detail Page: gallery, specs tabs, breadcrumb, related products
- [x] Implement Product Variants Selection với real-time price update
- [x] Tạo Cart Domain: store, service, types, cart operations (add/update/remove)
- [x] Xây dựng Cart Page: items list, quantity controls, discount code, summary
- [x] Implement Checkout Flow: multi-step form, address selection, order review
- [x] Payment Integration: payment methods selection, mock payment processing
- [x] Xây dựng Order Success và Order Tracking pages
- [ ] Implement Product Reviews & Rating system
- [ ] Xây dựng Wishlist/Favorites feature với API sync
- [ ] Nâng cấp Search với autocomplete, suggestions, và quick filters
- [ ] Xây dựng Notifications System với bell icon và dropdown
- [ ] Implement Discount/Promo Codes validation và display
- [ ] Performance & UX Polish: lazy loading, skeletons, optimization, SEO

