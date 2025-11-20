import { WALLET_ENDPOINTS, buildEndpoint } from "./path";
import type {
  WalletTransaction,
  UpdateTransactionStatusRequest,
  PendingTransactionsQuery,
  PendingTransactionsResponse,
  TestWebhookRequest,
  ApiSuccess,
} from "./type";
import { VpsHttpClient } from "@/core/base/http-client";
import { API_BASE_URL } from "@/app/config/env.config";

// Wallet API service for admin
class WalletApiService extends VpsHttpClient {
  constructor() {
    super(API_BASE_URL);
  }

  // Get pending transactions (admin only)
  async getPendingTransactions(
    query?: PendingTransactionsQuery
  ): Promise<ApiSuccess<PendingTransactionsResponse>> {
    const response = await this.get(WALLET_ENDPOINTS.PENDING_TRANSACTIONS, { params: query });
    return response.data;
  }

  // Update transaction status (admin only)
  async updateTransactionStatus(
    transactionId: string,
    data: UpdateTransactionStatusRequest
  ): Promise<ApiSuccess<{ transaction: WalletTransaction }>> {
    const endpoint = buildEndpoint(WALLET_ENDPOINTS.UPDATE_TRANSACTION_STATUS, { id: transactionId });
    const response = await this.put(endpoint, data);
    return response.data;
  }

  // Test webhook (for demo/testing)
  async testWebhook(data: TestWebhookRequest): Promise<ApiSuccess<{ transaction: WalletTransaction }>> {
    const response = await this.post(WALLET_ENDPOINTS.TEST_WEBHOOK, data);
    return response.data;
  }
}

// Export singleton instance
export const walletApi = new WalletApiService();

// Export default
export default walletApi;

