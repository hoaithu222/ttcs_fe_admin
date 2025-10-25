// User types
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  status: "active" | "inactive" | "suspended";
  role: "admin" | "user" | "moderator";
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  twoFactorEnabled: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSecurity {
  twoFactorEnabled: boolean;
  lastPasswordChange?: string;
  loginHistory: Array<{
    ip: string;
    userAgent: string;
    timestamp: string;
    location?: string;
  }>;
  activeSessions: Array<{
    id: string;
    ip: string;
    userAgent: string;
    createdAt: string;
  }>;
}

// Request types
export interface UpdateUserRequest {
  name?: string;
  email?: string;
  avatar?: string;
  phone?: string;
  status?: "active" | "inactive" | "suspended";
  role?: "admin" | "user" | "moderator";
}

export interface UserListQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "inactive" | "suspended";
  role?: "admin" | "user" | "moderator";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface Enable2FARequest {
  secret: string;
  token: string;
}

export interface Verify2FARequest {
  token: string;
}

export interface ChangeOTPMethodRequest {
  method: "email" | "phone";
  identifier: string;
}

// Response types
export interface UserListResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  usersByRole: Record<string, number>;
  usersByStatus: Record<string, number>;
  growthRate: number;
}

// API response wrapper
export interface ApiSuccess<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: any;
  timestamp: string;
  code: number;
}

export interface ApiError {
  success: boolean;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
  timestamp: string;
  path: string;
  method: string;
  code: number;
}
