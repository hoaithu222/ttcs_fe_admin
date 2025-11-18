import { call, put, takeEvery, all } from "redux-saga/effects";
import { adminApi } from "@/core/api/admin";
import { addToast } from "@/app/store/slices/toast";
import type { fetchDashboardDataStart } from "./dashboard.slice";
import { fetchDashboardDataSuccess, fetchDashboardDataFailure } from "./dashboard.slice";
import type { ApiSuccess } from "@/core/api/admin/type";

type FetchDashboardDataAction = ReturnType<typeof fetchDashboardDataStart>;

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

function* fetchDashboardDataWorker(
  action: FetchDashboardDataAction
): Generator<unknown, void, any> {
  try {
    console.log("🚀 [Dashboard Saga] Fetching dashboard data");
    
    // Fetch dashboard data in parallel using redux-saga all
    const [userStatsResponse, productStatsResponse] = yield all([
      call([adminApi, adminApi.getUserStatistics]),
      call([adminApi, adminApi.getProductStatistics]),
    ]);

    console.log("📦 [Dashboard Saga] API Responses:", {
      userStats: userStatsResponse,
      productStats: productStatsResponse,
    });

    const dashboardData = {
      userStatistics: userStatsResponse.data || userStatsResponse,
      productStatistics: productStatsResponse.data || productStatsResponse,
    };

    console.log("✅ [Dashboard Saga] Processed dashboard data:", dashboardData);
    yield put(fetchDashboardDataSuccess(dashboardData));
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, "Failed to fetch dashboard data");
    yield put(fetchDashboardDataFailure(errorMessage));
    yield put(
      addToast({
        type: "error",
        message: errorMessage,
      })
    );
  }
}

export function* dashboardSaga() {
  yield takeEvery("dashboard/fetchDashboardDataStart", fetchDashboardDataWorker);
}

