// Sub Category types
export interface SubCategory {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  slug: string;
  parentId: string;
  parentCategory?: {
    _id: string;
    name: string;
    slug: string;
  };
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Request types
export interface CreateSubCategoryRequest {
  name: string;
  description?: string;
  image?: string;
  parentId: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateSubCategoryRequest extends Partial<CreateSubCategoryRequest> {
  _id: string;
}

export interface SubCategoryListQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  parentId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Response types
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
