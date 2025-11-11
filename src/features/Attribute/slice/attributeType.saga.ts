import { call, put, takeEvery } from "redux-saga/effects";
import { addToast } from "@/app/store/slices/toast";
import { attributeTypesApi } from "@/core/api/attribute-type";
import type { ApiSuccess, AttributeType } from "@/core/api/attribute-type/type";
import {
  fetchAttributeTypesStart,
  fetchAttributeTypesSuccess,
  fetchAttributeTypesFailure,
  createAttributeTypeStart,
  createAttributeTypeSuccess,
  createAttributeTypeFailure,
  updateAttributeTypeStart,
  updateAttributeTypeSuccess,
  updateAttributeTypeFailure,
  deleteAttributeTypeStart,
  deleteAttributeTypeSuccess,
  deleteAttributeTypeFailure,
} from "./attributeType.slice";

type FetchAction = ReturnType<typeof fetchAttributeTypesStart>;
type CreateAction = ReturnType<typeof createAttributeTypeStart>;
type UpdateAction = ReturnType<typeof updateAttributeTypeStart>;
type DeleteAction = ReturnType<typeof deleteAttributeTypeStart>;

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error && typeof error === "object") {
    const e: any = error;
    return e?.response?.data?.message || e?.message || fallback;
  }
  return fallback;
};

function* fetchTypesWorker(action: FetchAction): Generator<unknown, void, ApiSuccess<{ attributeTypes: AttributeType[]; pagination: any }>> {
  try {
    const response = yield call([attributeTypesApi, attributeTypesApi.getAttributeTypes], action.payload as any);
    const payload = response.data as any;
    const list: AttributeType[] = Array.isArray(payload.attributeTypes)
      ? payload.attributeTypes
      : Array.isArray(response.data)
        ? (response.data as unknown as AttributeType[])
        : [];
    const pagination = payload.pagination || response.meta || { page: 1, limit: 10, total: 0, totalPages: 0 };
    yield put(fetchAttributeTypesSuccess({ attributeTypes: list, pagination }));
  } catch (error) {
    const msg = getErrorMessage(error, "Failed to fetch attribute types");
    yield put(fetchAttributeTypesFailure(msg));
    yield put(addToast({ type: "error", message: msg }));
  }
}

function* createTypeWorker(action: CreateAction): Generator<unknown, void, ApiSuccess<AttributeType>> {
  try {
    const response = yield call([attributeTypesApi, attributeTypesApi.createAttributeType], action.payload.data as any);
    if (response.data) {
      yield put(createAttributeTypeSuccess(response.data));
      yield put(addToast({ type: "success", message: "Tạo loại thuộc tính thành công" }));
    }
  } catch (error) {
    const msg = getErrorMessage(error, "Failed to create attribute type");
    yield put(createAttributeTypeFailure(msg));
    yield put(addToast({ type: "error", message: msg }));
  }
}

function* updateTypeWorker(action: UpdateAction): Generator<unknown, void, ApiSuccess<AttributeType>> {
  try {
    const { id, data } = action.payload as any;
    const response = yield call([attributeTypesApi, attributeTypesApi.updateAttributeType], id, data);
    if (response.data) {
      yield put(updateAttributeTypeSuccess(response.data));
      yield put(addToast({ type: "success", message: "Cập nhật loại thuộc tính thành công" }));
    }
  } catch (error) {
    const msg = getErrorMessage(error, "Failed to update attribute type");
    yield put(updateAttributeTypeFailure(msg));
    yield put(addToast({ type: "error", message: msg }));
  }
}

function* deleteTypeWorker(action: DeleteAction): Generator<unknown, void, ApiSuccess<void>> {
  try {
    const id = action.payload as any;
    yield call([attributeTypesApi, attributeTypesApi.deleteAttributeType], id);
    yield put(deleteAttributeTypeSuccess(id));
    yield put(addToast({ type: "success", message: "Xóa loại thuộc tính thành công" }));
  } catch (error) {
    const msg = getErrorMessage(error, "Failed to delete attribute type");
    yield put(deleteAttributeTypeFailure(msg));
    yield put(addToast({ type: "error", message: msg }));
  }
}

export function* attributeTypeSaga() {
  yield takeEvery("attributeType/fetchAttributeTypesStart", fetchTypesWorker);
  yield takeEvery("attributeType/createAttributeTypeStart", createTypeWorker);
  yield takeEvery("attributeType/updateAttributeTypeStart", updateTypeWorker);
  yield takeEvery("attributeType/deleteAttributeTypeStart", deleteTypeWorker);
}


