import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DashboardState } from "./dashboard.type";
import { UserStatistics, ProductStatistics } from "@/core/api/admin/type";
import { ReduxStateType } from "@/app/store/types";

const initialState: DashboardState = {
  userStatistics: null,
  productStatistics: null,
  isLoading: false,
  error: null,
  fetchDashboardData: {
    status: ReduxStateType.INIT,
    error: null,
    message: null,
  },
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    // Saga triggers
    fetchDashboardDataStart: (state) => {
      state.isLoading = true;
      state.error = null;
      state.fetchDashboardData.status = ReduxStateType.LOADING;
      state.fetchDashboardData.error = null;
      state.fetchDashboardData.message = null;
    },
    fetchDashboardDataSuccess: (
      state,
      action: PayloadAction<{
        userStatistics?: UserStatistics;
        productStatistics?: ProductStatistics;
      }>
    ) => {
      state.isLoading = false;
      state.error = null;
      state.fetchDashboardData.status = ReduxStateType.SUCCESS;
      state.fetchDashboardData.error = null;
      state.fetchDashboardData.message = null;

      if (action.payload.userStatistics) {
        state.userStatistics = action.payload.userStatistics;
      }
      if (action.payload.productStatistics) {
        state.productStatistics = action.payload.productStatistics;
      }
    },
    fetchDashboardDataFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.fetchDashboardData.status = ReduxStateType.ERROR;
      state.fetchDashboardData.error = action.payload;
      state.fetchDashboardData.message = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.fetchDashboardData.status = ReduxStateType.INIT;
      state.fetchDashboardData.error = null;
      state.fetchDashboardData.message = null;
    },
  },
});

export const {
  fetchDashboardDataStart,
  fetchDashboardDataSuccess,
  fetchDashboardDataFailure,
  clearError,
  resetState,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;

