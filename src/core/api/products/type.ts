export interface Product {
  _id: string;
  name: string;
  description: string;
  images: Array<{ url: string; publicId?: string; _id?: string } | string>;
  shopId: {
    _id: string;
    name: string;
    logo?: string;
    rating?: number;
  };
  categoryId: {
    _id: string;
    name: string;
    slug?: string;
  };
  subCategoryId: {
    _id: string;
    name: string;
    slug?: string;
  };
  price: number;
  discount: number;
  stock: number;
  rating: number;
  reviewCount: number;
  salesCount: number;
  viewCount: number;
  isActive: boolean;
  status: "pending" | "approved" | "hidden" | "violated";
  violationNote?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  variants?: Array<{
    attributes: Record<string, any>;
    price: number;
    stock: number;
    image?: string;
    sku?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListQuery {
  page?: number;
  limit?: number;
  categoryId?: string;
  subCategoryId?: string;
  shopId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  isActive?: boolean;
  status?: "approved" | "hidden" | "violated";
  sortBy?: "createdAt" | "price" | "rating" | "salesCount" | "viewCount";
  sortOrder?: "asc" | "desc";
}

export interface ProductListResponse {
  items: Product[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UpdateProductStatusRequest {
  status: "pending" | "approved" | "hidden" | "violated";
  violationNote?: string;
}

export interface ApiSuccess<T> {
  success: boolean;
  data: T;
  message?: string;
}
