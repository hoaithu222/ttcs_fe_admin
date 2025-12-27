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
  period?: "day" | "week" | "month" | "year" | "custom";
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

// 1. Shop Strength Quadrant
export interface ShopStrengthItem {
  shopId: string;
  shopName: string;
  shopLogo?: string;
  gmv: number;
  rating: number;
  conversionRate: number;
  totalOrders: number;
  quadrant: number;
  quadrantName: string;
  quadrantColor: string;
}

export interface ShopStrengthResponse {
  items: ShopStrengthItem[];
}

// 2. Cash Flow Growth
export interface CashFlowItem {
  date: string;
  gmv: number;
  discounts: number;
  orders: number;
  netProfit: number;
  ma30: number;
}

export interface CashFlowResponse {
  items: CashFlowItem[];
}

// 3. Payment & Device Distribution
export interface PaymentMethodItem {
  method: string;
  count: number;
  totalAmount: number;
  percentage: number;
}

export interface DeviceTypeItem {
  device: string;
  count: number;
  percentage: number;
}

export interface PaymentDeviceResponse {
  paymentMethods: PaymentMethodItem[];
  deviceTypes: DeviceTypeItem[];
}

// 4. System Load Stats
export interface SystemLoadItem {
  timestamp: string;
  requestCount: number;
  comparisonValue: number;
}

export interface SystemLoadResponse {
  items: SystemLoadItem[];
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
