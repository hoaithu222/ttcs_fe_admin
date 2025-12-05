import { SHOPS_ENDPOINTS, buildEndpoint } from "./path";
import type {
  Shop,
  CreateShopRequest,
  UpdateShopRequest,
  ShopListQuery,
  ShopListResponse,
  FollowStatusResponse,
  ApiSuccess,
} from "./type";
import { VpsHttpClient } from "@/core/base/http-client";
import { API_BASE_URL } from "@/app/config/env.config";

// Shops API service
class ShopsApiService extends VpsHttpClient {
  constructor() {
    super(API_BASE_URL);
  }

  // Get shops list
  async getShops(query?: ShopListQuery): Promise<ApiSuccess<ShopListResponse>> {
    const response = await this.get(SHOPS_ENDPOINTS.LIST, { params: query });
    return response.data;
  }

  // Get shop detail
  async getShop(id: string): Promise<ApiSuccess<Shop>> {
    const endpoint = buildEndpoint(SHOPS_ENDPOINTS.DETAIL, { id });
    const response = await this.get(endpoint);
    return response.data;
  }

  // Create new shop
  async createShop(data: CreateShopRequest): Promise<ApiSuccess<Shop>> {
    const response = await this.post(SHOPS_ENDPOINTS.CREATE, data);
    return response.data;
  }

  // Update shop
  async updateShop(id: string, data: UpdateShopRequest): Promise<ApiSuccess<Shop>> {
    const endpoint = buildEndpoint(SHOPS_ENDPOINTS.UPDATE, { id });
    const response = await this.put(endpoint, data);
    return response.data;
  }

  // Delete shop
  async deleteShop(id: string): Promise<ApiSuccess<void>> {
    const endpoint = buildEndpoint(SHOPS_ENDPOINTS.DELETE, { id });
    const response = await this.delete(endpoint);
    return response.data;
  }

  // Follow shop
  async followShop(id: string): Promise<ApiSuccess<void>> {
    const endpoint = buildEndpoint(SHOPS_ENDPOINTS.FOLLOW, { id });
    const response = await this.post(endpoint);
    return response.data;
  }

  // Unfollow shop
  async unfollowShop(id: string): Promise<ApiSuccess<void>> {
    const endpoint = buildEndpoint(SHOPS_ENDPOINTS.UNFOLLOW, { id });
    const response = await this.delete(endpoint);
    return response.data;
  }

  // Check if following shop
  async getFollowingStatus(id: string): Promise<ApiSuccess<FollowStatusResponse>> {
    const endpoint = buildEndpoint(SHOPS_ENDPOINTS.FOLLOWING, { id });
    const response = await this.get(endpoint);
    return response.data;
  }

  // Get followers count
  async getFollowersCount(id: string): Promise<ApiSuccess<{ count: number }>> {
    const endpoint = buildEndpoint(SHOPS_ENDPOINTS.FOLLOWERS_COUNT, { id });
    const response = await this.get(endpoint);
    return response.data;
  }

  // Approve shop (admin only)
  async approveShop(id: string): Promise<ApiSuccess<Shop>> {
    const endpoint = buildEndpoint(SHOPS_ENDPOINTS.APPROVE, { id });
    const response = await this.post(endpoint);
    return response.data;
  }

  // Reject shop (admin only)
  async rejectShop(id: string): Promise<ApiSuccess<Shop>> {
    const endpoint = buildEndpoint(SHOPS_ENDPOINTS.REJECT, { id });
    const response = await this.post(endpoint);
    return response.data;
  }

  // Suspend shop (admin only)
  async suspendShop(id: string): Promise<ApiSuccess<Shop>> {
    const endpoint = buildEndpoint(SHOPS_ENDPOINTS.SUSPEND, { id });
    const response = await this.post(endpoint);
    return response.data;
  }

  // Unlock shop (admin only)
  async unlockShop(id: string): Promise<ApiSuccess<Shop>> {
    const endpoint = buildEndpoint(SHOPS_ENDPOINTS.UNLOCK, { id });
    const response = await this.post(endpoint);
    return response.data;
  }
}

// Export singleton instance
export const shopsApi = new ShopsApiService();

// Export default
export default shopsApi;
