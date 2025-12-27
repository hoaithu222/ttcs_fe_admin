import { call, put, takeEvery } from "redux-saga/effects";
import { productsApi } from "@/core/api/products";
import { addToast } from "@/app/store/slices/toast";
import type {
  fetchProductsStart,
  updateProductStatusStart,
} from "./product.slice";
import {
  fetchProductsSuccess,
  fetchProductsFailure,
  updateProductStatusSuccess,
  updateProductStatusFailure,
} from "./product.slice";

type FetchProductsAction = ReturnType<typeof fetchProductsStart>;
type UpdateProductStatusAction = ReturnType<typeof updateProductStatusStart>;

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

function* fetchProductsWorker(
  action: FetchProductsAction
): Generator<unknown, void, any> {
  try {
    const { page = 1, limit = 20, search, status } = action.payload;

    console.log("=== fetchProductsWorker START ===");
    console.log("Request:", { page, limit, search, status });

    const response = yield call([productsApi, productsApi.getProducts], {
      page,
      limit,
      search,
      status,
    });

    console.log("API Response:", response);

    // Backend returns: { data: items[], meta: { page, limit, total, totalPages } }
    const pagination = response.meta || {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
    };

    const productsData = Array.isArray(response.data) ? response.data : [];

    console.log("Extracted pagination:", pagination);
    console.log("Products count:", productsData.length);

    yield put(
      fetchProductsSuccess({
        products: Array.isArray(productsData) ? productsData : [],
        pagination,
      })
    );
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, "Failed to fetch products");
    console.error("=== fetchProductsWorker ERROR ===", errorMessage, error);
    yield put(
      addToast({
        type: "error",
        message: errorMessage,
      })
    );
  }
}

function* updateProductStatusWorker(
  action: UpdateProductStatusAction
): Generator<unknown, void, any> {
  try {
    const { id, status, violationNote } = action.payload;
    const response = yield call([productsApi, productsApi.updateProductStatus], id, {
      status,
      violationNote,
    });

    if (response.data) {
      yield put(updateProductStatusSuccess(response.data));
      yield put(
        addToast({
          type: "success",
          message: `Product ${status} successfully`,
        })
      );
    }
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, "Failed to update product status");
    yield put(updateProductStatusFailure(errorMessage));
    yield put(
      addToast({
        type: "error",
        message: errorMessage,
      })
    );
  }
}

export function* productSaga() {
  yield takeEvery("product/fetchProductsStart", fetchProductsWorker);
  yield takeEvery("product/updateProductStatusStart", updateProductStatusWorker);
}
