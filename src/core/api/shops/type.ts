// Shop types
export interface Shop {
  _id: string;
  name: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  ownerId: string;
  owner?: {
    _id: string;
    name: string;
    email: string;
  };
  isActive: boolean;
  isVerified: boolean;
  rating?: number;
  followersCount?: number;
  productsCount?: number;
  createdAt: string;
  updatedAt: string;
}

// Request types
export interface CreateShopRequest {
  name: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  isActive?: boolean;
}

export interface UpdateShopRequest extends Partial<CreateShopRequest> {
  _id: string;
}

export interface ShopListQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  isVerified?: boolean;
  ownerId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Response types
export interface ShopListResponse {
  shops: Shop[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FollowStatusResponse {
  isFollowing: boolean;
  followersCount: number;
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
