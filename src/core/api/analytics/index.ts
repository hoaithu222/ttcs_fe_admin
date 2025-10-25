import { ANALYTICS_ENDPOINTS, buildEndpoint } from "./path";
import type {
  RevenueResponse,
  TimeSeriesResponse,
  TopProductsResponse,
  TopShopsResponse,
  OrderStatusResponse,
  AOVResponse,
  AnalyticsQuery,
  ApiSuccess,
} from "./type";
import { VpsHttpClient } from "@/core/base/http-client";

// Analytics API service
class AnalyticsApiService extends VpsHttpClient {
  constructor() {
    super(process.env.REACT_APP_API_BASE_URL || "");
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
}

// Export singleton instance
export const analyticsApi = new AnalyticsApiService();

// Export default
export default analyticsApi;
