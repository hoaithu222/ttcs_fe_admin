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
      const user = response.data.user;
      const userRole = user?.role;

      // Kiểm tra quyền admin - chỉ cho phép admin và moderator đăng nhập
      const isAdmin = userRole === "admin" || userRole === "moderator";

      if (!isAdmin) {
        // Không phải admin, không cho đăng nhập
        yield put(loginFailed());
        toastUtils.error("Bạn không có quyền truy cập. Chỉ có Admin mới được phép đăng nhập vào hệ thống này.");
        return;
      }

      // Lưu token vào localStorage (chỉ khi là admin)
      if (user.accessToken) {
        localStorage.setItem("accessToken", user.accessToken);
      }
      if (user.refreshToken) {
        localStorage.setItem("refreshToken", user.refreshToken);
      }
      
      // Lưu role vào localStorage để middleware có thể lấy ngay
      if (userRole) {
        localStorage.setItem("userRole", userRole);
      }

      yield put(loginSuccess(user));
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

    // Xóa token và role khỏi localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    console.log("Tokens and role removed from localStorage");

    // Xóa Redux persist data
    localStorage.removeItem("persist:root");
    console.log("Redux persist data removed");

    yield put(logoutSuccess());
    toastUtils.success("Đăng xuất thành công");
    console.log("Logout saga completed successfully - logoutStatus set to SUCCESS");
  } catch (error: any) {
    console.error("Logout saga error:", error);

    // Ngay cả khi có lỗi, vẫn xóa tokens, role và logout
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
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
      // Lấy thông tin user từ Redux store để check role
      // Nếu không có user trong store, cần lấy từ token hoặc API
      const persistData = localStorage.getItem("persist:root");
      let userRole: string | null = null;

      if (persistData) {
        try {
          const parsedPersist = JSON.parse(persistData);
          const authData = parsedPersist.auth ? JSON.parse(parsedPersist.auth) : null;
          const user = authData?.user;
          if (user && typeof user === 'object') {
            // Lấy role từ user object
            if (user.data?.user?.role && typeof user.data.user.role === 'string') {
              userRole = user.data.user.role;
            } else if (user.role && typeof user.role === 'string') {
              userRole = user.role;
            }
          }
        } catch (parseError) {
          console.warn("Error parsing persist data in refreshTokenSaga:", parseError);
        }
      }

      // Kiểm tra quyền admin - chỉ cho phép admin và moderator
      const isAdmin = userRole === "admin" || userRole === "moderator";

      if (!isAdmin) {
        // Không phải admin, logout
        yield put(refreshTokenFailed());
        yield put(logoutUser());
        toastUtils.error("Bạn không có quyền truy cập. Chỉ có Admin mới được phép đăng nhập vào hệ thống này.");
        return;
      }

      // Cập nhật token mới (chỉ khi là admin)
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
