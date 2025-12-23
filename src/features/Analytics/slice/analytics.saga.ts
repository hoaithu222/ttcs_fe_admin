import { call, put, takeEvery, all } from "redux-saga/effects";
import { analyticsApi } from "@/core/api/analytics";
import type {
  AnalyticsQuery,
  TimeSeriesData,
  TopProduct,
  TopShop,
  OrderStatusDistribution,
  AverageOrderValue,
  RevenueData,
} from "@/core/api/analytics/type";
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
    const query: AnalyticsQuery | undefined = action.payload || undefined;

    // Map UI query => backend query params
    const apiQuery: any = query
      ? {
          from: query.startDate,
          to: query.endDate,
          granularity:
            query.period === "month" || query.period === "year"
              ? "month"
              : query.period === "day"
              ? "day"
              : undefined,
          limit: query.limit,
        }
      : {};

    console.log("🚀 [Analytics Saga] Fetching analytics data with query:", apiQuery);

    // Fetch analytics data in parallel using redux-saga all
    const [
      adminRevenueResponse,
      revenueTimeSeriesResponse,
      topProductsResponse,
      topShopsResponse,
      orderStatusResponse,
      aovResponse,
    ] = yield all([
      call([analyticsApi, analyticsApi.getAdminRevenue], apiQuery),
      call([analyticsApi, analyticsApi.getRevenueTimeSeries], apiQuery),
      call([analyticsApi, analyticsApi.getTopProducts], apiQuery),
      call([analyticsApi, analyticsApi.getTopShops], apiQuery),
      // Endpoint không nhận query nên không truyền apiQuery để tránh lỗi type
      call([analyticsApi, analyticsApi.getOrderStatusDistribution]),
      call([analyticsApi, analyticsApi.getAverageOrderValue], apiQuery),
    ]);

    /**
     * Normalize admin revenue
     * Backend success payload: { items, totals }
     */
    const adminRevenuePayload = (adminRevenueResponse as any).data;
    const revenueData: RevenueData | undefined = adminRevenuePayload?.totals
      ? {
          totalRevenue: adminRevenuePayload.totals.netRevenue || 0,
          period: "all",
          growthRate: 0,
          previousPeriodRevenue: 0,
        }
      : undefined;

    /**
     * Normalize time series
     * Backend success payload: data: items[]
     * item: { bucket, netRevenue, orders, ... }
     */
    const timeSeriesRaw: any[] = Array.isArray((revenueTimeSeriesResponse as any).data)
      ? (revenueTimeSeriesResponse as any).data
      : (revenueTimeSeriesResponse as any).data?.data || [];

    const timeSeriesData: TimeSeriesData[] = timeSeriesRaw.map((item: any) => ({
      date: item.bucket || item.date || "",
      revenue: item.netRevenue ?? item.revenue ?? 0,
      orders: item.orders ?? 0,
      customers: item.customers ?? 0,
    }));

    /**
     * Normalize top products
     * Backend success payload: data: items[]
     * item: { productId, quantity, revenue, ordersCount, product: { name, ... } }
     */
    const topProductsRaw: any[] = Array.isArray((topProductsResponse as any).data)
      ? (topProductsResponse as any).data
      : (topProductsResponse as any).data?.products || [];

    const topProductsData: TopProduct[] = topProductsRaw.map(
      (item: any, index: number): TopProduct => ({
        productId: item.productId || item.product?._id || "",
        productName: item.productName || item.product?.name || "Sản phẩm",
        productImage: item.productImage || item.product?.imageUrl,
        totalSales: item.ordersCount ?? item.orders ?? 0,
        revenue: item.revenue ?? 0,
        quantitySold: item.quantity ?? item.quantitySold ?? 0,
        rank: item.rank ?? index + 1,
      })
    );

    /**
     * Normalize top shops
     * Backend success payload: data: items[]
     * item: { shopId, orders, netRevenue, shopName, ... }
     */
    console.log("🚀 [Analytics Saga] topShopsResponse:", topShopsResponse);
    
    const topShopsRaw: any[] = Array.isArray((topShopsResponse as any).data)
      ? (topShopsResponse as any).data
      : (topShopsResponse as any).data?.shops || [];

    console.log("🔍 [Analytics Saga] Raw top shops data:", topShopsRaw);
    console.log("🔍 [Analytics Saga] Raw top shops data length:", topShopsRaw.length);

    const topShopsData: TopShop[] = topShopsRaw.map((shop: any, index: number): TopShop => {
      const shopName = shop.shopName || shop.name || shop.shopInfo?.name || `Shop ${index + 1}`;
      console.log(`🔍 [Analytics Saga] Shop ${index + 1}:`, {
        shopId: shop.shopId || shop._id,
        shopName,
        rawShop: shop,
      });
      
      return {
        shopId: shop.shopId || shop._id || "",
        shopName,
        shopLogo: shop.shopLogo || shop.logo || shop.shopInfo?.logo,
        totalRevenue: shop.netRevenue || shop.totalRevenue || shop.revenue || 0,
        totalOrders: shop.orders || shop.totalOrders || shop.orderCount || 0,
        averageOrderValue: shop.averageOrderValue || (shop.orders > 0 ? Math.round((shop.netRevenue || shop.totalRevenue || 0) / shop.orders) : 0),
        rank: shop.rank ?? index + 1,
      };
    });

    console.log("✅ [Analytics Saga] Normalized top shops:", topShopsData);

    /**
     * Normalize order status distribution
     * Backend success payload: data: items[]
     * item: { status, count }
     */
    const orderStatusRaw: any[] = Array.isArray((orderStatusResponse as any).data)
      ? (orderStatusResponse as any).data
      : (orderStatusResponse as any).data?.distribution || [];

    const totalOrderCount = orderStatusRaw.reduce(
      (sum, it) => sum + (it.count ?? 0),
      0
    );

    const orderStatusData: OrderStatusDistribution[] = orderStatusRaw.map(
      (item: any): OrderStatusDistribution => ({
        status: item.status,
        count: item.count ?? 0,
        percentage:
          totalOrderCount > 0
            ? Number(((item.count ?? 0) / totalOrderCount) * 100)
            : 0,
      })
    );

    /**
     * Normalize AOV
     * Backend success payload: data: { averageOrderValue, orders }
     */
    const aovPayload = (aovResponse as any).data;
    const aovData: AverageOrderValue | undefined = aovPayload
      ? {
          aov: aovPayload.averageOrderValue || 0,
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

