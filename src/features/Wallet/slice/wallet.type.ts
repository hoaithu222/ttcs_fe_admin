import { WalletTransaction } from "@/core/api/wallet/type";
import { ReduxStateType } from "@/app/store/types";

export interface WalletState {
  transactions: WalletTransaction[];
  selectedTransaction: WalletTransaction | null;
  isLoading: boolean;
  error: string | null;
  updateTransaction: {
    status: ReduxStateType;
    error: string | null;
    message: string | null;
  };
  testWebhook: {
    status: ReduxStateType;
    error: string | null;
    message: string | null;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    type?: WalletTransaction["type"];
  };
}

export interface FetchPendingTransactionsPayload {
  page?: number;
  limit?: number;
  type?: WalletTransaction["type"];
}

export interface UpdateTransactionStatusPayload {
  transactionId: string;
  data: {
    status: WalletTransaction["status"];
    notes?: string;
  };
}

export interface TestWebhookPayload {
  transactionId: string;
  amount?: number;
  status?: "completed" | "failed";
}

