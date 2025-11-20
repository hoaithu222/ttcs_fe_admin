import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store/types";

// Base selector
const selectWalletState = (state: RootState) => (state as any).wallet;

// Derived selectors
export const selectTransactions = createSelector(
  [selectWalletState],
  (wallet) => wallet?.transactions || []
);

export const selectSelectedTransaction = createSelector(
  [selectWalletState],
  (wallet) => wallet?.selectedTransaction || null
);

export const selectWalletLoading = createSelector(
  [selectWalletState],
  (wallet) => wallet?.isLoading || false
);

export const selectWalletError = createSelector(
  [selectWalletState],
  (wallet) => wallet?.error || null
);

export const selectWalletPagination = createSelector(
  [selectWalletState],
  (wallet) =>
    wallet?.pagination || {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    }
);

export const selectWalletFilters = createSelector(
  [selectWalletState],
  (wallet) => wallet?.filters || { type: undefined }
);

export const selectUpdateTransactionStatus = createSelector(
  [selectWalletState],
  (wallet) => wallet?.updateTransaction || { status: "INIT", error: null, message: null }
);

export const selectTestWebhookStatus = createSelector(
  [selectWalletState],
  (wallet) => wallet?.testWebhook || { status: "INIT", error: null, message: null }
);

