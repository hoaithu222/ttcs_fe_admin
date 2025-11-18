import React, { useEffect } from "react";
import { useAppSelector } from "@/app/store";
import {
  selectAdminRevenue,
  selectRevenueTimeSeries,
  selectTopProducts,
  selectTopShops,
  selectOrderStatusDistribution,
  selectAverageOrderValue,
  selectAnalyticsLoading,
} from "../slice/analytics.selector";
import { useAnalyticsActions } from "../hooks/useAnalyticsActions";
import { Card } from "@/foundation/components/info/Card";
import ScrollView from "@/foundation/components/scroll/ScrollView";
import { DollarSign, Package, ShoppingBag, Target } from "lucide-react";
import RevenueTimeSeriesChart from "../components/RevenueTimeSeriesChart";
import TopProductsChart from "../components/TopProductsChart";
import TopShopsChart from "../components/TopShopsChart";
import OrderStatusPieChart from "../components/OrderStatusPieChart";
import RevenueAreaChart from "../components/RevenueAreaChart";
import ComposedChartComponent from "../components/ComposedChart";
import RadarChartComponent from "../components/RadarChart";
import ScatterChartComponent from "../components/ScatterChart";
import FunnelChartComponent from "../components/FunnelChart";

const AnalyticsPage: React.FC = () => {
  const adminRevenue = useAppSelector(selectAdminRevenue);
  const revenueTimeSeries = useAppSelector(selectRevenueTimeSeries);
  const topProducts = useAppSelector(selectTopProducts);
  const topShops = useAppSelector(selectTopShops);
  const orderStatusDistribution = useAppSelector(selectOrderStatusDistribution);
  const averageOrderValue = useAppSelector(selectAverageOrderValue);
  const isLoading = useAppSelector(selectAnalyticsLoading);
  const { fetchAnalyticsData } = useAnalyticsActions();

  useEffect(() => {
    fetchAnalyticsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScrollView
      className="h-full"
      hideScrollbarX={true}
      scrollbarThickness={6}
      thumbClassName="bg-neutral-4 hover:bg-neutral-5"
      trackClassName="bg-transparent"
    >
      <div className="p-6 max-h-[calc(100vh-120px)] bg-background-base">
        <h2 className="text-3xl font-bold mb-6 text-neutral-10">Phân tích & Báo cáo</h2>

      {/* Revenue Cards */}
      {adminRevenue && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-10">Tổng doanh thu</h3>
                <p className="text-2xl font-bold text-primary-6">
                  {adminRevenue.totalRevenue.toLocaleString("vi-VN")} đ
                </p>
                {adminRevenue.growthRate !== undefined && (
                  <p
                    className={`text-sm ${
                      adminRevenue.growthRate >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {adminRevenue.growthRate >= 0 ? "+" : ""}
                    {adminRevenue.growthRate.toFixed(2)}%
                  </p>
                )}
              </div>
            </div>
          </Card>

          {averageOrderValue && (
            <Card className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-10">Giá trị đơn hàng TB</h3>
                  <p className="text-2xl font-bold text-primary-6">
                    {averageOrderValue.aov.toLocaleString("vi-VN")} đ
                  </p>
                  {averageOrderValue.growthRate !== undefined && (
                    <p
                      className={`text-sm ${
                        averageOrderValue.growthRate >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {averageOrderValue.growthRate >= 0 ? "+" : ""}
                      {averageOrderValue.growthRate.toFixed(2)}%
                    </p>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Line Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Time Series Line Chart */}
        {revenueTimeSeries && revenueTimeSeries.length > 0 && (
          <RevenueTimeSeriesChart data={revenueTimeSeries} isLoading={isLoading} />
        )}

        {/* Revenue Area Chart */}
        {revenueTimeSeries && revenueTimeSeries.length > 0 && (
          <RevenueAreaChart data={revenueTimeSeries} isLoading={isLoading} />
        )}
      </div>

      {/* Bar Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Products Chart */}
        {topProducts.length > 0 && (
          <TopProductsChart data={topProducts} isLoading={isLoading} />
        )}

        {/* Top Shops Chart */}
        {topShops.length > 0 && (
          <TopShopsChart data={topShops} isLoading={isLoading} />
        )}
      </div>

      {/* Composed Chart */}
      {topProducts.length > 0 && (
        <div className="mb-6">
          <ComposedChartComponent data={topProducts} isLoading={isLoading} />
        </div>
      )}

      {/* Pie & Funnel Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Order Status Distribution Pie Chart */}
        {orderStatusDistribution && orderStatusDistribution.length > 0 && (
          <OrderStatusPieChart data={orderStatusDistribution} isLoading={isLoading} />
        )}

        {/* Funnel Chart */}
        {orderStatusDistribution && orderStatusDistribution.length > 0 && (
          <FunnelChartComponent data={orderStatusDistribution} isLoading={isLoading} />
        )}
      </div>

      {/* Advanced Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Radar Chart */}
        {topShops.length > 0 && (
          <RadarChartComponent data={topShops} isLoading={isLoading} />
        )}

        {/* Scatter Chart */}
        {topProducts.length > 0 && (
          <ScatterChartComponent data={topProducts} isLoading={isLoading} />
        )}
      </div>

      {/* Top Products List */}
      {topProducts.length > 0 && (
        <Card className="p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Package className="w-5 h-5 text-primary-6" />
            <h2 className="text-xl font-bold text-neutral-10">Chi tiết sản phẩm bán chạy</h2>
          </div>
          <div className="space-y-2">
            {topProducts.slice(0, 10).map((product, index) => (
              <div
                key={product.productId}
                className="p-3 bg-neutral-2 rounded-lg flex justify-between items-center"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-neutral-6">#{index + 1}</span>
                  <div>
                    <p className="font-medium text-neutral-10">{product.productName}</p>
                    <p className="text-sm text-neutral-6">
                      Đã bán: {product.quantitySold} | Doanh thu:{" "}
                      {product.revenue.toLocaleString("vi-VN")} đ
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Top Shops List */}
      {topShops.length > 0 && (
        <Card className="p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <ShoppingBag className="w-5 h-5 text-primary-6" />
            <h2 className="text-xl font-bold text-neutral-10">Chi tiết cửa hàng hàng đầu</h2>
          </div>
          <div className="space-y-2">
            {topShops.slice(0, 10).map((shop, index) => (
              <div
                key={shop.shopId}
                className="p-3 bg-neutral-2 rounded-lg flex justify-between items-center"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-neutral-6">#{index + 1}</span>
                  <div>
                    <p className="font-medium text-neutral-10">{shop.shopName}</p>
                    <p className="text-sm text-neutral-6">
                      Doanh thu: {shop.totalRevenue.toLocaleString("vi-VN")} đ | Đơn hàng:{" "}
                      {shop.totalOrders}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

        {isLoading && (
          <div className="text-center py-8">
            <p className="text-neutral-6">Đang tải dữ liệu...</p>
          </div>
        )}
      </div>
    </ScrollView>
  );
};

export default AnalyticsPage;

