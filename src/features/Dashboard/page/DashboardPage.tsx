import React, { useEffect, useMemo } from "react";
import { useAppSelector } from "@/app/store";
import {
  selectUserStatistics,
  selectProductStatistics,
  selectDashboardLoading,
} from "../slice/dashboard.selector";
import { useDashboardActions } from "../hooks/useDashboardActions";
import { Card } from "@/foundation/components/info/Card";
import { Users, Package, TrendingUp, AlertCircle, XCircle, RefreshCcw } from "lucide-react";

const DashboardPage: React.FC = () => {
  const userStatistics = useAppSelector(selectUserStatistics);
  const productStatistics = useAppSelector(selectProductStatistics);
  const isLoading = useAppSelector(selectDashboardLoading);
  const { fetchDashboardData } = useDashboardActions();

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const userCards = useMemo(
    () => [
      {
        id: "total-users",
        title: "Tổng người dùng",
        value: userStatistics?.totalUsers ?? 0,
        icon: Users,
        iconWrapperClass:
          "p-3 bg-blue-100 dark:bg-blue-900 rounded-lg",
        iconClass: "w-6 h-6 text-blue-600 dark:text-blue-400",
      },
      {
        id: "active-users",
        title: "Người dùng hoạt động",
        value: userStatistics?.activeUsers ?? 0,
        icon: TrendingUp,
        iconWrapperClass:
          "p-3 bg-green-100 dark:bg-green-900 rounded-lg",
        iconClass: "w-6 h-6 text-green-600 dark:text-green-400",
      },
      {
        id: "new-users-month",
        title: "Người dùng mới (tháng này)",
        value: userStatistics?.newUsersThisMonth ?? 0,
        icon: Users,
        iconWrapperClass:
          "p-3 bg-purple-100 dark:bg-purple-900 rounded-lg",
        iconClass: "w-6 h-6 text-purple-600 dark:text-purple-400",
      },
      {
        id: "total-products",
        title: "Tổng sản phẩm",
        value: productStatistics?.totalProducts ?? 0,
        icon: Package,
        iconWrapperClass:
          "p-3 bg-orange-100 dark:bg-orange-900 rounded-lg",
        iconClass: "w-6 h-6 text-orange-600 dark:text-orange-400",
      },
    ],
    [productStatistics?.totalProducts, userStatistics]
  );

  const productCards = useMemo(
    () => [
      {
        id: "active-products",
        title: "Sản phẩm hoạt động",
        value: productStatistics?.activeProducts ?? 0,
        icon: Package,
        iconWrapperClass:
          "p-3 bg-green-100 dark:bg-green-900 rounded-lg",
        iconClass: "w-6 h-6 text-green-600 dark:text-green-400",
      },
      {
        id: "low-stock-products",
        title: "Sản phẩm sắp hết",
        value: productStatistics?.lowStockProducts ?? 0,
        icon: AlertCircle,
        iconWrapperClass:
          "p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg",
        iconClass: "w-6 h-6 text-yellow-600 dark:text-yellow-400",
      },
      {
        id: "out-of-stock-products",
        title: "Hết hàng",
        value: productStatistics?.outOfStockProducts ?? 0,
        icon: XCircle,
        iconWrapperClass:
          "p-3 bg-red-100 dark:bg-red-900 rounded-lg",
        iconClass: "w-6 h-6 text-red-600 dark:text-red-400",
      },
    ],
    [productStatistics]
  );

  const renderStatValue = (value: number) =>
    isLoading ? (
      <span className="inline-flex h-6 w-16 animate-pulse rounded bg-neutral-3" />
    ) : (
      value.toLocaleString("vi-VN")
    );

  return (
    <div className="min-h-screen bg-background-base p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative overflow-hidden rounded-2xl border border-neutral-3 bg-neutral-1/80 px-5 py-4 shadow-sm">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-1 px-3 py-1 text-xs font-medium text-primary-7">
              <span className="text-lg">📊</span>
              <span>Admin overview</span>
            </div>
            <h1 className="mt-3 text-3xl font-bold text-neutral-10">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-neutral-6">
              Tổng quan nhanh về người dùng và sản phẩm trên hệ thống.
            </p>
          </div>
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-primary-3/20 to-primary-6/20 blur-xl" />
        </div>
        <button
          type="button"
          onClick={fetchDashboardData}
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-3 bg-neutral-1 px-4 py-2 text-sm font-medium text-neutral-10 shadow-sm transition hover:border-primary-4 hover:bg-primary-1 hover:text-primary-7"
        >
          <RefreshCcw className="h-4 w-4" />
          Làm mới số liệu
        </button>
      </div>

      {/* User Statistics Cards */}
      <section className="mb-8 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-6">
            Thống kê người dùng & tổng quan
          </h2>
          <span className="inline-flex items-center gap-1 rounded-full bg-neutral-2 px-3 py-1 text-xs text-neutral-7">
            <span className="text-base">👥</span>
            <span>People insight</span>
          </span>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {userCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.id}
                className="relative overflow-hidden border border-neutral-3 bg-neutral-1/80 p-6 shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center space-x-4">
                  <div className={card.iconWrapperClass}>
                    <Icon className={card.iconClass} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-neutral-8">
                      {card.title}
                    </h3>
                    <p className="mt-1 text-2xl font-semibold text-primary-6">
                      {renderStatValue(card.value)}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Product Statistics Cards */}
      <section className="mb-8 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-6">
            Thống kê sản phẩm
          </h2>
          <span className="inline-flex items-center gap-1 rounded-full bg-neutral-2 px-3 py-1 text-xs text-neutral-7">
            <span className="text-base">🛒</span>
            <span>Store health</span>
          </span>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {productCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.id}
                className="relative overflow-hidden border border-neutral-3 bg-neutral-1/80 p-6 shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center space-x-4">
                  <div className={card.iconWrapperClass}>
                    <Icon className={card.iconClass} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-neutral-8">
                      {card.title}
                    </h3>
                    <p className="mt-1 text-2xl font-semibold text-primary-6">
                      {renderStatValue(card.value)}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Top Selling Products */}
      {productStatistics?.topSellingProducts &&
        productStatistics.topSellingProducts.length > 0 && (
          <Card className="border border-neutral-3 bg-neutral-1/80 p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-neutral-10">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-4 to-primary-6 text-lg text-white shadow-sm">
                ⭐
              </span>
              <span>Sản phẩm bán chạy</span>
            </h2>
            <div className="space-y-2">
              {productStatistics.topSellingProducts.slice(0, 10).map((product, index) => {
                const initial =
                  product.productName?.charAt(0).toUpperCase() || "?";
                return (
                  <div
                    key={product.productId}
                    className="flex items-center justify-between rounded-lg bg-neutral-2 px-3 py-2"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-neutral-6">
                        #{index + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-3 to-primary-6 text-xs font-semibold text-white shadow-sm">
                          {initial}
                        </div>
                        <p className="font-medium text-neutral-10">
                          {product.productName}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-primary-6">
                      {product.salesCount} lượt bán
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
    </div>
  );
};

export default DashboardPage;

