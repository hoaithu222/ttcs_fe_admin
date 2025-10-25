import { PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "@/core/api/auth";
import {
  loginFailed,
  loginSuccess,
  loginUser,
  logoutSuccess,
  logoutUser,
  register,
  registerFailed,
  registerSuccess,
  refreshTokenSuccess,
  refreshTokenFailed,
} from "./auth.slice";
import { all, call, put, takeLatest } from "redux-saga/effects";
import { LoginRequest } from "@/core/api/auth/type";
import { toastUtils } from "@/shared/utils/toast.utils";

function* loginSaga(action: PayloadAction<LoginRequest>): Generator<any, void, any> {
  try {
    const response = yield call(authApi.login, action.payload);

    if (response.success && response.data) {
      // Lưu token vào localStorage
      if (response.data.user.accessToken) {
        localStorage.setItem("accessToken", response.data.user.accessToken);
      }
      if (response.data.user.refreshToken) {
        localStorage.setItem("refreshToken", response.data.user.refreshToken);
      }

      yield put(loginSuccess(response.data.user));
      toastUtils.success("Đăng nhập thành công!");
    } else {
      yield put(loginFailed());
      toastUtils.error(response.message || "Đăng nhập thất bại");
    }
  } catch (error: any) {
    yield put(loginFailed());
    toastUtils.error(error.response?.data?.message || "Đăng nhập thất bại");
  }
}

function* logoutSaga(): Generator<any, void, any> {
  try {
    console.log("Logout saga started");

    // Gọi API logout (nếu có)
    try {
      yield call(authApi.logout);
      console.log("Logout API call successful");
    } catch (apiError) {
      console.warn("Logout API call failed:", apiError);
      // Tiếp tục logout ngay cả khi API call thất bại
    }

    // Xóa token khỏi localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    console.log("Tokens removed from localStorage");

    // Xóa Redux persist data
    localStorage.removeItem("persist:root");
    console.log("Redux persist data removed");

    yield put(logoutSuccess());
    toastUtils.success("Đăng xuất thành công");
    console.log("Logout saga completed successfully - logoutStatus set to SUCCESS");
  } catch (error: any) {
    console.error("Logout saga error:", error);

    // Ngay cả khi có lỗi, vẫn xóa tokens và logout
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("persist:root");

    yield put(logoutSuccess());
    toastUtils.success("Đăng xuất thành công");
    console.log("Logout saga completed with error handling - logoutStatus set to SUCCESS");
  }
}
// Refresh token saga
function* refreshTokenSaga(): Generator<any, void, any> {
  try {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      yield put(refreshTokenFailed());
      yield put(logoutUser());
      return;
    }

    const response = yield call(authApi.refreshToken, refreshToken);

    if (response.success && response.data) {
      // Cập nhật token mới
      if (response.data.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
      }
      if (response.data.refreshToken) {
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }

      yield put(refreshTokenSuccess(response.data));
    } else {
      yield put(refreshTokenFailed());
      yield put(logoutUser());
    }
  } catch (error: any) {
    yield put(refreshTokenFailed());
    yield put(logoutUser());
    toastUtils.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
  }
}

// Đăng ký
function* registerSaga(action: PayloadAction<any>): Generator<any, void, any> {
  try {
    const response = yield call(authApi.register, action.payload);

    if (response.success) {
      yield put(registerSuccess());
      toastUtils.success("Đăng ký thành công");
    } else {
      yield put(registerFailed());
      toastUtils.error(response.message || "Đăng ký thất bại");
    }
  } catch (error: any) {
    yield put(registerFailed());
    toastUtils.error(error.response?.data?.message || "Đăng ký thất bại");
  }
}

function* watchRefreshTokenSaga() {
  yield takeLatest("auth/refreshToken", refreshTokenSaga);
}
function* watchRegisterSaga() {
  yield takeLatest(register.type, registerSaga);
}
function* watchLogoutSaga() {
  yield takeLatest(logoutUser.type, logoutSaga);
}
function* watchLoginSaga() {
  yield takeLatest(loginUser.type, loginSaga);
}

export function* authSaga() {
  yield all([watchLoginSaga(), watchLogoutSaga(), watchRegisterSaga(), watchRefreshTokenSaga()]);
}
