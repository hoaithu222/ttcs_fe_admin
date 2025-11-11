import { call, put, takeEvery } from "redux-saga/effects";
import { subCategoriesApi } from "@/core/api/sub-categories";
import { addToast } from "@/app/store/slices/toast";
import type {
  fetchSubCategoriesStart,
  createSubCategoryStart,
  updateSubCategoryStart,
  deleteSubCategoryStart,
} from "./subCategory.slice";
import {
  fetchSubCategoriesSuccess,
  fetchSubCategoriesFailure,
  createSubCategorySuccess,
  createSubCategoryFailure,
  updateSubCategorySuccess,
  updateSubCategoryFailure,
  deleteSubCategorySuccess,
  deleteSubCategoryFailure,
} from "./subCategory.slice";
import type { ApiSuccess, SubCategory } from "@/core/api/sub-categories/type";

type FetchSubCategoriesAction = ReturnType<typeof fetchSubCategoriesStart>;
type CreateSubCategoryAction = ReturnType<typeof createSubCategoryStart>;
type UpdateSubCategoryAction = ReturnType<typeof updateSubCategoryStart>;
type DeleteSubCategoryAction = ReturnType<typeof deleteSubCategoryStart>;

const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (error && typeof error === "object") {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    return err?.response?.data?.message || err?.message || defaultMessage;
  }
  return defaultMessage;
};

function* fetchSubCategoriesWorker(
  action: FetchSubCategoriesAction
): Generator<unknown, void, ApiSuccess<any>> {
  try {
    const { page = 1, limit = 10, search, isActive, parentId } = action.payload;
    const response: any = yield (call as any)(
      [subCategoriesApi as any, (subCategoriesApi as any).getSubCategories],
      {
        page,
        limit,
        search,
        isActive,
        parentId,
        categoryId: parentId, // support backend expecting categoryId
      }
    );
    // Support two shapes:
    // 1) { data: { subCategories, pagination } }
    // 2) { data: SubCategory[], meta: { page, limit, total, totalPages } }
    const payload = response?.data ?? {};
    const list = Array.isArray(response?.data)
      ? response.data
      : Array.isArray(payload?.subCategories)
        ? payload.subCategories
        : [];
    const pagination = response?.meta ||
      payload?.pagination || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      };
    yield put(
      fetchSubCategoriesSuccess({
        subCategories: list,
        pagination,
      })
    );
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, "Failed to fetch sub categories");
    yield put(fetchSubCategoriesFailure(errorMessage));
    yield put(addToast({ type: "error", message: errorMessage }));
  }
}

function* createSubCategoryWorker(
  action: CreateSubCategoryAction
): Generator<unknown, void, ApiSuccess<SubCategory>> {
  try {
    const response = yield call(
      [subCategoriesApi, subCategoriesApi.createSubCategory],
      action.payload
    );
    if (response.data) {
      yield put(createSubCategorySuccess(response.data));
      yield put(addToast({ type: "success", message: "Sub category created successfully" }));
    }
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, "Failed to create sub category");
    yield put(createSubCategoryFailure(errorMessage));
    yield put(addToast({ type: "error", message: errorMessage }));
  }
}

function* updateSubCategoryWorker(
  action: UpdateSubCategoryAction
): Generator<unknown, void, ApiSuccess<SubCategory>> {
  try {
    const { id, data } = action.payload;
    const response = yield call([subCategoriesApi, subCategoriesApi.updateSubCategory], id, data);
    if (response.data) {
      yield put(updateSubCategorySuccess(response.data));
      yield put(addToast({ type: "success", message: "Sub category updated successfully" }));
    }
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, "Failed to update sub category");
    yield put(updateSubCategoryFailure(errorMessage));
    yield put(addToast({ type: "error", message: errorMessage }));
  }
}

function* deleteSubCategoryWorker(
  action: DeleteSubCategoryAction
): Generator<unknown, void, ApiSuccess<void>> {
  try {
    const id = action.payload;
    yield call([subCategoriesApi, subCategoriesApi.deleteSubCategory], id);
    yield put(deleteSubCategorySuccess(id));
    yield put(addToast({ type: "success", message: "Sub category deleted successfully" }));
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, "Failed to delete sub category");
    yield put(deleteSubCategoryFailure(errorMessage));
    yield put(addToast({ type: "error", message: errorMessage }));
  }
}

export function* subCategorySaga() {
  yield takeEvery("subCategory/fetchSubCategoriesStart", fetchSubCategoriesWorker);
  yield takeEvery("subCategory/createSubCategoryStart", createSubCategoryWorker);
  yield takeEvery("subCategory/updateSubCategoryStart", updateSubCategoryWorker);
  yield takeEvery("subCategory/deleteSubCategoryStart", deleteSubCategoryWorker);
}
