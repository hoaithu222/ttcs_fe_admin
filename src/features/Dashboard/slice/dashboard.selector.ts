import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/app/store";

const dashboardState = (state: RootState) => state.dashboard;

export const selectUserStatistics = createSelector(
  [dashboardState],
  (dashboard) => dashboard.userStatistics
);

export const selectProductStatistics = createSelector(
  [dashboardState],
  (dashboard) => dashboard.productStatistics
);

export const selectDashboardLoading = createSelector(
  [dashboardState],
  (dashboard) => dashboard.isLoading
);

export const selectDashboardError = createSelector(
  [dashboardState],
  (dashboard) => dashboard.error
);

export const selectFetchDashboardDataStatus = createSelector(
  [dashboardState],
  (dashboard) => dashboard.fetchDashboardData.status
);

