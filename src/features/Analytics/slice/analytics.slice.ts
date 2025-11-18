import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AnalyticsState } from "./analytics.type";
import {
  RevenueData,
  TimeSeriesData,
  TopProduct,
  TopShop,
  OrderStatusDistribution as OrderStatusDistributionItem,
  AverageOrderValue,
  AnalyticsQuery,
} from "@/core/api/analytics/type";
import { ReduxStateType } from "@/app/store/types";

const initialState: AnalyticsState = {
  adminRevenue: null,
  revenueTimeSeries: [],
  topProducts: [],
  topShops: [],
  orderStatusDistribution: null,
  averageOrderValue: null,
  isLoading: false,
  error: null,
  fetchAnalyticsData: {
    status: ReduxStateType.INIT,
    error: null,
    message: null,
  },
  filters: {},
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    // Saga triggers
    fetchAnalyticsDataStart: (state, action: PayloadAction<AnalyticsQuery | undefined>) => {
      state.isLoading = true;
      state.error = null;
      state.fetchAnalyticsData.status = ReduxStateType.LOADING;
      state.fetchAnalyticsData.error = null;
      state.fetchAnalyticsData.message = null;
      if (action.payload) {
        state.filters = { ...state.filters, ...action.payload };
      }
    },
    fetchAnalyticsDataSuccess: (
      state,
      action: PayloadAction<{
        adminRevenue?: RevenueData;
        revenueTimeSeries?: TimeSeriesData[];
        topProducts?: TopProduct[];
        topShops?: TopShop[];
        orderStatusDistribution?: OrderStatusDistributionItem[];
        averageOrderValue?: AverageOrderValue;
      }>
    ) => {
      state.isLoading = false;
      state.error = null;
      state.fetchAnalyticsData.status = ReduxStateType.SUCCESS;
      state.fetchAnalyticsData.error = null;
      state.fetchAnalyticsData.message = null;

      if (action.payload.adminRevenue) {
        state.adminRevenue = action.payload.adminRevenue;
      }
      if (action.payload.revenueTimeSeries) {
        state.revenueTimeSeries = action.payload.revenueTimeSeries;
      }
      if (action.payload.topProducts) {
        state.topProducts = action.payload.topProducts;
      }
      if (action.payload.topShops) {
        state.topShops = action.payload.topShops;
      }
      if (action.payload.orderStatusDistribution) {
        state.orderStatusDistribution = action.payload.orderStatusDistribution;
      }
      if (action.payload.averageOrderValue) {
        state.averageOrderValue = action.payload.averageOrderValue;
      }
    },
    fetchAnalyticsDataFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.fetchAnalyticsData.status = ReduxStateType.ERROR;
      state.fetchAnalyticsData.error = action.payload;
      state.fetchAnalyticsData.message = action.payload;
    },
    setFilters: (state, action: PayloadAction<AnalyticsQuery>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    resetState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.fetchAnalyticsData.status = ReduxStateType.INIT;
      state.fetchAnalyticsData.error = null;
      state.fetchAnalyticsData.message = null;
      state.filters = {};
    },
  },
});

export const {
  fetchAnalyticsDataStart,
  fetchAnalyticsDataSuccess,
  fetchAnalyticsDataFailure,
  setFilters,
  clearError,
  resetState,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;

