import React, { useEffect } from "react";
import { useAppSelector } from "@/app/store";
import {
  selectUserStatistics,
  selectProductStatistics,
  selectDashboardLoading,
} from "../slice/dashboard.selector";
import { useDashboardActions } from "../hooks/useDashboardActions";
import { Card } from "@/foundation/components/info/Card";
import { Users, Package, ShoppingCart, TrendingUp, AlertCircle, XCircle } from "lucide-react";

const DashboardPage: React.FC = () => {
  const userStatistics = useAppSelector(selectUserStatistics);
  const productStatistics = useAppSelector(selectProductStatistics);
  const isLoading = useAppSelector(selectDashboardLoading);
  const { fetchDashboardData } = useDashboardActions();

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-6 min-h-screen bg-background-base">
      <h1 className="text-3xl font-bold mb-6 text-neutral-10">Dashboard</h1>

      {/* User Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-10">Tổng người dùng</h3>
              <p className="text-2xl font-bold text-primary-6">
                {isLoading ? "..." : userStatistics?.totalUsers || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-10">Người dùng hoạt động</h3>
              <p className="text-2xl font-bold text-primary-6">
                {isLoading ? "..." : userStatistics?.activeUsers || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-10">Người dùng mới (tháng này)</h3>
              <p className="text-2xl font-bold text-primary-6">
                {isLoading ? "..." : userStatistics?.newUsersThisMonth || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Package className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-10">Tổng sản phẩm</h3>
              <p className="text-2xl font-bold text-primary-6">
                {isLoading ? "..." : productStatistics?.totalProducts || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Product Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-10">Sản phẩm hoạt động</h3>
              <p className="text-2xl font-bold text-primary-6">
                {isLoading ? "..." : productStatistics?.activeProducts || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-10">Sản phẩm sắp hết</h3>
              <p className="text-2xl font-bold text-primary-6">
                {isLoading ? "..." : productStatistics?.lowStockProducts || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-10">Hết hàng</h3>
              <p className="text-2xl font-bold text-primary-6">
                {isLoading ? "..." : productStatistics?.outOfStockProducts || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Selling Products */}
      {productStatistics?.topSellingProducts && productStatistics.topSellingProducts.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 text-neutral-10">Sản phẩm bán chạy</h2>
          <div className="space-y-2">
            {productStatistics.topSellingProducts.slice(0, 10).map((product, index) => (
              <div key={product.productId} className="p-3 bg-neutral-2 rounded-lg flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-neutral-6">#{index + 1}</span>
                  <p className="font-medium text-neutral-10">{product.productName}</p>
                </div>
                <p className="text-sm text-primary-6 font-semibold">
                  {product.salesCount} lượt bán
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default DashboardPage;

