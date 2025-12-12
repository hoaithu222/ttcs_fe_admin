import { USERS_ENDPOINTS, buildEndpoint } from "./path";
import type {
  User,
  UserSecurity,
  UpdateUserRequest,
  UserListQuery,
  UserListResponse,
  UserStatistics,
  Enable2FARequest,
  Verify2FARequest,
  ChangeOTPMethodRequest,
  ApiSuccess,
} from "./type";
import { VpsHttpClient } from "@/core/base/http-client";
import { API_BASE_URL } from "@/app/config/env.config";

// Users API service
class UsersApiService extends VpsHttpClient {
  constructor() {
    super(API_BASE_URL);
  }

  // Get users list
  async getUsers(query?: UserListQuery): Promise<ApiSuccess<UserListResponse>> {
    const response = await this.get(USERS_ENDPOINTS.LIST, { params: query });
    return response.data;
  }

  // Get user detail
  async getUser(id: string): Promise<ApiSuccess<User>> {
    const endpoint = buildEndpoint(USERS_ENDPOINTS.DETAIL, { id });
    const response = await this.get(endpoint);
    return response.data;
  }

  // Update user (full update)
  async updateUser(id: string, data: UpdateUserRequest): Promise<ApiSuccess<User>> {
    const endpoint = buildEndpoint(USERS_ENDPOINTS.UPDATE, { id });
    const response = await this.put(endpoint, data);
    return response.data;
  }

  // Update user (partial update)
  async updateUserPartial(id: string, data: Partial<UpdateUserRequest>): Promise<ApiSuccess<User>> {
    const endpoint = buildEndpoint(USERS_ENDPOINTS.UPDATE_PARTIAL, { id });
    const response = await this.patch(endpoint, data);
    return response.data;
  }

  // Delete user
  async deleteUser(id: string): Promise<ApiSuccess<void>> {
    const endpoint = buildEndpoint(USERS_ENDPOINTS.DELETE, { id });
    const response = await this.delete(endpoint);
    return response.data;
  }

  // Suspend user (admin only)
  async suspendUser(id: string): Promise<ApiSuccess<User>> {
    const endpoint = buildEndpoint(USERS_ENDPOINTS.SUSPEND, { id });
    const response = await this.post(endpoint);
    return response.data;
  }

  // Unlock user (admin only)
  async unlockUser(id: string): Promise<ApiSuccess<User>> {
    const endpoint = buildEndpoint(USERS_ENDPOINTS.UNLOCK, { id });
    const response = await this.post(endpoint);
    return response.data;
  }

  // Get user security info
  async getUserSecurity(): Promise<ApiSuccess<UserSecurity>> {
    const response = await this.get(USERS_ENDPOINTS.SECURITY);
    return response.data;
  }

  // Enable 2FA
  async enable2FA(data: Enable2FARequest): Promise<ApiSuccess<void>> {
    const response = await this.post(USERS_ENDPOINTS.ENABLE_2FA, data);
    return response.data;
  }

  // Verify 2FA
  async verify2FA(data: Verify2FARequest): Promise<ApiSuccess<void>> {
    const response = await this.post(USERS_ENDPOINTS.VERIFY_2FA, data);
    return response.data;
  }

  // Delete account
  async deleteAccount(): Promise<ApiSuccess<void>> {
    const response = await this.delete(USERS_ENDPOINTS.DELETE_ACCOUNT);
    return response.data;
  }

  // Change OTP method
  async changeOTPMethod(data: ChangeOTPMethodRequest): Promise<ApiSuccess<void>> {
    const response = await this.post(USERS_ENDPOINTS.CHANGE_OTP_METHOD, data);
    return response.data;
  }

  // Get user statistics (admin only)
  async getUserStatistics(): Promise<ApiSuccess<UserStatistics>> {
    const response = await this.get("/admin/users/statistics");
    return response.data;
  }
}

// Export singleton instance
export const usersApi = new UsersApiService();

// Export default
export default usersApi;
