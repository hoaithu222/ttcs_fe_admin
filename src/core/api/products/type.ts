// Products request types
export interface CreateProductRequest {
  name: string;
  description?: string;
  images: string[];
  shopId: string;
  subCategoryId: string;
  categoryId: string;
  price: number;
  discount?: number;
  stock?: number;
  warrantyInfo: string;
  weight?: number;
  dimensions: string;
  metaKeywords: string;
  isActive?: boolean;
}

export interface UpdateProductRequest extends CreateProductRequest {}

// Products query parameters
export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  subCategoryId?: string;
  shopId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  sortBy?: "createdAt" | "price" | "rating" | "salesCount" | "viewCount";
  sortOrder?: "asc" | "desc";
}

// Products response types
export interface Product {
  _id: string;
  name: string;
  description?: string;
  images: string[];
  shopId: string;
  subCategoryId: string;
  categoryId: string;
  price: number;
  discount?: number;
  stock?: number;
  warrantyInfo: string;
  weight?: number;
  dimensions: string;
  metaKeywords: string;
  isActive: boolean;
  rating?: number;
  salesCount?: number;
  viewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsListResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API response wrapper (reuse from auth)
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
