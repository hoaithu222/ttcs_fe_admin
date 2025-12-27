import React, { useEffect, useMemo } from "react";
import { useAppSelector } from "@/app/store";
import {
  selectAdminRevenue,
  selectRevenueTimeSeries,
  selectTopProducts,
  selectTopShops,
  selectOrderStatusDistribution,
  selectAverageOrderValue,
  selectShopStrength,
  selectCashFlowGrowth,
  selectPaymentDeviceDistribution,
  selectSystemLoad,
  selectAnalyticsLoading,
  selectAnalyticsError,
  selectAnalyticsFilters,
} from "../slice/analytics.selector";
import { useAnalyticsActions } from "../hooks/useAnalyticsActions";
import { Card } from "@/foundation/components/info/Card";
import ScrollView from "@/foundation/components/scroll/ScrollView";
import {
  Activity,
  ArrowUpRight,
  DollarSign,
  Package,
  ShoppingBag,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import RevenueTimeSeriesChart from "../components/RevenueTimeSeriesChart";
import TopProductsChart from "../components/TopProductsChart";
import TopShopsChart from "../components/TopShopsChart";
import OrderStatusPieChart from "../components/OrderStatusPieChart";
import RevenueAreaChart from "../components/RevenueAreaChart";
import ComposedChartComponent from "../components/ComposedChart";
import ScatterChartComponent from "../components/ScatterChart";
import ShopStrengthQuadrantChart from "../components/ShopStrengthQuadrantChart";
import CashFlowGrowthChart from "../components/CashFlowGrowthChart";
import NestedDonutChart from "../components/NestedDonutChart";
import SystemLoadChart from "../components/SystemLoadChart";
import DateRangeFilter from "../components/DateRangeFilter";

interface SectionHeaderProps {
  title: string;
  description?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, description }) => (
  <div className="space-y-2">
    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary-5/80">
      Insight
    </p>
    <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
      <h2 className="text-2xl font-bold text-neutral-10">{title}</h2>
      {description && (
        <p className="text-sm text-neutral-6 lg:max-w-xl lg:text-right">{description}</p>
      )}
    </div>
  </div>
);

// Helper function to format image URL from Cloudinary
const formatImageUrl = (url: string | undefined): string => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://res.cloudinary.com/dor0kslle/image/upload/${url}`;
};

const AnalyticsPage: React.FC = () => {
  const adminRevenue = useAppSelector(selectAdminRevenue);
  const revenueTimeSeries = useAppSelector(selectRevenueTimeSeries);
  const topProducts = useAppSelector(selectTopProducts);
  const topShops = useAppSelector(selectTopShops);
  const orderStatusDistribution = useAppSelector(selectOrderStatusDistribution);
  const averageOrderValue = useAppSelector(selectAverageOrderValue);
  const shopStrength = useAppSelector(selectShopStrength);
  const cashFlowGrowth = useAppSelector(selectCashFlowGrowth);
  const paymentDeviceDistribution = useAppSelector(selectPaymentDeviceDistribution);
  const systemLoad = useAppSelector(selectSystemLoad);
  const isLoading = useAppSelector(selectAnalyticsLoading);
  const error = useAppSelector(selectAnalyticsError);
  const filters = useAppSelector(selectAnalyticsFilters);
  const { fetchAnalyticsData, updateFilters } = useAnalyticsActions();

  const hasRevenueTimeSeries = useMemo(
    () => revenueTimeSeries && revenueTimeSeries.length > 0,
    [revenueTimeSeries]
  );
  const hasTopProducts = useMemo(() => topProducts && topProducts.length > 0, [topProducts]);
  const hasTopShops = useMemo(() => topShops && topShops.length > 0, [topShops]);
  const hasOrderStatus = useMemo(
    () => orderStatusDistribution && orderStatusDistribution.length > 0,
    [orderStatusDistribution]
  );
  const maxProductRevenue = useMemo(() => {
    if (!hasTopProducts || !topProducts) return 0;
    return Math.max(...topProducts.map((product) => product.revenue || 0));
  }, [hasTopProducts, topProducts]);
  const maxShopRevenue = useMemo(() => {
    if (!hasTopShops || !topShops) return 0;
    return Math.max(...topShops.map((shop) => shop.totalRevenue || 0));
  }, [hasTopShops, topShops]);

  const derivedStats = useMemo(() => {
    if (!hasRevenueTimeSeries || !revenueTimeSeries) {
      return { totalOrders: 0, totalCustomers: 0, avgOrdersPerDay: 0 };
    }

    const totalOrders = revenueTimeSeries.reduce((acc, item) => acc + (item.orders || 0), 0);
    const totalCustomers = revenueTimeSeries.reduce(
      (acc, item) => acc + (item.customers || 0),
      0
    );
    const avgOrdersPerDay =
      totalOrders > 0 && revenueTimeSeries.length > 0
        ? Math.round(totalOrders / revenueTimeSeries.length)
        : 0;

    return { totalOrders, totalCustomers, avgOrdersPerDay };
  }, [hasRevenueTimeSeries, revenueTimeSeries]);

  const formatCurrency = (value?: number | null) => {
    if (value === undefined || value === null) {
      return "—";
    }
    return `${value.toLocaleString("vi-VN")} đ`;
  };

  const formatNumber = (value?: number | null) => {
    if (value === undefined || value === null) {
      return "—";
    }
    return value.toLocaleString("vi-VN");
  };

  const metricCards = useMemo(() => {
    const metrics: {
      id: string;
      label: string;
      value: string;
      delta?: number;
      subtext?: string;
      icon: React.ReactNode;
      accent: string;
    }[] = [];

    if (adminRevenue) {
      metrics.push({
        id: "revenue",
        label: "Tổng doanh thu",
        value: formatCurrency(adminRevenue.totalRevenue),
        delta: adminRevenue.growthRate,
        subtext: `Chu kỳ: ${adminRevenue.period}`,
        icon: (
          <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
        ),
        accent: "from-emerald-500/10 via-emerald-400/5 to-transparent",
      });
    }

    if (averageOrderValue) {
      metrics.push({
        id: "aov",
        label: "Giá trị đơn hàng TB",
        value: formatCurrency(averageOrderValue.aov),
        delta: averageOrderValue.growthRate,
        subtext: `So với ${averageOrderValue.period.toLowerCase()}`,
        icon: (
          <div className="p-3 rounded-2xl bg-blue-500/15 text-blue-400">
            <Target className="w-5 h-5" />
          </div>
        ),
        accent: "from-sky-500/10 via-sky-400/5 to-transparent",
      });
    }

    if (derivedStats.totalOrders > 0) {
      metrics.push({
        id: "orders",
        label: "Tổng đơn hàng",
        value: formatNumber(derivedStats.totalOrders),
        subtext: `~${formatNumber(derivedStats.avgOrdersPerDay)} đơn/ngày`,
        icon: (
          <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-400">
            <Package className="w-5 h-5" />
          </div>
        ),
        accent: "from-amber-500/10 via-amber-400/5 to-transparent",
      });
    }

    if (derivedStats.totalCustomers > 0) {
      metrics.push({
        id: "customers",
        label: "Khách hàng phục vụ",
        value: formatNumber(derivedStats.totalCustomers),
        subtext: "Theo chu kỳ thống kê",
        icon: (
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400">
            <Users className="w-5 h-5" />
          </div>
        ),
        accent: "from-purple-500/10 via-purple-400/5 to-transparent",
      });
    }

    return metrics;
  }, [adminRevenue, averageOrderValue, derivedStats]);

  useEffect(() => {
    fetchAnalyticsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (query: AnalyticsQuery) => {
    updateFilters(query);
    fetchAnalyticsData(query);
  };


  return (
    <ScrollView
      className="h-full"
      hideScrollbarX={true}
      scrollbarThickness={6}
      thumbClassName="bg-neutral-4 hover:bg-neutral-5"
      trackClassName="bg-transparent"
    >
      <div className="min-h-full bg-gradient-to-br from-background-base via-background-elevated to-background-base/90 p-6">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Date Range Filter */}
          <DateRangeFilter onFilterChange={handleFilterChange} currentQuery={filters} />
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-primary-8 via-primary-6 to-secondary-6 text-white shadow-2xl">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_55%)]" />
            <div className="relative flex flex-col gap-6 p-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.4em] text-white/70">
                  <Sparkles className="h-4 w-4" />
                  Analytics
                </p>
                <h1 className="text-3xl font-bold lg:text-4xl">Phân tích & báo cáo tổng quan</h1>
                <p className="text-white/80">
                  Cập nhật chu kỳ {adminRevenue?.period ?? "mặc định"} • dữ liệu được tổng hợp theo
                  thời gian thực để bạn hành động nhanh hơn.
                </p>
                <button
                  type="button"
                  onClick={() => fetchAnalyticsData()}
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <Activity className="h-4 w-4" />
                  Làm mới dữ liệu
                </button>
              </div>
              <div className="grid w-full gap-4 md:grid-cols-2 lg:max-w-md">
                <Card className="rounded-2xl border-white/30 bg-white/10 p-5 text-white shadow-xl backdrop-blur">
                  <p className="text-sm text-white/70">Doanh thu hiện tại</p>
                  <p className="text-3xl font-bold">
                    {formatCurrency(adminRevenue?.totalRevenue ?? null)}
                  </p>
                  {typeof adminRevenue?.growthRate === "number" && (
                    <span
                      className={`mt-2 inline-flex items-center text-sm font-semibold ${
                        adminRevenue.growthRate >= 0 ? "text-emerald-300" : "text-rose-200"
                      }`}
                    >
                      <ArrowUpRight
                        className={`mr-1 h-4 w-4 ${
                          adminRevenue.growthRate < 0 ? "rotate-180" : ""
                        }`}
                      />
                      {adminRevenue.growthRate >= 0 ? "+" : ""}
                      {adminRevenue.growthRate.toFixed(2)}%
                    </span>
                  )}
                </Card>
                <Card className="rounded-2xl border-white/30 bg-white/10 p-5 text-white shadow-xl backdrop-blur">
                  <p className="text-sm text-white/70">Đơn hàng xử lý</p>
                  <p className="text-3xl font-bold">{formatNumber(derivedStats.totalOrders)}</p>
                  <p className="mt-2 text-sm text-white/70">
                    Trung bình {formatNumber(derivedStats.avgOrdersPerDay)} đơn/ngày
                  </p>
                </Card>
              </div>
            </div>
          </div>

          {error && (
            <Card className="border border-red-200/40 bg-red-50/70 p-4 text-red-600 dark:border-red-900/40 dark:bg-red-900/25 dark:text-red-200">
              <p className="text-sm font-medium">Không thể tải dữ liệu: {error}</p>
            </Card>
          )}

          {metricCards.length > 0 && (
            <section className="space-y-4">
              <SectionHeader
                title="Chỉ số hiệu suất"
                description="Nắm bắt nhanh những KPI quan trọng của hoạt động kinh doanh."
              />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                {metricCards.map((metric) => (
                  <Card
                    key={metric.id}
                    className="relative overflow-hidden border border-white/10 bg-white/80 p-6 shadow-lg backdrop-blur dark:bg-neutral-900/60"
                  >
                    <div
                      className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${metric.accent}`}
                    />
                    <div className="relative flex flex-col gap-4">
                      <div className="flex items-center justify-between">{metric.icon}</div>
                      <div>
                        <p className="text-sm font-medium text-neutral-6">{metric.label}</p>
                        <p className="text-2xl font-bold text-neutral-10">{metric.value}</p>
                      </div>
                      {typeof metric.delta === "number" && (
                        <span
                          className={`inline-flex items-center text-sm font-semibold ${
                            metric.delta >= 0 ? "text-emerald-600" : "text-rose-500"
                          }`}
                        >
                          <ArrowUpRight
                            className={`mr-1 h-4 w-4 ${
                              metric.delta < 0 ? "rotate-180" : ""
                            }`}
                          />
                          {metric.delta >= 0 ? "+" : ""}
                          {metric.delta.toFixed(2)}%
                        </span>
                      )}
                      {metric.subtext && (
                        <p className="text-sm text-neutral-5">{metric.subtext}</p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {hasRevenueTimeSeries && (
            <section className="space-y-4">
              <SectionHeader
                title="Xu hướng & dự báo"
                description="Theo dõi doanh thu, đơn hàng và khách hàng theo thời gian."
              />
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <RevenueTimeSeriesChart data={revenueTimeSeries} isLoading={isLoading} />
                <RevenueAreaChart data={revenueTimeSeries} isLoading={isLoading} />
              </div>
            </section>
          )}

          {(hasTopProducts || hasTopShops) && (
            <section className="space-y-4">
              <SectionHeader
                title="Hiệu suất sản phẩm & cửa hàng"
                description="Xếp hạng dựa trên doanh thu, sản lượng và hiệu quả vận hành."
              />
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                {hasTopProducts && <TopProductsChart data={topProducts} isLoading={isLoading} />}
                {hasTopShops && <TopShopsChart data={topShops} isLoading={isLoading} />}
              </div>
            </section>
          )}

          {hasOrderStatus && (
            <section className="space-y-4">
              <SectionHeader
                title="Kênh xử lý đơn hàng"
                description="Tỷ trọng trạng thái đơn hàng trong hệ thống."
              />
              <OrderStatusPieChart data={orderStatusDistribution!} isLoading={isLoading} />
            </section>
          )}

          {hasTopProducts && (
            <section className="space-y-4">
              <SectionHeader
                title="Phân tích sản phẩm nâng cao"
                description="Đánh giá độ tương quan giữa doanh thu, sản lượng và mức độ đóng góp."
              />
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <ComposedChartComponent data={topProducts} isLoading={isLoading} />
                <ScatterChartComponent data={topProducts} isLoading={isLoading} />
              </div>
            </section>
          )}


          {/* PHẦN 1: DÀNH CHO ADMIN - 4 TÍNH NĂNG MỚI */}
          {shopStrength && shopStrength.length > 0 && (
            <section className="space-y-4">
              <SectionHeader
                title="Biểu đồ sức mạnh & Phân loại Shop"
                description="Bản đồ sức mạnh Shop - Đánh giá chất lượng đối tác dựa trên GMV và Rating."
              />
              <ShopStrengthQuadrantChart data={shopStrength} isLoading={isLoading} />
            </section>
          )}

          {cashFlowGrowth && cashFlowGrowth.length > 0 && (
            <section className="space-y-4">
              <SectionHeader
                title="Dòng tiền & Tăng trưởng toàn sàn"
                description="Theo dõi doanh thu toàn hệ thống (GMV), trung bình 30 ngày (MA30) và lợi nhuận ròng."
              />
              <CashFlowGrowthChart data={cashFlowGrowth} isLoading={isLoading} />
            </section>
          )}

          {paymentDeviceDistribution && (
            <section className="space-y-4">
              <SectionHeader
                title="Tỷ trọng người dùng & Dòng tiền"
                description="Phân loại nguồn tiền (Thanh toán) và thiết bị người dùng để tối ưu UX/UI."
              />
              <NestedDonutChart
                paymentMethods={paymentDeviceDistribution.paymentMethods}
                deviceTypes={paymentDeviceDistribution.deviceTypes}
                isLoading={isLoading}
              />
            </section>
          )}

          {systemLoad && systemLoad.length > 0 && (
            <section className="space-y-4">
              <SectionHeader
                title="Thống kê truy cập & Tải hệ thống"
                description="Phát hiện DDOS hoặc sự cố hệ thống khi lượng truy cập tăng đột biến."
              />
              <SystemLoadChart data={systemLoad} isLoading={isLoading} />
            </section>
          )}

          {hasTopProducts && (
            <section className="space-y-4">
              <SectionHeader
                title="Chi tiết sản phẩm bán chạy"
                description="Danh sách ưu tiên giúp tối ưu tồn kho và chiến dịch marketing."
              />
              <Card className="space-y-4 border border-white/10 bg-white/90 p-6 shadow-lg backdrop-blur dark:bg-neutral-900/70">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary-6" />
                  <h2 className="text-xl font-bold text-neutral-10">Top sản phẩm</h2>
                </div>
                <div className="space-y-3">
                  {topProducts.slice(0, 10).map((product, index) => {
                    const widthPercent =
                      maxProductRevenue > 0
                        ? Math.round(((product.revenue || 0) / maxProductRevenue) * 100)
                        : 0;
                    const productImageUrl = formatImageUrl(product.productImage);
                    return (
                      <div
                        key={product.productId}
                        className="group relative overflow-hidden rounded-2xl border border-neutral-3/60 bg-gradient-to-r from-neutral-1/60 to-neutral-2/40 p-4 transition-all duration-300 hover:border-primary-5/50 hover:shadow-lg dark:border-neutral-8/60 dark:from-neutral-9/40 dark:to-neutral-8/30"
                      >
                        <div className="flex items-center gap-4">
                          {/* Rank Badge */}
                          <div className="flex-shrink-0">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-6 to-primary-7 text-lg font-bold text-white shadow-md">
                              #{index + 1}
                            </div>
                          </div>

                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <div className="relative h-16 w-16 overflow-hidden rounded-xl border-2 border-neutral-3/40 bg-neutral-2 dark:border-neutral-8/40 dark:bg-neutral-8">
                              {productImageUrl ? (
                                <img
                                  src={productImageUrl}
                                  alt={product.productName}
                                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = "none";
                                    const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                                    if (fallback) fallback.style.display = "flex";
                                  }}
                                />
                              ) : null}
                              <div
                                className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-3 to-neutral-4 text-neutral-7 dark:from-neutral-8 dark:to-neutral-9 dark:text-neutral-5 ${productImageUrl ? "hidden" : "flex"}`}
                              >
                                <Package className="h-6 w-6" />
                              </div>
                            </div>
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <h3 className="truncate text-base font-bold text-neutral-10 group-hover:text-primary-7 transition-colors">
                                  {product.productName}
                                </h3>
                                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-neutral-6">
                                  <span className="flex items-center gap-1">
                                    <Package className="h-3.5 w-3.5" />
                                    {product.quantitySold.toLocaleString("vi-VN")} sản phẩm
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <DollarSign className="h-3.5 w-3.5" />
                                    {product.revenue.toLocaleString("vi-VN")} đ
                                  </span>
                                </div>
                              </div>
                              <span className="flex-shrink-0 rounded-full bg-primary-6/10 px-3 py-1 text-xs font-semibold text-primary-7">
                                Rank #{product.rank}
                              </span>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-3/60 dark:bg-neutral-8/60">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-primary-5 via-primary-6 to-primary-7 transition-all duration-500"
                                style={{ width: `${widthPercent}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </section>
          )}


          {isLoading && (
            <div className="flex items-center justify-center rounded-2xl border border-dashed border-neutral-4 bg-background-elevated/80 px-4 py-8 text-sm text-neutral-6">
              Đang đồng bộ dữ liệu mới...
            </div>
          )}
        </div>
      </div>
    </ScrollView>
  );
};

export default AnalyticsPage;

