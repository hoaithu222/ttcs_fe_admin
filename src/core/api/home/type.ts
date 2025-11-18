// Home API types
export interface Banner {
  _id: string;
  title: string;
  image: string;
  link?: string;
  order: number;
  isActive: boolean;
}

export interface HomeProduct {
  _id: string;
  name: string;
  price: number;
  discount?: number;
  finalPrice: number;
  images: Array<{ _id: string; url: string; publicId?: string }>;
  shop?: {
    _id: string;
    name: string;
    logo?: string;
    rating?: number;
  };
  category?: {
    _id: string;
    name: string;
    slug?: string;
  };
  subCategory?: {
    _id: string;
    name: string;
    slug?: string;
  };
  rating?: number;
  salesCount?: number;
}

export interface HomeShop {
  _id: string;
  name: string;
  logo?: string;
  rating?: number;
  productCount?: number;
  followerCount?: number;
}

export interface HomeCategory {
  _id: string;
  name: string;
  description?: string;
  image?: Array<{ url: string; publicId: string }>;
  image_Background?: { url: string; publicId: string };
  image_Icon?: { url: string; publicId: string };
  isActive: boolean;
  order_display: number;
}

// Request types
export interface HomeQuery {
  page?: number;
  limit?: number;
}

export interface SearchSuggestionQuery {
  q: string;
  page?: number;
  limit?: number;
}

// Response types
export interface BannerResponse {
  banners: Banner[];
}

export interface HomeCategoriesResponse {
  categories: HomeCategory[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface HomeProductsResponse {
  products: HomeProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface HomeShopsResponse {
  shops: HomeShop[];
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

