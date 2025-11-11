// Category types matching backend model
export interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: Array<{ url: string; publicId: string }>;
  image_Background?: { url: string; publicId: string };
  image_Icon?: { url: string; publicId: string };
  banner?: string;
  isActive: boolean;
  order_display: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubCategory extends Category {
  categoryId: string;
}

// Request types
export interface CreateCategoryRequest {
  name: string;
  description?: string;
  image?: Array<{ url: string; publicId: string }>;
  image_Background?: { url: string; publicId: string };
  image_Icon?: { url: string; publicId: string };
  isActive?: boolean;
  order_display?: number;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  image?: Array<{ url: string; publicId: string }>;
  image_Background?: { url: string; publicId: string };
  image_Icon?: { url: string; publicId: string };
  isActive?: boolean;
  order_display?: number;
}

export interface CategoryListQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

// Response types
export interface CategoryListResponse {
  categories: Category[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SubCategoryListResponse {
  subCategories: SubCategory[];
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
