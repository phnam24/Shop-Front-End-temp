# 🔄 Refresh Token Implementation

## 📋 Tổng quan

Dự án đã được cập nhật để hỗ trợ **refresh token** với cơ chế **gộp chung access token và refresh token** thành một token duy nhất.

## 🏗️ Kiến trúc Refresh Token

### 🔑 Cơ chế Token
- **Login Response**: Trả về `token` (gộp access + refresh) và `authenticated: boolean`
- **Refresh Request**: Gửi `token` cũ trong request body
- **Refresh Response**: Trả về `token` mới (cũng gộp access + refresh) và `authenticated: boolean`

### 📡 API Endpoints
```
POST /identity/auth/token        # Login
POST /identity/auth/refresh      # Refresh token
POST /identity/auth/logout       # Logout
```

## 🔧 Implementation Details

### 1. Types (`src/domains/auth/types/index.ts`)
```typescript
export interface LoginResponse {
  token: string; // Combined access + refresh token
  authenticated: boolean;
}

export interface RefreshTokenRequest {
  token: string; // Old token để refresh
}

export interface RefreshTokenResponse {
  token: string; // New token (cũng là combined access + refresh token)
  authenticated: boolean;
}
```

### 2. AuthService (`src/domains/auth/services/authService.ts`)

#### Refresh Token Method
```typescript
refreshToken: async (token: string): Promise<RefreshTokenResponse> => {
  const response = await apiClient.post<ApiResponse<RefreshTokenResponse>>(
    '/identity/auth/refresh',
    { token } as RefreshTokenRequest
  );
  return response.data.result;
}
```

#### Axios Interceptor
- **Tự động refresh token** khi nhận 401 Unauthorized
- **Retry request gốc** với token mới
- **Auto logout** nếu refresh token thất bại

```typescript
// Response interceptor - xử lý lỗi và refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const currentToken = localStorage.getItem('token');
      if (currentToken) {
        try {
          // Thử refresh token
          const refreshResponse = await authService.refreshToken(currentToken);
          
          // Lưu token mới
          localStorage.setItem('token', refreshResponse.token);
          
          // Update Authorization header và retry request
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.token}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh token thất bại, logout
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);
```

### 3. AuthStore (`src/domains/auth/store/authStore.ts`)

#### Refresh Token Action
```typescript
refreshAuthToken: async () => {
  const currentToken = get().accessToken;
  if (!currentToken) return false;

  try {
    const response = await authService.refreshToken(currentToken);
    get().setToken(response.token);
    return true;
  } catch (error) {
    get().logout();
    return false;
  }
}
```

## 🔄 Flow hoạt động

### 1. Login Flow
```
User Login → API /identity/auth/token → 
Response: { token: "combined_token", authenticated: true } →
Store token in localStorage & AuthStore
```

### 2. API Call với Token Expired
```
API Call → 401 Unauthorized →
Axios Interceptor → Refresh Token →
New Token → Retry Original Request → Success
```

### 3. Refresh Token Flow
```
401 Error → Get current token → 
POST /identity/auth/refresh { token: old_token } →
Response: { token: new_token, authenticated: true } →
Update localStorage & AuthStore → Retry request
```

## 🧪 Testing

### Test Functions
```typescript
// Test refresh token flow
await testRefreshTokenFlow();

// Test axios interceptor
await testAxiosInterceptor();
```

### Browser Console Testing
```javascript
// Test refresh token
await testRefreshToken();

// Test interceptor
await testAxiosInterceptor();
```

## ✅ Features

### 🔄 Automatic Token Refresh
- Tự động refresh token khi API trả về 401
- Retry request gốc với token mới
- Transparent cho user

### 🛡️ Error Handling
- Auto logout khi refresh token thất bại
- Clear localStorage khi token invalid
- Redirect về login page

### 💾 State Management
- AuthStore tự động cập nhật token mới
- Persist token trong localStorage
- Zustand middleware đảm bảo state sync

### 🔧 Manual Refresh
- `authStore.refreshAuthToken()` để refresh manual
- Return boolean để biết success/failure
- Có thể dùng trong components

## 🎯 Benefits

1. **Seamless UX**: User không bị logout đột ngột
2. **Security**: Token tự động refresh, giảm risk
3. **Simple**: Gộp chung access + refresh token
4. **Automatic**: Không cần handle manual trong components
5. **Robust**: Error handling và fallback tốt

## 📝 Usage Examples

### Trong Component
```typescript
const { refreshAuthToken } = useAuthStore();

// Manual refresh (nếu cần)
const handleRefresh = async () => {
  const success = await refreshAuthToken();
  if (success) {
    console.log('Token refreshed successfully');
  } else {
    console.log('Token refresh failed, user logged out');
  }
};
```

### API Calls
```typescript
// API calls sẽ tự động handle token refresh
const userData = await authService.getCurrentUser();
// Nếu token expired → auto refresh → retry → success
```

## 🔍 Monitoring

### Console Logs
- Refresh token attempts
- Success/failure status
- Auto logout events
- Token updates

### Network Tab
- Monitor refresh token requests
- Check token payload
- Verify retry behavior

---

**Lưu ý**: Refresh token implementation hoàn toàn transparent với user. Tất cả API calls sẽ tự động handle token refresh khi cần thiết.
