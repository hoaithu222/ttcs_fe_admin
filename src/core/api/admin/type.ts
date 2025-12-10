// Admin types
export interface SystemLog {
  _id: string;
  level: "error" | "warn" | "info" | "debug";
  message: string;
  timestamp: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
  stack?: string;
  metadata?: Record<string, any>;
}

export interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  usersByRole: Record<string, number>;
  usersByStatus: Record<string, number>;
  growthRate: number;
  monthlyGrowth: number;
  activeRate?: number;
  inactiveUsers?: number;
}

export interface TopSellingProduct {
  productId: string;
  productName: string;
  salesCount: number;
  imageUrl?: string;
  category?: string;
  price?: number;
  revenue?: number;
  stockLeft?: number;
  rating?: number;
}

export interface ProductStatistics {
  totalProducts: number;
  activeProducts: number;
  productsByCategory: Record<string, number>;
  productsByShop: Record<string, number>;
  lowStockProducts: number;
  outOfStockProducts: number;
  topSellingProducts: TopSellingProduct[];
}

export interface SystemConfig {
  siteName: string;
  siteDescription: string;
  siteLogo?: string;
  siteFavicon?: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailVerificationRequired: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
  paymentMethods: string[];
  currency: string;
  timezone: string;
  language: string;
}

// Request types
export interface LogsQuery {
  page?: number;
  limit?: number;
  level?: SystemLog["level"];
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface UpdateUserRoleRequest {
  role: "admin" | "user" | "moderator";
}

export interface UpdateConfigRequest {
  siteName?: string;
  siteDescription?: string;
  siteLogo?: string;
  siteFavicon?: string;
  maintenanceMode?: boolean;
  registrationEnabled?: boolean;
  emailVerificationRequired?: boolean;
  maxFileSize?: number;
  allowedFileTypes?: string[];
  paymentMethods?: string[];
  currency?: string;
  timezone?: string;
  language?: string;
}

// Response types
export interface LogsResponse {
  logs: SystemLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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
