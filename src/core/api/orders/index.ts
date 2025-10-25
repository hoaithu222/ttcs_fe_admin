import { ORDERS_ENDPOINTS, buildEndpoint } from "./path";
import type {
  Order,
  CreateOrderRequest,
  UpdateOrderRequest,
  UpdateOrderStatusRequest,
  OrderListQuery,
  OrderListResponse,
  OrderStatistics,
  ApiSuccess,
} from "./type";
import { VpsHttpClient } from "@/core/base/http-client";

// Orders API service
class OrdersApiService extends VpsHttpClient {
  constructor() {
    super(process.env.REACT_APP_API_BASE_URL || "");
  }

  // Get orders list
  async getOrders(query?: OrderListQuery): Promise<ApiSuccess<OrderListResponse>> {
    const response = await this.get(ORDERS_ENDPOINTS.LIST, { params: query });
    return response.data;
  }

  // Get order detail
  async getOrder(id: string): Promise<ApiSuccess<Order>> {
    const endpoint = buildEndpoint(ORDERS_ENDPOINTS.DETAIL, { id });
    const response = await this.get(endpoint);
    return response.data;
  }

  // Create new order
  async createOrder(data: CreateOrderRequest): Promise<ApiSuccess<Order>> {
    const response = await this.post(ORDERS_ENDPOINTS.CREATE, data);
    return response.data;
  }

  // Update order
  async updateOrder(id: string, data: UpdateOrderRequest): Promise<ApiSuccess<Order>> {
    const endpoint = buildEndpoint(ORDERS_ENDPOINTS.UPDATE, { id });
    const response = await this.put(endpoint, data);
    return response.data;
  }

  // Update order status
  async updateOrderStatus(id: string, data: UpdateOrderStatusRequest): Promise<ApiSuccess<Order>> {
    const endpoint = buildEndpoint(ORDERS_ENDPOINTS.UPDATE_STATUS, { id });
    const response = await this.put(endpoint, data);
    return response.data;
  }

  // Delete order
  async deleteOrder(id: string): Promise<ApiSuccess<void>> {
    const endpoint = buildEndpoint(ORDERS_ENDPOINTS.DELETE, { id });
    const response = await this.delete(endpoint);
    return response.data;
  }

  // Get order statistics (admin only)
  async getOrderStatistics(): Promise<ApiSuccess<OrderStatistics>> {
    const response = await this.get("/analytics/orders/status-distribution");
    return response.data;
  }

  // Get average order value
  async getAverageOrderValue(): Promise<ApiSuccess<{ aov: number }>> {
    const response = await this.get("/analytics/orders/aov");
    return response.data;
  }
}

// Export singleton instance
export const ordersApi = new OrdersApiService();

// Export default
export default ordersApi;
