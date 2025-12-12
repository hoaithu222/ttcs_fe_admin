import { call, put, takeEvery } from "redux-saga/effects";
import { usersApi } from "@/core/api/users";
import { addToast } from "@/app/store/slices/toast";
import type {
  fetchUsersStart,
  createUserStart,
  updateUserStart,
  deleteUserStart,
  suspendUserStart,
  unlockUserStart,
} from "./user.slice";
import {
  fetchUsersSuccess,
  fetchUsersFailure,
  createUserSuccess,
  createUserFailure,
  updateUserSuccess,
  updateUserFailure,
  deleteUserSuccess,
  deleteUserFailure,
  suspendUserSuccess,
  suspendUserFailure,
  unlockUserSuccess,
  unlockUserFailure,
} from "./user.slice";
import type { ApiSuccess, User, UserListResponse } from "@/core/api/users/type";

type FetchUsersAction = ReturnType<typeof fetchUsersStart>;
type CreateUserAction = ReturnType<typeof createUserStart>;
type UpdateUserAction = ReturnType<typeof updateUserStart>;
type DeleteUserAction = ReturnType<typeof deleteUserStart>;
type SuspendUserAction = ReturnType<typeof suspendUserStart>;
type UnlockUserAction = ReturnType<typeof unlockUserStart>;

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

function* fetchUsersWorker(
  action: FetchUsersAction
): Generator<unknown, void, ApiSuccess<UserListResponse>> {
  try {
    const { page = 1, limit = 10, search, status, role, sortBy, sortOrder } = action.payload;

    const response = yield call([usersApi, usersApi.getUsers], {
      page,
      limit,
      search,
      status,
      role,
      sortBy,
      sortOrder,
    });

    // Backend returns: { data: { users: User[], pagination: {...} } }
    // or { data: User[], meta: { page, limit, total, totalPages } }
    const users = Array.isArray(response.data)
      ? response.data
      : response.data?.users || [];

    const rawPagination =
      response.meta ||
      response.data?.pagination || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      };

    // Calculate totalPages if not provided
    const pagination = {
      ...rawPagination,
      totalPages:
        rawPagination.totalPages ||
        (rawPagination.total && rawPagination.limit
          ? Math.ceil(rawPagination.total / rawPagination.limit)
          : 0),
    };

    yield put(
      fetchUsersSuccess({
        users,
        pagination,
      })
    );
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, "Failed to fetch users");
    yield put(fetchUsersFailure(errorMessage));
    yield put(
      addToast({
        type: "error",
        message: errorMessage,
      })
    );
  }
}

function* createUserWorker(action: CreateUserAction): Generator<unknown, void, ApiSuccess<User>> {
  try {
    const response = yield call(
      [usersApi, usersApi.updateUser],
      action.payload.id || "",
      action.payload
    );

    if (response.data) {
      yield put(createUserSuccess(response.data));
      yield put(
        addToast({
          type: "success",
          message: "User created successfully",
        })
      );
    }
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, "Failed to create user");
    yield put(createUserFailure(errorMessage));
    yield put(
      addToast({
        type: "error",
        message: errorMessage,
      })
    );
  }
}

function* updateUserWorker(action: UpdateUserAction): Generator<unknown, void, ApiSuccess<User>> {
  try {
    const { id, data } = action.payload;
    const response = yield call([usersApi, usersApi.updateUser], id, data);

    if (response.data) {
      yield put(updateUserSuccess(response.data));
      yield put(
        addToast({
          type: "success",
          message: "User updated successfully",
        })
      );
    }
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, "Failed to update user");
    yield put(updateUserFailure(errorMessage));
    yield put(
      addToast({
        type: "error",
        message: errorMessage,
      })
    );
  }
}

function* deleteUserWorker(action: DeleteUserAction): Generator<unknown, void, ApiSuccess<void>> {
  try {
    const id = action.payload;
    yield call([usersApi, usersApi.deleteUser], id);
    yield put(deleteUserSuccess(id));
    yield put(
      addToast({
        type: "success",
        message: "User deleted successfully",
      })
    );
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, "Failed to delete user");
    yield put(deleteUserFailure(errorMessage));
    yield put(
      addToast({
        type: "error",
        message: errorMessage,
      })
    );
  }
}

function* suspendUserWorker(action: SuspendUserAction): Generator<unknown, void, ApiSuccess<User>> {
  try {
    const id = action.payload;
    const response = yield call([usersApi, usersApi.suspendUser], id);

    if (response.data) {
      yield put(suspendUserSuccess(response.data));
      yield put(
        addToast({
          type: "success",
          message: "Đã khóa người dùng thành công",
        })
      );
    }
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, "Failed to suspend user");
    yield put(suspendUserFailure(errorMessage));
    yield put(
      addToast({
        type: "error",
        message: errorMessage,
      })
    );
  }
}

function* unlockUserWorker(action: UnlockUserAction): Generator<unknown, void, ApiSuccess<User>> {
  try {
    const id = action.payload;
    const response = yield call([usersApi, usersApi.unlockUser], id);

    if (response.data) {
      yield put(unlockUserSuccess(response.data));
      yield put(
        addToast({
          type: "success",
          message: "Đã mở khóa người dùng thành công",
        })
      );
    }
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, "Failed to unlock user");
    yield put(unlockUserFailure(errorMessage));
    yield put(
      addToast({
        type: "error",
        message: errorMessage,
      })
    );
  }
}

export function* userSaga() {
  yield takeEvery("user/fetchUsersStart", fetchUsersWorker);
  yield takeEvery("user/createUserStart", createUserWorker);
  yield takeEvery("user/updateUserStart", updateUserWorker);
  yield takeEvery("user/deleteUserStart", deleteUserWorker);
  yield takeEvery("user/suspendUserStart", suspendUserWorker);
  yield takeEvery("user/unlockUserStart", unlockUserWorker);
}
