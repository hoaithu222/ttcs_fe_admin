import { call, put, takeEvery } from "redux-saga/effects";
import { addToast } from "@/app/store/slices/toast";
import { attributeValuesApi } from "@/core/api/attribute-value";
import type { ApiSuccess, AttributeValue } from "@/core/api/attribute-value/type";
import {
  fetchAttributeValuesStart,
  fetchAttributeValuesSuccess,
  fetchAttributeValuesFailure,
  createAttributeValueStart,
  createAttributeValueSuccess,
  createAttributeValueFailure,
  updateAttributeValueStart,
  updateAttributeValueSuccess,
  updateAttributeValueFailure,
  deleteAttributeValueStart,
  deleteAttributeValueSuccess,
  deleteAttributeValueFailure,
} from "./attributeValue.slice";

type FetchAction = ReturnType<typeof fetchAttributeValuesStart>;
type CreateAction = ReturnType<typeof createAttributeValueStart>;
type UpdateAction = ReturnType<typeof updateAttributeValueStart>;
type DeleteAction = ReturnType<typeof deleteAttributeValueStart>;

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error && typeof error === "object") {
    const e: any = error;
    return e?.response?.data?.message || e?.message || fallback;
  }
  return fallback;
};

function* fetchValuesWorker(action: FetchAction): Generator<unknown, void, ApiSuccess<{ attributeValues: AttributeValue[]; pagination: any }>> {
  try {
    const response = yield call([attributeValuesApi, attributeValuesApi.getAttributeValues], action.payload as any);
    const payload = response.data as any;
    const list: AttributeValue[] = Array.isArray(payload.attributeValues)
      ? payload.attributeValues
      : Array.isArray(response.data)
        ? (response.data as unknown as AttributeValue[])
        : [];
    const pagination = payload.pagination || response.meta || { page: 1, limit: 10, total: 0, totalPages: 0 };
    yield put(fetchAttributeValuesSuccess({ attributeValues: list, pagination }));
  } catch (error) {
    const msg = getErrorMessage(error, "Failed to fetch attribute values");
    yield put(fetchAttributeValuesFailure(msg));
    yield put(addToast({ type: "error", message: msg }));
  }
}

function* createValueWorker(action: CreateAction): Generator<unknown, void, ApiSuccess<AttributeValue>> {
  try {
    const response = yield call([attributeValuesApi, attributeValuesApi.createAttributeValue], action.payload.data as any);
    if (response.data) {
      yield put(createAttributeValueSuccess(response.data));
      yield put(addToast({ type: "success", message: "Tạo giá trị thuộc tính thành công" }));
    }
  } catch (error) {
    const msg = getErrorMessage(error, "Failed to create attribute value");
    yield put(createAttributeValueFailure(msg));
    yield put(addToast({ type: "error", message: msg }));
  }
}

function* updateValueWorker(action: UpdateAction): Generator<unknown, void, ApiSuccess<AttributeValue>> {
  try {
    const { id, data } = action.payload as any;
    const response = yield call([attributeValuesApi, attributeValuesApi.updateAttributeValue], id, data);
    if (response.data) {
      yield put(updateAttributeValueSuccess(response.data));
      yield put(addToast({ type: "success", message: "Cập nhật giá trị thuộc tính thành công" }));
    }
  } catch (error) {
    const msg = getErrorMessage(error, "Failed to update attribute value");
    yield put(updateAttributeValueFailure(msg));
    yield put(addToast({ type: "error", message: msg }));
  }
}

function* deleteValueWorker(action: DeleteAction): Generator<unknown, void, ApiSuccess<void>> {
  try {
    const id = action.payload as any;
    yield call([attributeValuesApi, attributeValuesApi.deleteAttributeValue], id);
    yield put(deleteAttributeValueSuccess(id));
    yield put(addToast({ type: "success", message: "Xóa giá trị thuộc tính thành công" }));
  } catch (error) {
    const msg = getErrorMessage(error, "Failed to delete attribute value");
    yield put(deleteAttributeValueFailure(msg));
    yield put(addToast({ type: "error", message: msg }));
  }
}

export function* attributeValueSaga() {
  yield takeEvery("attributeValue/fetchAttributeValuesStart", fetchValuesWorker);
  yield takeEvery("attributeValue/createAttributeValueStart", createValueWorker);
  yield takeEvery("attributeValue/updateAttributeValueStart", updateValueWorker);
  yield takeEvery("attributeValue/deleteAttributeValueStart", deleteValueWorker);
}
