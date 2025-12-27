import { ReduxStateType } from "@/app/store/types";
import {
  RevenueData,
  TimeSeriesData,
  TopProduct,
  TopShop,
  OrderStatusDistribution,
  AverageOrderValue,
  ShopStrengthItem,
  CashFlowItem,
  PaymentMethodItem,
  DeviceTypeItem,
  SystemLoadItem,
  AnalyticsQuery,
} from "@/core/api/analytics/type";

export interface AnalyticsState {
  adminRevenue: RevenueData | null;
  revenueTimeSeries: TimeSeriesData[];
  topProducts: TopProduct[];
  topShops: TopShop[];
  orderStatusDistribution: OrderStatusDistribution[] | null;
  averageOrderValue: AverageOrderValue | null;
  shopStrength: ShopStrengthItem[];
  cashFlowGrowth: CashFlowItem[];
  paymentDeviceDistribution: {
    paymentMethods: PaymentMethodItem[];
    deviceTypes: DeviceTypeItem[];
  } | null;
  systemLoad: SystemLoadItem[];
  isLoading: boolean;
  error: string | null;
  fetchAnalyticsData: {
    status: ReduxStateType;
    error: string | null;
    message: string | null;
  };
  filters: AnalyticsQuery;
}

