// Wallet Transaction types
export interface WalletTransaction {
  _id: string;
  userId?: string | {
    _id: string;
    name?: string;
    email?: string;
    avatar?: string;
    phone?: string;
  };
  shopId?: string;
  type: "deposit" | "withdraw" | "payment" | "refund" | "transfer";
  amount: number;
  status: "pending" | "completed" | "failed" | "cancelled";
  description?: string;
  bankAccount?: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
  qrCode?: string;
  transactionId?: string;
  orderId?: string;
  paymentId?: string;
  metadata?: Record<string, any>;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Request types
export interface UpdateTransactionStatusRequest {
  status: WalletTransaction["status"];
  notes?: string;
}

export interface PendingTransactionsQuery {
  page?: number;
  limit?: number;
  type?: WalletTransaction["type"];
  status?: WalletTransaction["status"] | "all";
}

export interface TestWebhookRequest {
  transactionId: string;
  amount?: number;
  status?: "completed" | "failed";
}

// Response types
export interface PendingTransactionsResponse {
  transactions: WalletTransaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API response wrapper
export interface ApiSuccess<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: any;
  timestamp: string;
  code: number;
}

export interface ApiError {
  success: boolean;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
  timestamp: string;
  path: string;
  method: string;
  code: number;
}

