// Wallet API endpoints
export const WALLET_ENDPOINTS = {
  PENDING_TRANSACTIONS: "/wallets/admin/pending",
  UPDATE_TRANSACTION_STATUS: "/wallets/admin/transactions/:id/status",
  TEST_WEBHOOK: "/wallets/test-webhook",
} as const;

// Generic endpoint builder
export const buildEndpoint = (
  endpoint: string,
  params?: Record<string, string | number>
): string => {
  if (!params) return endpoint;

  return Object.entries(params).reduce((url, [key, value]) => {
    return url.replace(`:${key}`, String(value));
  }, endpoint);
};

