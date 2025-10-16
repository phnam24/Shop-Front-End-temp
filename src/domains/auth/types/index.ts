// User Types
export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  dob?: string; // ISO date string
  roles: Role[];
}

export interface Role {
  id: string;
  name: string;
  description?: string;
}

// Auth Request/Response Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  dob?: string; // ISO date string format: YYYY-MM-DD
}

// Backend API Response Structure
export interface ApiResponse<T> {
  code: number;
  result: T;
  message?: string;
}

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

export interface UserInfoResponse {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  dob?: string;
  roles: Role[];
}

// Register chỉ trả về user info, không có token
export interface RegisterResponse extends UserInfoResponse {}

// Auth State
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Form Validation
export interface LoginFormData {
  username: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  dob?: string;
  terms: boolean;
}

// API Error Response
export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}