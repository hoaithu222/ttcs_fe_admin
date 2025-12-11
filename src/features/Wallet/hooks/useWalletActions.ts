import { useCallback, useEffect } from "react";
import { useAppDispatch } from "@/app/store";
import {
  fetchPendingTransactionsStart,
  updateTransactionStatusStart,
  testWebhookStart,
  setSelectedTransaction,
} from "../slice/wallet.slice";
import { WalletTransaction } from "@/core/api/wallet/type";
import {
  selectUpdateTransactionStatus,
  selectTestWebhookStatus,
} from "../slice/wallet.selector";
import { useSelector } from "react-redux";
import { ReduxStateType } from "@/app/store/types";

export const useWalletActions = () => {
  const dispatch = useAppDispatch();
  const updateTransactionStatus = useSelector(selectUpdateTransactionStatus);
  const testWebhookStatus = useSelector(selectTestWebhookStatus);

  const fetchPendingTransactions = useCallback(
    (payload: {
      page?: number;
      limit?: number;
      type?: WalletTransaction["type"];
      status?: WalletTransaction["status"] | "all";
    }) => {
      dispatch(fetchPendingTransactionsStart(payload));
    },
    [dispatch]
  );

  // Listen for success and refresh list
  useEffect(() => {
    if (
      updateTransactionStatus.status === ReduxStateType.SUCCESS ||
      testWebhookStatus.status === ReduxStateType.SUCCESS
    ) {
      // Refresh list after action
      setTimeout(() => {
        dispatch(fetchPendingTransactionsStart({ page: 1, limit: 10 }));
      }, 500);
    }
  }, [
    updateTransactionStatus.status,
    testWebhookStatus.status,
    dispatch,
  ]);

  const updateTransaction = useCallback(
    (transactionId: string, data: { status: WalletTransaction["status"]; notes?: string }) => {
      dispatch(updateTransactionStatusStart({ transactionId, data }));
    },
    [dispatch]
  );

  const testWebhook = useCallback(
    (transactionId: string, amount?: number, status: "completed" | "failed" = "completed") => {
      dispatch(testWebhookStart({ transactionId, amount, status }));
    },
    [dispatch]
  );

  const selectTransaction = useCallback(
    (transaction: WalletTransaction | null) => {
      dispatch(setSelectedTransaction(transaction));
    },
    [dispatch]
  );

  return {
    fetchPendingTransactions,
    updateTransaction,
    testWebhook,
    selectTransaction,
  };
};

