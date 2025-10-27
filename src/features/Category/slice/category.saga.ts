import { call, put, takeEvery } from "redux-saga/effects";
import { categoriesApi } from "@/core/api/categories";
import { addToast } from "@/app/store/slices/toast";
import type {
  fetchCategoriesStart,
  createCategoryStart,
  updateCategoryStart,
  deleteCategoryStart,
} from "./category.slice";
import {
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  createCategorySuccess,
  createCategoryFailure,
  updateCategorySuccess,
  updateCategoryFailure,
  deleteCategorySuccess,
  deleteCategoryFailure,
} from "./category.slice";
import type { ApiSuccess, Category } from "@/core/api/categories/type";

type FetchCategoriesAction = ReturnType<typeof fetchCategoriesStart>;
type CreateCategoryAction = ReturnType<typeof createCategoryStart>;
type UpdateCategoryAction = ReturnType<typeof updateCategoryStart>;
type DeleteCategoryAction = ReturnType<typeof deleteCategoryStart>;

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

function* fetchCategoriesWorker(
  action: FetchCategoriesAction
): Generator<unknown, void, ApiSuccess<Category[]>> {
  try {
    const { page = 1, limit = 10, search, isActive } = action.payload;

    // Bind the context to ensure 'this' is properly set
    const response = yield call([categoriesApi, categoriesApi.getCategories], {
      page,
      limit,
      search,
      isActive,
    });

    // Backend returns: { data: Category[], meta: { page, limit, total, totalPages } }
    yield put(
      fetchCategoriesSuccess({
        categories: Array.isArray(response.data) ? response.data : [],
        pagination: response.meta || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      })
    );
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, "Failed to fetch categories");
    yield put(fetchCategoriesFailure(errorMessage));
    yield put(
      addToast({
        type: "error",
        message: errorMessage,
      })
    );
  }
}

function* createCategoryWorker(
  action: CreateCategoryAction
): Generator<unknown, void, ApiSuccess<Category>> {
  try {
    const response = yield call([categoriesApi, categoriesApi.createCategory], action.payload);

    if (response.data) {
      yield put(createCategorySuccess(response.data));
      yield put(
        addToast({
          type: "success",
          message: "Category created successfully",
        })
      );
    }
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, "Failed to create category");
    yield put(createCategoryFailure(errorMessage));
    yield put(
      addToast({
        type: "error",
        message: errorMessage,
      })
    );
  }
}

function* updateCategoryWorker(
  action: UpdateCategoryAction
): Generator<unknown, void, ApiSuccess<Category>> {
  try {
    const { id, data } = action.payload;
    const response = yield call([categoriesApi, categoriesApi.updateCategory], id, data);

    if (response.data) {
      yield put(updateCategorySuccess(response.data));
      yield put(
        addToast({
          type: "success",
          message: "Category updated successfully",
        })
      );
    }
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, "Failed to update category");
    yield put(updateCategoryFailure(errorMessage));
    yield put(
      addToast({
        type: "error",
        message: errorMessage,
      })
    );
  }
}

function* deleteCategoryWorker(
  action: DeleteCategoryAction
): Generator<unknown, void, ApiSuccess<void>> {
  try {
    const id = action.payload;
    yield call([categoriesApi, categoriesApi.deleteCategory], id);
    yield put(deleteCategorySuccess(id));
    yield put(
      addToast({
        type: "success",
        message: "Category deleted successfully",
      })
    );
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, "Failed to delete category");
    yield put(deleteCategoryFailure(errorMessage));
    yield put(
      addToast({
        type: "error",
        message: errorMessage,
      })
    );
  }
}

export function* categorySaga() {
  yield takeEvery("category/fetchCategoriesStart", fetchCategoriesWorker);
  yield takeEvery("category/createCategoryStart", createCategoryWorker);
  yield takeEvery("category/updateCategoryStart", updateCategoryWorker);
  yield takeEvery("category/deleteCategoryStart", deleteCategoryWorker);
}
