import { ANALYTICS_ENDPOINTS, buildEndpoint } from "./path";
import type {
  RevenueResponse,
  TimeSeriesResponse,
  TopProductsResponse,
  TopShopsResponse,
  OrderStatusResponse,
  AOVResponse,
  ShopStrengthResponse,
  CashFlowResponse,
  PaymentDeviceResponse,
  SystemLoadResponse,
  AnalyticsQuery,
  ApiSuccess,
} from "./type";
import { VpsHttpClient } from "@/core/base/http-client";
import { API_BASE_URL } from "@/app/config/env.config";

// Analytics API service
class AnalyticsApiService extends VpsHttpClient {
  constructor() {
    super(API_BASE_URL);
  }

  // Get admin revenue statistics
  async getAdminRevenue(query?: AnalyticsQuery): Promise<ApiSuccess<RevenueResponse>> {
    const response = await this.get(ANALYTICS_ENDPOINTS.ADMIN_REVENUE, { params: query });
    return response.data;
  }

  // Get shop revenue statistics
  async getShopRevenue(
    shopId: string,
    query?: AnalyticsQuery
  ): Promise<ApiSuccess<RevenueResponse>> {
    const endpoint = buildEndpoint(ANALYTICS_ENDPOINTS.SHOP_REVENUE, { shopId });
    const response = await this.get(endpoint, { params: query });
    return response.data;
  }

  // Get revenue time series data
  async getRevenueTimeSeries(query?: AnalyticsQuery): Promise<ApiSuccess<TimeSeriesResponse>> {
    const response = await this.get(ANALYTICS_ENDPOINTS.TIMESERIES_REVENUE, { params: query });
    return response.data;
  }

  // Get top products
  async getTopProducts(query?: AnalyticsQuery): Promise<ApiSuccess<TopProductsResponse>> {
    const response = await this.get(ANALYTICS_ENDPOINTS.TOP_PRODUCTS, { params: query });
    return response.data;
  }

  // Get top products for a specific shop
  async getShopTopProducts(
    shopId: string,
    query?: AnalyticsQuery
  ): Promise<ApiSuccess<TopProductsResponse>> {
    const endpoint = buildEndpoint(ANALYTICS_ENDPOINTS.SHOP_TOP_PRODUCTS, { shopId });
    const response = await this.get(endpoint, { params: query });
    return response.data;
  }

  // Get top shops
  async getTopShops(query?: AnalyticsQuery): Promise<ApiSuccess<TopShopsResponse>> {
    const response = await this.get(ANALYTICS_ENDPOINTS.TOP_SHOPS, { params: query });
    return response.data;
  }

  // Get order status distribution
  async getOrderStatusDistribution(): Promise<ApiSuccess<OrderStatusResponse>> {
    const response = await this.get(ANALYTICS_ENDPOINTS.ORDERS_STATUS_DISTRIBUTION);
    return response.data;
  }

  // Get average order value
  async getAverageOrderValue(query?: AnalyticsQuery): Promise<ApiSuccess<AOVResponse>> {
    const response = await this.get(ANALYTICS_ENDPOINTS.ORDERS_AOV, { params: query });
    return response.data;
  }

  // 1. Get shop strength quadrant data
  async getShopStrength(query?: AnalyticsQuery): Promise<ApiSuccess<ShopStrengthResponse>> {
    const response = await this.get(ANALYTICS_ENDPOINTS.SHOP_STRENGTH, { params: query });
    return response.data;
  }

  // 2. Get cash flow growth with MA30 and Net Profit
  async getCashFlowGrowth(query?: AnalyticsQuery): Promise<ApiSuccess<CashFlowResponse>> {
    const response = await this.get(ANALYTICS_ENDPOINTS.CASH_FLOW_GROWTH, { params: query });
    return response.data;
  }

  // 3. Get payment method and device type distribution
  async getPaymentDeviceDistribution(
    query?: AnalyticsQuery
  ): Promise<ApiSuccess<PaymentDeviceResponse>> {
    const response = await this.get(ANALYTICS_ENDPOINTS.PAYMENT_DEVICE_DISTRIBUTION, {
      params: query,
    });
    return response.data;
  }

  // 4. Get system load stats
  async getSystemLoad(query?: AnalyticsQuery): Promise<ApiSuccess<SystemLoadResponse>> {
    const response = await this.get(ANALYTICS_ENDPOINTS.SYSTEM_LOAD, { params: query });
    return response.data;
  }
}

// Export singleton instance
export const analyticsApi = new AnalyticsApiService();

// Export default
export default analyticsApi;
