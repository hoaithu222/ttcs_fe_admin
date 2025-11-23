// Home API types
export interface Banner {
  _id: string;
  title: string;
  image: string;
  link?: string;
  order: number;
  isActive: boolean;
}

// Home Configuration types
export interface BannerImage {
  url: string;
  publicId: string;
}

export interface MainBanner {
  _id?: string;
  image: BannerImage;
  title?: string;
  description?: string;
  link?: string;
  order?: number;
  isActive?: boolean;
}

export interface SideBanner {
  _id?: string;
  categoryId: string;
  category?: {
    _id: string;
    name: string;
    image_Background?: BannerImage;
  };
  image?: BannerImage; // Auto-populated from category.image_Background
  order?: number;
  isActive?: boolean;
}

export interface Feature {
  icon: string;
  text: string;
  iconBg: string;
  hoverColor: string;
  order?: number;
  isActive?: boolean;
}

export interface HomeConfigurationSettings {
  autoSlideInterval?: number;
  showCounter?: boolean;
  showDots?: boolean;
}

export type DisplayType = "default" | "compact" | "modern" | "classic";

export interface HomeConfiguration {
  _id: string;
  mainBanners: MainBanner[];
  sideBanners: SideBanner[];
  features: Feature[];
  settings: HomeConfigurationSettings;
  isActive: boolean;
  displayType?: DisplayType;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBannerRequest {
  image: BannerImage;
  title?: string;
  description?: string;
  link?: string;
  order?: number;
  isActive?: boolean;
}

export interface CreateSideBannerRequest {
  categoryId: string;
  order?: number;
  isActive?: boolean;
}

export interface CreateFeatureRequest {
  icon: string;
  text: string;
  iconBg: string;
  hoverColor: string;
  order?: number;
  isActive?: boolean;
}

export interface CreateHomeConfigurationRequest {
  mainBanners?: CreateBannerRequest[];
  sideBanners?: CreateSideBannerRequest[];
  features?: CreateFeatureRequest[];
  settings?: HomeConfigurationSettings;
  isActive?: boolean;
}

export interface UpdateHomeConfigurationRequest extends CreateHomeConfigurationRequest {}

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
  mainBanners: MainBanner[];
  sideBanners: SideBanner[];
  features: Feature[];
  settings: HomeConfigurationSettings;
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

