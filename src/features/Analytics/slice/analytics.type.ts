import { ReduxStateType } from "@/app/store/types";
import {
  RevenueData,
  TimeSeriesData,
  TopProduct,
  TopShop,
  OrderStatusDistribution,
  AverageOrderValue,
  AnalyticsQuery,
} from "@/core/api/analytics/type";

export interface AnalyticsState {
  adminRevenue: RevenueData | null;
  revenueTimeSeries: TimeSeriesData[];
  topProducts: TopProduct[];
  topShops: TopShop[];
  orderStatusDistribution: OrderStatusDistribution[] | null;
  averageOrderValue: AverageOrderValue | null;
  isLoading: boolean;
  error: string | null;
  fetchAnalyticsData: {
    status: ReduxStateType;
    error: string | null;
    message: string | null;
  };
  filters: AnalyticsQuery;
}

