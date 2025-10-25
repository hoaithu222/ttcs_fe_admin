import { ADMIN_ENDPOINTS, buildEndpoint } from "./path";
import type {
  SystemLog,
  UserStatistics,
  ProductStatistics,
  SystemConfig,
  LogsQuery,
  UpdateUserRoleRequest,
  UpdateConfigRequest,
  LogsResponse,
  ApiSuccess,
} from "./type";
import { VpsHttpClient } from "@/core/base/http-client";

// Admin API service
class AdminApiService extends VpsHttpClient {
  constructor() {
    super(process.env.REACT_APP_API_BASE_URL || "");
  }

  // Get system logs
  async getLogs(query?: LogsQuery): Promise<ApiSuccess<LogsResponse>> {
    const response = await this.get(ADMIN_ENDPOINTS.LOGS, { params: query });
    return response.data;
  }

  // Get user statistics
  async getUserStatistics(): Promise<ApiSuccess<UserStatistics>> {
    const response = await this.get(ADMIN_ENDPOINTS.USER_STATISTICS);
    return response.data;
  }

  // Get product statistics
  async getProductStatistics(): Promise<ApiSuccess<ProductStatistics>> {
    const response = await this.get(ADMIN_ENDPOINTS.PRODUCT_STATISTICS);
    return response.data;
  }

  // Get system configuration
  async getConfig(): Promise<ApiSuccess<SystemConfig>> {
    const response = await this.get(ADMIN_ENDPOINTS.CONFIG);
    return response.data;
  }

  // Update system configuration
  async updateConfig(data: UpdateConfigRequest): Promise<ApiSuccess<SystemConfig>> {
    const response = await this.put(ADMIN_ENDPOINTS.CONFIG, data);
    return response.data;
  }

  // Update user role
  async updateUserRole(userId: string, data: UpdateUserRoleRequest): Promise<ApiSuccess<void>> {
    const endpoint = buildEndpoint(ADMIN_ENDPOINTS.USER_ROLE, { id: userId });
    const response = await this.put(endpoint, data);
    return response.data;
  }

  // Delete user (admin only)
  async deleteUser(userId: string): Promise<ApiSuccess<void>> {
    const endpoint = buildEndpoint(ADMIN_ENDPOINTS.DELETE_USER, { id: userId });
    const response = await this.delete(endpoint);
    return response.data;
  }
}

// Export singleton instance
export const adminApi = new AdminApiService();

// Export default
export default adminApi;
