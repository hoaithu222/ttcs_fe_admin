import { call, put, takeEvery, all } from "redux-saga/effects";
import { analyticsApi } from "@/core/api/analytics";
import { addToast } from "@/app/store/slices/toast";
import type { fetchAnalyticsDataStart } from "./analytics.slice";
import { fetchAnalyticsDataSuccess, fetchAnalyticsDataFailure } from "./analytics.slice";

type FetchAnalyticsDataAction = ReturnType<typeof fetchAnalyticsDataStart>;

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

function* fetchAnalyticsDataWorker(
  action: FetchAnalyticsDataAction
): Generator<unknown, void, any> {
  try {
    const query = action.payload || {};
    console.log("🚀 [Analytics Saga] Fetching analytics data with query:", query);

    // Fetch analytics data in parallel using redux-saga all
    const [
      adminRevenueResponse,
      revenueTimeSeriesResponse,
      topProductsResponse,
      topShopsResponse,
      orderStatusResponse,
      aovResponse,
    ] = yield all([
      call([analyticsApi, analyticsApi.getAdminRevenue], query),
      call([analyticsApi, analyticsApi.getRevenueTimeSeries], query),
      call([analyticsApi, analyticsApi.getTopProducts], query),
      call([analyticsApi, analyticsApi.getTopShops], query),
      call([analyticsApi, analyticsApi.getOrderStatusDistribution]),
      call([analyticsApi, analyticsApi.getAverageOrderValue], query),
    ]);

    // Handle admin revenue - backend returns { items, totals }
    const adminRevenueData = adminRevenueResponse.data;
    const revenueData = adminRevenueData?.totals
      ? {
          totalRevenue: adminRevenueData.totals.netRevenue || 0,
          period: "all",
          growthRate: 0,
          previousPeriodRevenue: 0,
        }
      : undefined;

    // Handle time series - backend returns array directly
    const timeSeriesData = Array.isArray(revenueTimeSeriesResponse.data)
      ? revenueTimeSeriesResponse.data
      : revenueTimeSeriesResponse.data?.data || [];

    // Handle top products - backend returns array directly
    const topProductsData = Array.isArray(topProductsResponse.data)
      ? topProductsResponse.data
      : topProductsResponse.data?.products || [];

    // Handle top shops - backend returns array directly
    const topShopsData = Array.isArray(topShopsResponse.data)
      ? topShopsResponse.data.map((shop: any) => ({
          shopId: shop.shopId || shop._id || "",
          shopName: shop.shopName || shop.name || "",
          shopLogo: shop.shopLogo || shop.logo,
          totalRevenue: shop.netRevenue || shop.totalRevenue || shop.revenue || 0,
          totalOrders: shop.orders || shop.totalOrders || shop.orderCount || 0,
          rank: shop.rank || 0,
        }))
      : topShopsResponse.data?.shops?.map((shop: any) => ({
          shopId: shop.shopId,
          shopName: shop.shopName,
          shopLogo: shop.shopLogo,
          totalRevenue: shop.totalRevenue || shop.revenue || 0,
          totalOrders: shop.totalOrders || shop.orderCount || 0,
          rank: shop.rank || 0,
        })) || [];

    // Handle order status distribution - backend returns array directly
    const orderStatusData = Array.isArray(orderStatusResponse.data)
      ? orderStatusResponse.data
      : orderStatusResponse.data?.distribution || [];

    // Handle average order value - backend returns { averageOrderValue, orders }
    const aovData = aovResponse.data
      ? {
          aov: aovResponse.data.averageOrderValue || 0,
          period: "all",
          previousPeriodAov: 0,
          growthRate: 0,
        }
      : undefined;

    yield put(
      fetchAnalyticsDataSuccess({
        adminRevenue: revenueData,
        revenueTimeSeries: timeSeriesData,
        topProducts: topProductsData,
        topShops: topShopsData,
        orderStatusDistribution: orderStatusData,
        averageOrderValue: aovData,
      })
    );
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, "Failed to fetch analytics data");
    yield put(fetchAnalyticsDataFailure(errorMessage));
    yield put(
      addToast({
        type: "error",
        message: errorMessage,
      })
    );
  }
}

export function* analyticsSaga() {
  yield takeEvery("analytics/fetchAnalyticsDataStart", fetchAnalyticsDataWorker);
}

