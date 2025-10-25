import { NOTIFICATIONS_ENDPOINTS, buildEndpoint } from "./path";
import type {
  Notification,
  NotificationListQuery,
  NotificationListResponse,
  ApiSuccess,
} from "./type";
import { VpsHttpClient } from "@/core/base/http-client";

// Notifications API service
class NotificationsApiService extends VpsHttpClient {
  constructor() {
    super(process.env.REACT_APP_API_BASE_URL || "");
  }

  // Get notifications list
  async getNotifications(
    query?: NotificationListQuery
  ): Promise<ApiSuccess<NotificationListResponse>> {
    const response = await this.get(NOTIFICATIONS_ENDPOINTS.LIST, { params: query });
    return response.data;
  }

  // Mark notification as read
  async markAsRead(id: string): Promise<ApiSuccess<Notification>> {
    const endpoint = buildEndpoint(NOTIFICATIONS_ENDPOINTS.MARK_READ, { id });
    const response = await this.patch(endpoint);
    return response.data;
  }

  // Mark all notifications as read
  async markAllAsRead(): Promise<ApiSuccess<void>> {
    const response = await this.patch(NOTIFICATIONS_ENDPOINTS.MARK_ALL_READ);
    return response.data;
  }

  // Delete notification
  async deleteNotification(id: string): Promise<ApiSuccess<void>> {
    const endpoint = buildEndpoint(NOTIFICATIONS_ENDPOINTS.DELETE, { id });
    const response = await this.delete(endpoint);
    return response.data;
  }
}

// Export singleton instance
export const notificationsApi = new NotificationsApiService();

// Export default
export default notificationsApi;
