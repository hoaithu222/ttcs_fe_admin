import { call, put, takeEvery } from "redux-saga/effects";
import { homeApi } from "@/core/api/home";
import { addToast } from "@/app/store/slices/toast";
import {
  fetchConfigurationsStart,
  fetchConfigurationsSuccess,
  fetchConfigurationsFailure,
  fetchConfigurationByIdStart,
  fetchConfigurationByIdSuccess,
  fetchConfigurationByIdFailure,
  createConfigurationStart,
  createConfigurationSuccess,
  createConfigurationFailure,
  updateConfigurationStart,
  updateConfigurationSuccess,
  updateConfigurationFailure,
  deleteConfigurationStart,
  deleteConfigurationSuccess,
  deleteConfigurationFailure,
} from "./home-configuration.slice";
import type {
  FetchConfigurationByIdPayload,
  CreateConfigurationPayload,
  UpdateConfigurationPayload,
  DeleteConfigurationPayload,
} from "./home-configuration.type";

// Helper function to extract error message
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

// Fetch all configurations
function* fetchConfigurationsWorker(): Generator<unknown, void, any> {
  try {
    const response = yield call([homeApi, homeApi.getAllConfigurations]);
    yield put(fetchConfigurationsSuccess(response.data?.configurations || []));
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, "Không thể tải danh sách cấu hình");
    yield put(fetchConfigurationsFailure(errorMessage));
    yield put(
      addToast({
        type: "error",
        message: errorMessage,
      })
    );
  }
}

// Fetch configuration by ID
function* fetchConfigurationByIdWorker(
  action: ReturnType<typeof fetchConfigurationByIdStart>
): Generator<unknown, void, any> {
  try {
    const payload = action.payload as unknown as FetchConfigurationByIdPayload;
    const response = yield call([homeApi, homeApi.getConfigurationById], payload.id);
    yield put(fetchConfigurationByIdSuccess(response.data));
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, "Không thể tải cấu hình");
    yield put(fetchConfigurationByIdFailure(errorMessage));
    yield put(
      addToast({
        type: "error",
        message: errorMessage,
      })
    );
  }
}

// Create configuration
function* createConfigurationWorker(
  action: ReturnType<typeof createConfigurationStart>
): Generator<unknown, void, any> {
  try {
    const payload = action.payload as unknown as CreateConfigurationPayload;
    const response = yield call([homeApi, homeApi.createConfiguration], payload);
    yield put(createConfigurationSuccess(response.data));
    yield put(
      addToast({
        type: "success",
        message: "Tạo cấu hình thành công",
      })
    );
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, "Không thể tạo cấu hình");
    yield put(createConfigurationFailure(errorMessage));
    yield put(
      addToast({
        type: "error",
        message: errorMessage,
      })
    );
  }
}

// Update configuration
function* updateConfigurationWorker(
  action: ReturnType<typeof updateConfigurationStart>
): Generator<unknown, void, any> {
  try {
    const payload = action.payload as unknown as UpdateConfigurationPayload;
    const response = yield call(
      [homeApi, homeApi.updateConfiguration],
      payload.id,
      payload.data
    );
    yield put(updateConfigurationSuccess(response.data));
    yield put(
      addToast({
        type: "success",
        message: "Cập nhật cấu hình thành công",
      })
    );
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, "Không thể cập nhật cấu hình");
    yield put(updateConfigurationFailure(errorMessage));
    yield put(
      addToast({
        type: "error",
        message: errorMessage,
      })
    );
  }
}

// Delete configuration
function* deleteConfigurationWorker(
  action: ReturnType<typeof deleteConfigurationStart>
): Generator<unknown, void, any> {
  try {
    const payload = action.payload as unknown as DeleteConfigurationPayload;
    yield call([homeApi, homeApi.deleteConfiguration], payload.id);
    yield put(deleteConfigurationSuccess(payload.id));
    yield put(
      addToast({
        type: "success",
        message: "Xóa cấu hình thành công",
      })
    );
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, "Không thể xóa cấu hình");
    yield put(deleteConfigurationFailure(errorMessage));
    yield put(
      addToast({
        type: "error",
        message: errorMessage,
      })
    );
  }
}

export function* homeConfigurationSaga() {
  yield takeEvery("homeConfiguration/fetchConfigurationsStart", fetchConfigurationsWorker);
  yield takeEvery("homeConfiguration/fetchConfigurationByIdStart", fetchConfigurationByIdWorker);
  yield takeEvery("homeConfiguration/createConfigurationStart", createConfigurationWorker);
  yield takeEvery("homeConfiguration/updateConfigurationStart", updateConfigurationWorker);
  yield takeEvery("homeConfiguration/deleteConfigurationStart", deleteConfigurationWorker);
}

