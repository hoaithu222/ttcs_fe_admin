import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/app/store";

const analyticsState = (state: RootState) => state.analytics;

export const selectAdminRevenue = createSelector(
  [analyticsState],
  (analytics) => analytics.adminRevenue
);

export const selectRevenueTimeSeries = createSelector(
  [analyticsState],
  (analytics) => analytics.revenueTimeSeries
);

export const selectTopProducts = createSelector(
  [analyticsState],
  (analytics) => analytics.topProducts
);

export const selectTopShops = createSelector([analyticsState], (analytics) => analytics.topShops);

export const selectOrderStatusDistribution = createSelector(
  [analyticsState],
  (analytics) => analytics.orderStatusDistribution
);

export const selectAverageOrderValue = createSelector(
  [analyticsState],
  (analytics) => analytics.averageOrderValue
);

export const selectAnalyticsLoading = createSelector(
  [analyticsState],
  (analytics) => analytics.isLoading
);

export const selectAnalyticsError = createSelector(
  [analyticsState],
  (analytics) => analytics.error
);

export const selectAnalyticsFilters = createSelector(
  [analyticsState],
  (analytics) => analytics.filters
);

export const selectFetchAnalyticsDataStatus = createSelector(
  [analyticsState],
  (analytics) => analytics.fetchAnalyticsData.status
);

