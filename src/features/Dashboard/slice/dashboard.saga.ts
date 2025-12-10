import { call, put, takeEvery, all } from "redux-saga/effects";
import { adminApi } from "@/core/api/admin";
import { addToast } from "@/app/store/slices/toast";
import type { fetchDashboardDataStart } from "./dashboard.slice";
import { fetchDashboardDataSuccess, fetchDashboardDataFailure } from "./dashboard.slice";
import type { ApiSuccess, TopSellingProduct, ProductStatistics } from "@/core/api/admin/type";

type FetchDashboardDataAction = ReturnType<typeof fetchDashboardDataStart>;

const FALLBACK_TOP_SELLING: TopSellingProduct[] = [
  {
    productId: "p-01",
    productName: "Bàn phím cơ RGB TKL",
    salesCount: 420,
    imageUrl:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
    category: "Phụ kiện",
    price: 1490000,
    revenue: 625800000,
    stockLeft: 24,
    rating: 4.8,
  },
  {
    productId: "p-02",
    productName: "Tai nghe không dây chống ồn",
    salesCount: 350,
    imageUrl:
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=600&q=80",
    category: "Âm thanh",
    price: 2590000,
    revenue: 906500000,
    stockLeft: 18,
    rating: 4.7,
  },
  {
    productId: "p-03",
    productName: "Ghế công thái học Premium",
    salesCount: 180,
    imageUrl:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80",
    category: "Nội thất",
    price: 5990000,
    revenue: 1078200000,
    stockLeft: 9,
    rating: 4.9,
  },
  {
    productId: "p-04",
    productName: "Màn hình 27\" 2K 165Hz",
    salesCount: 260,
    imageUrl:
      "https://images.unsplash.com/photo-1527443224154-d1becb76ba52?auto=format&fit=crop&w=600&q=80",
    category: "Màn hình",
    price: 7590000,
    revenue: 1973400000,
    stockLeft: 12,
    rating: 4.6,
  },
  {
    productId: "p-05",
    productName: "Laptop Ultrabook 14\"",
    salesCount: 140,
    imageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
    category: "Laptop",
    price: 19990000,
    revenue: 2798600000,
    stockLeft: 7,
    rating: 4.8,
  },
  {
    productId: "p-06",
    productName: "Chuột không dây silent",
    salesCount: 520,
    imageUrl:
      "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=600&q=80",
    category: "Phụ kiện",
    price: 590000,
    revenue: 306800000,
    stockLeft: 33,
    rating: 4.5,
  },
  {
    productId: "p-07",
    productName: "Ổ cứng SSD NVMe 1TB",
    salesCount: 310,
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    category: "Lưu trữ",
    price: 2290000,
    revenue: 709900000,
    stockLeft: 15,
    rating: 4.7,
  },
  {
    productId: "p-08",
    productName: "Smartwatch thể thao",
    salesCount: 295,
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    category: "Đồng hồ",
    price: 3290000,
    revenue: 970550000,
    stockLeft: 21,
    rating: 4.6,
  },
];

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

const normalizeTopSellingProducts = (raw?: any[]): TopSellingProduct[] => {
  if (!raw || !Array.isArray(raw) || raw.length === 0) {
    return FALLBACK_TOP_SELLING;
  }

  return raw
    .map((item, index) => {
      const price =
        item?.price ??
        item?.unitPrice ??
        item?.finalPrice ??
        item?.amount ??
        undefined;

      const salesCount = item?.salesCount ?? item?.totalSales ?? item?.sold ?? 0;
      const revenue =
        item?.revenue ??
        (price !== undefined && salesCount ? price * salesCount : undefined);

      const imageUrl =
        item?.imageUrl ??
        item?.image ??
        item?.thumbnail ??
        item?.cover ??
        item?.picture ??
        null;

      const rating =
        item?.rating ??
        item?.avgRating ??
        item?.averageRating ??
        Math.min(5, 4.5 + ((index % 3) * 0.1));

      return {
        productId: String(item?.productId ?? item?.id ?? item?._id ?? `p-${index}`),
        productName: item?.productName ?? item?.name ?? `Sản phẩm ${index + 1}`,
        salesCount,
        imageUrl:
          imageUrl ||
          `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80`,
        category: item?.category ?? item?.categoryName ?? "Khác",
        price,
        revenue,
        stockLeft: item?.stockLeft ?? item?.stock ?? item?.quantity ?? undefined,
        rating,
      };
    })
    .slice(0, 12);
};

const normalizeProductStatistics = (productStats: ProductStatistics | undefined): ProductStatistics => {
  const topSellingProducts = normalizeTopSellingProducts(productStats?.topSellingProducts);
  return {
    totalProducts: productStats?.totalProducts ?? 0,
    activeProducts: productStats?.activeProducts ?? 0,
    productsByCategory: productStats?.productsByCategory ?? {},
    productsByShop: productStats?.productsByShop ?? {},
    lowStockProducts: productStats?.lowStockProducts ?? 0,
    outOfStockProducts: productStats?.outOfStockProducts ?? 0,
    topSellingProducts,
  };
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

    const productStatisticsRaw: ProductStatistics =
      productStatsResponse.data || productStatsResponse;
    const normalizedProductStatistics = normalizeProductStatistics(productStatisticsRaw);

    const dashboardData = {
      userStatistics: userStatsResponse.data || userStatsResponse,
      productStatistics: normalizedProductStatistics,
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

