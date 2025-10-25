import { PAYMENTS_ENDPOINTS, buildEndpoint } from "./path";
import type {
  Payment,
  CheckoutRequest,
  PaymentStatusQuery,
  PaymentHistoryQuery,
  CheckoutResponse,
  PaymentStatusResponse,
  PaymentHistoryResponse,
  WebhookResponse,
  ApiSuccess,
} from "./type";
import { VpsHttpClient } from "@/core/base/http-client";

// Payments API service
class PaymentsApiService extends VpsHttpClient {
  constructor() {
    super(process.env.REACT_APP_API_BASE_URL || "");
  }

  // Create payment checkout
  async createCheckout(data: CheckoutRequest): Promise<ApiSuccess<CheckoutResponse>> {
    const response = await this.post(PAYMENTS_ENDPOINTS.CHECKOUT, data);
    return response.data;
  }

  // Get payment status
  async getPaymentStatus(orderId: string): Promise<ApiSuccess<PaymentStatusResponse>> {
    const endpoint = buildEndpoint(PAYMENTS_ENDPOINTS.STATUS, { orderId });
    const response = await this.get(endpoint);
    return response.data;
  }

  // Handle payment webhook
  async handleWebhook(data: any): Promise<ApiSuccess<WebhookResponse>> {
    const response = await this.post(PAYMENTS_ENDPOINTS.WEBHOOK, data);
    return response.data;
  }

  // Get payment history
  async getPaymentHistory(
    query?: PaymentHistoryQuery
  ): Promise<ApiSuccess<PaymentHistoryResponse>> {
    const response = await this.get(PAYMENTS_ENDPOINTS.HISTORY, { params: query });
    return response.data;
  }
}

// Export singleton instance
export const paymentsApi = new PaymentsApiService();

// Export default
export default paymentsApi;
