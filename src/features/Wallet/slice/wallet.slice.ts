import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WalletState, FetchPendingTransactionsPayload, UpdateTransactionStatusPayload, TestWebhookPayload } from "./wallet.type";
import { WalletTransaction } from "@/core/api/wallet/type";
import { ReduxStateType } from "@/app/store/types";

const initialState: WalletState = {
  transactions: [],
  selectedTransaction: null,
  isLoading: false,
  error: null,
  updateTransaction: {
    status: ReduxStateType.INIT,
    error: null,
    message: null,
  },
  testWebhook: {
    status: ReduxStateType.INIT,
    error: null,
    message: null,
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {
    type: undefined,
  },
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    // Saga triggers
    fetchPendingTransactionsStart: (
      state,
      action: PayloadAction<FetchPendingTransactionsPayload>
    ) => {
      state.isLoading = true;
      state.error = null;
      if (action.payload.page) state.pagination.page = action.payload.page;
      if (action.payload.type !== undefined) state.filters.type = action.payload.type;
    },
    fetchPendingTransactionsSuccess: (
      state,
      action: PayloadAction<{ transactions: WalletTransaction[]; pagination: any }>
    ) => {
      state.isLoading = false;
      state.error = null;
      state.transactions = action.payload.transactions;
      state.pagination = action.payload.pagination;
    },
    fetchPendingTransactionsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.transactions = [];
    },

    updateTransactionStatusStart: (
      state,
      _action: PayloadAction<UpdateTransactionStatusPayload>
    ) => {
      state.updateTransaction.status = ReduxStateType.LOADING;
      state.updateTransaction.error = null;
      state.updateTransaction.message = null;
    },
    updateTransactionStatusSuccess: (
      state,
      action: PayloadAction<{ transaction: WalletTransaction; message?: string }>
    ) => {
      state.updateTransaction.status = ReduxStateType.SUCCESS;
      state.updateTransaction.message = action.payload.message || "Cập nhật trạng thái thành công";
      
      // Update transaction in list
      const index = state.transactions.findIndex(
        (t) => t._id === action.payload.transaction._id
      );
      if (index !== -1) {
        state.transactions[index] = action.payload.transaction;
      }
    },
    updateTransactionStatusFailure: (state, action: PayloadAction<string>) => {
      state.updateTransaction.status = ReduxStateType.ERROR;
      state.updateTransaction.error = action.payload;
    },

    testWebhookStart: (state, _action: PayloadAction<TestWebhookPayload>) => {
      state.testWebhook.status = ReduxStateType.LOADING;
      state.testWebhook.error = null;
      state.testWebhook.message = null;
    },
    testWebhookSuccess: (
      state,
      action: PayloadAction<{ transaction: WalletTransaction; message?: string }>
    ) => {
      state.testWebhook.status = ReduxStateType.SUCCESS;
      state.testWebhook.message = action.payload.message || "Test webhook thành công";
      
      // Update transaction in list
      const index = state.transactions.findIndex(
        (t) => t._id === action.payload.transaction._id
      );
      if (index !== -1) {
        state.transactions[index] = action.payload.transaction;
      }
    },
    testWebhookFailure: (state, action: PayloadAction<string>) => {
      state.testWebhook.status = ReduxStateType.ERROR;
      state.testWebhook.error = action.payload;
    },

    setSelectedTransaction: (state, action: PayloadAction<WalletTransaction | null>) => {
      state.selectedTransaction = action.payload;
    },
  },
});

export const {
  fetchPendingTransactionsStart,
  fetchPendingTransactionsSuccess,
  fetchPendingTransactionsFailure,
  updateTransactionStatusStart,
  updateTransactionStatusSuccess,
  updateTransactionStatusFailure,
  testWebhookStart,
  testWebhookSuccess,
  testWebhookFailure,
  setSelectedTransaction,
} = walletSlice.actions;

export default walletSlice.reducer;

