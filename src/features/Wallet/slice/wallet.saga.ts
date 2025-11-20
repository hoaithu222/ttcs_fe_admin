import { call, put, takeEvery } from "redux-saga/effects";
import { walletApi } from "@/core/api/wallet";
import { addToast } from "@/app/store/slices/toast";
import type {
  fetchPendingTransactionsStart,
  updateTransactionStatusStart,
  testWebhookStart,
} from "./wallet.slice";
import {
  fetchPendingTransactionsSuccess,
  fetchPendingTransactionsFailure,
  updateTransactionStatusSuccess,
  updateTransactionStatusFailure,
  testWebhookSuccess,
  testWebhookFailure,
} from "./wallet.slice";
import type { ApiSuccess, PendingTransactionsResponse } from "@/core/api/wallet/type";

type FetchPendingTransactionsAction = ReturnType<typeof fetchPendingTransactionsStart>;
type UpdateTransactionStatusAction = ReturnType<typeof updateTransactionStatusStart>;
type TestWebhookAction = ReturnType<typeof testWebhookStart>;

// Helper function to extract error message from unknown error
const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (error && typeof error === "object") {
    const errorObj = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    return errorObj?.response?.data?.message || errorObj?.message || defaultMessage;
  }
  return defaultMessage;
};

function* fetchPendingTransactionsWorker(
  action: FetchPendingTransactionsAction
): Generator<unknown, void, ApiSuccess<PendingTransactionsResponse>> {
  try {
    const { page = 1, limit = 10, type } = action.payload;

    const response = yield call([walletApi, walletApi.getPendingTransactions], {
      page,
      limit,
      type,
    });

    const transactions = Array.isArray(response.data)
      ? response.data
      : response.data?.transactions || [];

    const rawPagination =
      response.meta ||
      response.data?.pagination || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      };

    const pagination = {
      ...rawPagination,
      totalPages:
        rawPagination.totalPages ||
        (rawPagination.total && rawPagination.limit
          ? Math.ceil(rawPagination.total / rawPagination.limit)
          : 0),
    };

    yield put(
      fetchPendingTransactionsSuccess({
        transactions,
        pagination,
      })
    );
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Failed to fetch pending transactions");
    yield put(fetchPendingTransactionsFailure(message));
    yield put(addToast({ type: "error", message }));
  }
}

function* updateTransactionStatusWorker(
  action: UpdateTransactionStatusAction
): Generator<unknown, void, ApiSuccess<{ transaction: any }>> {
  try {
    const { transactionId, data } = action.payload;

    const response = yield call(
      [walletApi, walletApi.updateTransactionStatus],
      transactionId,
      data
    );

    yield put(
      updateTransactionStatusSuccess({
        transaction: response.data?.transaction,
        message: response.message,
      })
    );

    yield put(addToast({ type: "success", message: response.message || "Cập nhật trạng thái thành công" }));
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Failed to update transaction status");
    yield put(updateTransactionStatusFailure(message));
    yield put(addToast({ type: "error", message }));
  }
}

function* testWebhookWorker(
  action: TestWebhookAction
): Generator<unknown, void, ApiSuccess<{ transaction: any }>> {
  try {
    const { transactionId, amount, status } = action.payload;

    const response = yield call([walletApi, walletApi.testWebhook], {
      transactionId,
      amount,
      status,
    });

    yield put(
      testWebhookSuccess({
        transaction: response.data?.transaction,
        message: response.message,
      })
    );

    yield put(addToast({ type: "success", message: response.message || "Test webhook thành công" }));
  } catch (error: unknown) {
    const message = getErrorMessage(error, "Failed to test webhook");
    yield put(testWebhookFailure(message));
    yield put(addToast({ type: "error", message }));
  }
}

export function* walletSaga() {
  yield takeEvery("wallet/fetchPendingTransactionsStart", fetchPendingTransactionsWorker);
  yield takeEvery("wallet/updateTransactionStatusStart", updateTransactionStatusWorker);
  yield takeEvery("wallet/testWebhookStart", testWebhookWorker);
}

