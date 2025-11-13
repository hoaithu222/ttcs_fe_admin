import { call, put, takeEvery } from "redux-saga/effects";
import { shopsApi } from "@/core/api/shops";
import { addToast } from "@/app/store/slices/toast";
import type {
  fetchShopsStart,
  createShopStart,
  updateShopStart,
  deleteShopStart,
  approveShopStart,
  rejectShopStart,
  suspendShopStart,
} from "./Shop.slice";
import {
  fetchShopsSuccess,
  fetchShopsFailure,
  createShopSuccess,
  createShopFailure,
  updateShopSuccess,
  updateShopFailure,
  deleteShopSuccess,
  deleteShopFailure,
  approveShopSuccess,
  approveShopFailure,
  rejectShopSuccess,
  rejectShopFailure,
  suspendShopSuccess,
  suspendShopFailure,
} from "./Shop.slice";
import type { ApiSuccess, Shop, ShopListResponse } from "@/core/api/shops/type";

type FetchShopsAction = ReturnType<typeof fetchShopsStart>;
type CreateShopAction = ReturnType<typeof createShopStart>;
type UpdateShopAction = ReturnType<typeof updateShopStart>;
type DeleteShopAction = ReturnType<typeof deleteShopStart>;
type ApproveShopAction = ReturnType<typeof approveShopStart>;
type RejectShopAction = ReturnType<typeof rejectShopStart>;
type SuspendShopAction = ReturnType<typeof suspendShopStart>;

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

function* fetchShopsWorker(
  action: FetchShopsAction
): Generator<unknown, void, ApiSuccess<ShopListResponse>> {
  try {
    const { page = 1, limit = 10, search, status, isActive, isVerified } = action.payload;

    const response = yield call([shopsApi, shopsApi.getShops], {
      page,
      limit,
      search,
      status,
      isActive,
      isVerified,
    });

    // Backend returns: { data: Shop[], meta: { page, limit, total, totalPages } }
    // or { data: { shops: Shop[], pagination: {...} } }
    const shops = Array.isArray(response.data) ? response.data : response.data?.shops || [];

    const pagination = response.meta ||
      response.data?.pagination || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      };

    yield put(
      fetchShopsSuccess({
        shops,
        pagination,
      })
    );
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, "Failed to fetch shops");
    yield put(fetchShopsFailure(errorMessage));
    yield put(
      addToast({
        type: "error",
        message: errorMessage,
      })
    );
  }
}

function* createShopWorker(action: CreateShopAction): Generator<unknown, void, ApiSuccess<Shop>> {
  try {
    const response = yield call([shopsApi, shopsApi.createShop], action.payload);

    if (response.data) {
      yield put(createShopSuccess(response.data));
      yield put(
        addToast({
          type: "success",
          message: "Shop created successfully",
        })
      );
    }
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, "Failed to create shop");
    yield put(createShopFailure(errorMessage));
    yield put(
      addToast({
        type: "error",
        message: errorMessage,
      })
    );
  }
}

function* updateShopWorker(action: UpdateShopAction): Generator<unknown, void, ApiSuccess<Shop>> {
  try {
    const { id, data } = action.payload;
    const response = yield call([shopsApi, shopsApi.updateShop], id, data);

    if (response.data) {
      yield put(updateShopSuccess(response.data));
      yield put(
        addToast({
          type: "success",
          message: "Shop updated successfully",
        })
      );
    }
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, "Failed to update shop");
    yield put(updateShopFailure(errorMessage));
    yield put(
      addToast({
        type: "error",
        message: errorMessage,
      })
    );
  }
}

function* deleteShopWorker(action: DeleteShopAction): Generator<unknown, void, ApiSuccess<void>> {
  try {
    const id = action.payload;
    yield call([shopsApi, shopsApi.deleteShop], id);
    yield put(deleteShopSuccess(id));
    yield put(
      addToast({
        type: "success",
        message: "Shop deleted successfully",
      })
    );
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, "Failed to delete shop");
    yield put(deleteShopFailure(errorMessage));
    yield put(
      addToast({
        type: "error",
        message: errorMessage,
      })
    );
  }
}

function* approveShopWorker(action: ApproveShopAction): Generator<unknown, void, ApiSuccess<Shop>> {
  try {
    const id = action.payload;
    const response = yield call([shopsApi, shopsApi.approveShop], id);

    if (response.data) {
      yield put(approveShopSuccess(response.data));
      yield put(
        addToast({
          type: "success",
          message: "Shop approved successfully",
        })
      );
    }
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, "Failed to approve shop");
    yield put(approveShopFailure(errorMessage));
    yield put(
      addToast({
        type: "error",
        message: errorMessage,
      })
    );
  }
}

function* rejectShopWorker(action: RejectShopAction): Generator<unknown, void, ApiSuccess<Shop>> {
  try {
    const id = action.payload;
    const response = yield call([shopsApi, shopsApi.rejectShop], id);

    if (response.data) {
      yield put(rejectShopSuccess(response.data));
      yield put(
        addToast({
          type: "success",
          message: "Shop rejected successfully",
        })
      );
    }
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, "Failed to reject shop");
    yield put(rejectShopFailure(errorMessage));
    yield put(
      addToast({
        type: "error",
        message: errorMessage,
      })
    );
  }
}

function* suspendShopWorker(action: SuspendShopAction): Generator<unknown, void, ApiSuccess<Shop>> {
  try {
    const id = action.payload;
    const response = yield call([shopsApi, shopsApi.suspendShop], id);

    if (response.data) {
      yield put(suspendShopSuccess(response.data));
      yield put(
        addToast({
          type: "success",
          message: "Shop suspended successfully",
        })
      );
    }
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, "Failed to suspend shop");
    yield put(suspendShopFailure(errorMessage));
    yield put(
      addToast({
        type: "error",
        message: errorMessage,
      })
    );
  }
}

export function* shopSaga() {
  yield takeEvery("shop/fetchShopsStart", fetchShopsWorker);
  yield takeEvery("shop/createShopStart", createShopWorker);
  yield takeEvery("shop/updateShopStart", updateShopWorker);
  yield takeEvery("shop/deleteShopStart", deleteShopWorker);
  yield takeEvery("shop/approveShopStart", approveShopWorker);
  yield takeEvery("shop/rejectShopStart", rejectShopWorker);
  yield takeEvery("shop/suspendShopStart", suspendShopWorker);
}
