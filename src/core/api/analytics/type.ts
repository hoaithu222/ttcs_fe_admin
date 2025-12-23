// Analytics types
export interface RevenueData {
  totalRevenue: number;
  period: string;
  growthRate: number;
  previousPeriodRevenue: number;
}

export interface TimeSeriesData {
  date: string;
  revenue: number;
  orders: number;
  customers: number;
}

export interface TopProduct {
  productId: string;
  productName: string;
  productImage?: string;
  totalSales: number;
  revenue: number;
  quantitySold: number;
  rank: number;
}

export interface TopShop {
  shopId: string;
  shopName: string;
  shopLogo?: string;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue?: number;
  rank: number;
}

export interface OrderStatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

export interface AverageOrderValue {
  aov: number;
  period: string;
  previousPeriodAov: number;
  growthRate: number;
}

// Request types
export interface AnalyticsQuery {
  startDate?: string;
  endDate?: string;
  period?: "day" | "week" | "month" | "year";
  limit?: number;
}

// Response types
export interface RevenueResponse {
  revenue: RevenueData;
}

export interface TimeSeriesResponse {
  data: TimeSeriesData[];
}

export interface TopProductsResponse {
  products: TopProduct[];
}

export interface TopShopsResponse {
  shops: TopShop[];
}

export interface OrderStatusResponse {
  distribution: OrderStatusDistribution[];
}

export interface AOVResponse {
  aov: AverageOrderValue;
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
