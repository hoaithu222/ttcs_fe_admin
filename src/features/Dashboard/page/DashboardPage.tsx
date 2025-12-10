import React, { useEffect, useMemo } from "react";
import { useAppSelector } from "@/app/store";
import {
  selectUserStatistics,
  selectProductStatistics,
  selectDashboardLoading,
} from "../slice/dashboard.selector";
import { useDashboardActions } from "../hooks/useDashboardActions";
import { Card } from "@/foundation/components/info/Card";
import type { TopSellingProduct } from "@/core/api/admin/type";
import {
  Users,
  Package,
  TrendingUp,
  AlertCircle,
  XCircle,
  RefreshCcw,
  Star,
  ShoppingBag,
  Tag,
  DollarSign,
  Activity,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

type UserCard = {
  id: string;
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  bgGradient: string;
  iconBg: string;
  shadowColor: string;
  trend: string;
  trendUp: boolean;
};

type ProductCard = {
  id: string;
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  bgGradient: string;
  iconBg: string;
  shadowColor: string;
  description: string;
};

type AnalyticsColors = {
  cardStart: string;
  cardEnd: string;
  cardBorder: string;
  textPrimary: string;
  textMuted: string;
};

const useAnalyticsColors = (): AnalyticsColors =>
  useMemo(
    () => ({
      cardStart: "var(--color-analytics-card-start)",
      cardEnd: "var(--color-analytics-card-end)",
      cardBorder: "var(--color-analytics-card-border)",
      textPrimary: "var(--color-analytics-text-primary)",
      textMuted: "var(--color-analytics-text-muted)",
    }),
    []
  );

const HeaderSection: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => (
  <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div className="relative overflow-hidden rounded-2xl border border-[color:var(--color-border-1)] bg-background-1 px-6 py-5 shadow-lg">
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-5 to-primary-6 px-4 py-1.5 text-xs font-semibold text-white shadow-md">
          <span className="text-lg">📊</span>
          <span>Admin Overview</span>
        </div>
        <h1 className="mt-3 bg-gradient-to-r from-neutral-10 to-neutral-8 bg-clip-text text-4xl font-bold text-transparent">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-[color:var(--color-analytics-text-muted)]">
          Tổng quan nhanh về người dùng và sản phẩm trên hệ thống.
        </p>
      </div>
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-primary-3/30 to-primary-6/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-5 -left-5 h-32 w-32 rounded-full bg-gradient-to-tr from-blue-3/20 to-purple-4/20 blur-2xl" />
    </div>
    <button
      type="button"
      onClick={onRefresh}
      className="group inline-flex items-center gap-2 rounded-xl border border-[color:var(--color-border-1)] bg-background-1 px-5 py-3 text-sm font-semibold text-[color:var(--color-analytics-text-primary)] shadow-md transition-all hover:border-primary-5 hover:bg-gradient-to-r hover:from-primary-1 hover:to-primary-2 hover:shadow-lg hover:shadow-primary-3/20"
    >
      <RefreshCcw className="h-4 w-4 transition-transform group-hover:rotate-180" />
      Làm mới số liệu
    </button>
  </div>
);

const UserCardsSection: React.FC<{
  cards: UserCard[];
  isLoading: boolean;
  renderStatValue: (value: number) => React.ReactNode;
}> = ({ cards, isLoading, renderStatValue }) => (
  <section className="mb-8 space-y-4">
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-5 to-primary-6 shadow-lg shadow-primary-5/30">
          <Users className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[color:var(--color-analytics-text-primary)]">
            Thống kê người dùng
          </h2>
          <p className="text-xs text-[color:var(--color-analytics-text-muted)]">
            Dữ liệu thời gian thực
          </p>
        </div>
      </div>
      <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-1.5 text-xs font-semibold text-blue-700">
        <span className="text-base">👥</span>
        <span>People Insight</span>
      </span>
    </div>
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const TrendIcon = card.trendUp ? ArrowUpRight : ArrowDownRight;
        return (
          <Card
            key={card.id}
            className="group relative overflow-hidden border border-[color:var(--color-analytics-card-border)] bg-background-1 p-6 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="absolute inset-0 opacity-5">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white blur-2xl" />
              <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-white blur-xl" />
            </div>

            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${card.gradient} shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3`}
                >
                  <Icon className="h-7 w-7 text-white" />
                </div>
                {!isLoading && (
                  <div
                    className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                      card.trendUp
                        ? "bg-green-500/20 text-green-700"
                        : "bg-red-500/20 text-red-700"
                    }`}
                  >
                    <TrendIcon className="h-3 w-3" />
                    {card.trend}
                  </div>
                )}
              </div>

              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-analytics-text-muted)]">
                {card.title}
              </h3>

              <p className="text-3xl font-bold text-[color:var(--color-analytics-text-primary)]">
                {renderStatValue(card.value)}
              </p>

              <div className={`mt-4 h-1 w-full rounded-full bg-gradient-to-r ${card.gradient} opacity-90`} />
            </div>
          </Card>
        );
      })}
    </div>
  </section>
);

const UserHealthSection: React.FC<{
  activeRate: number;
  inactiveUsers: number;
  monthlyGrowth: number;
  isLoading: boolean;
  usersByStatusEntries: Array<{ status: string; percent: number }>;
  totalUsers?: number;
  activeUsers?: number;
}> = ({
  activeRate,
  inactiveUsers,
  monthlyGrowth,
  isLoading,
  usersByStatusEntries,
  totalUsers,
  activeUsers,
}) => (
  <section className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
    <Card className="relative overflow-hidden border border-[color:var(--color-analytics-card-border)] bg-background-1 p-6 shadow-xl shadow-primary-3/20">
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-primary-3/20 blur-3xl" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-5 to-primary-6 shadow-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-7">
                Tỷ lệ hoạt động
              </p>
              <p className="text-3xl font-bold text-[color:var(--color-analytics-text-primary)]">
                {isLoading ? "…" : `${activeRate.toFixed(1)}%`}
              </p>
            </div>
          </div>
          <div className="rounded-full bg-primary-5 px-3 py-1.5 text-xs font-bold text-white shadow-md">
            {isLoading ? "..." : `${activeUsers ?? 0} active`}
          </div>
        </div>
        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-neutral-3 shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary-4 via-primary-5 to-primary-6 shadow-md transition-[width] duration-500"
            style={{ width: `${Math.min(activeRate, 100)}%` }}
          />
        </div>
        <p className="mt-3 text-xs text-[color:var(--color-analytics-text-muted)]">
          Tổng:{" "}
          <span className="font-bold text-[color:var(--color-analytics-text-primary)]">
            {totalUsers?.toLocaleString("vi-VN") ?? "—"}
          </span>{" "}
          · Không hoạt động:{" "}
          <span className="font-bold text-[color:var(--color-analytics-text-primary)]">
            {inactiveUsers.toLocaleString("vi-VN")}
          </span>
        </p>
      </div>
    </Card>

    <Card className="relative overflow-hidden border border-[color:var(--color-analytics-card-border)] bg-background-1 p-6 shadow-xl shadow-emerald-500/20">
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-emerald-300/20 blur-3xl" />
      <div className="relative">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Tăng trưởng tháng
            </p>
            <p className="text-3xl font-bold text-[color:var(--color-analytics-text-primary)]">
              {isLoading ? "…" : `${monthlyGrowth.toFixed(1)}%`}
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-[color:var(--color-analytics-text-muted)]">
          Người dùng mới:{" "}
          <span className="font-bold text-emerald-700">
            {totalUsers?.toLocaleString("vi-VN") ?? "—"}
          </span>
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-1 text-xs font-bold text-white shadow-md">
            Duy trì tăng trưởng
          </span>
        </div>
      </div>
    </Card>

    <Card className="relative overflow-hidden border border-[color:var(--color-analytics-card-border)] bg-background-1 p-6 shadow-xl">
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-neutral-3/30 blur-3xl" />
      <div className="relative">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-6 to-neutral-8 shadow-lg">
            <PieChart className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--color-analytics-text-muted)]">
              Trạng thái
            </p>
            <p className="text-sm font-bold text-[color:var(--color-analytics-text-primary)]">
              Phân bố người dùng
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {isLoading && (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="h-4 w-20 animate-pulse rounded-lg bg-neutral-3" />
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-neutral-3" />
                  <span className="h-4 w-12 animate-pulse rounded-lg bg-neutral-3" />
                </div>
              ))}
            </div>
          )}
          {!isLoading &&
            usersByStatusEntries.map((item) => (
              <div key={item.status} className="flex items-center gap-3">
                <span className="min-w-[80px] text-xs font-bold uppercase text-[color:var(--color-analytics-text-muted)]">
                  {item.status}
                </span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-neutral-3 shadow-inner">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-5 to-primary-6 shadow-sm"
                    style={{ width: `${Math.min(item.percent, 100)}%` }}
                  />
                </div>
                <span className="min-w-[48px] text-right text-xs font-bold text-[color:var(--color-analytics-text-primary)]">
                  {item.percent}%
                </span>
              </div>
            ))}
        </div>
      </div>
    </Card>
  </section>
);

const ProductCardsSection: React.FC<{
  cards: ProductCard[];
  renderStatValue: (value: number) => React.ReactNode;
}> = ({ cards, renderStatValue }) => (
  <section className="mb-8 space-y-4">
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg shadow-orange-500/30">
          <Package className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[color:var(--color-analytics-text-primary)]">
            Thống kê sản phẩm
          </h2>
          <p className="text-xs text-[color:var(--color-analytics-text-muted)]">
            Tình trạng kho hàng
          </p>
        </div>
      </div>
      <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 px-4 py-1.5 text-xs font-semibold text-orange-700">
        <span className="text-base">🛒</span>
        <span>Store Health</span>
      </span>
    </div>
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.id}
            className="group relative overflow-hidden border border-[color:var(--color-analytics-card-border)] bg-background-1 p-6 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            <div className="absolute inset-0 opacity-5">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white blur-2xl" />
              <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-white blur-xl" />
            </div>

            <div className="relative">
              <div className="mb-4 flex items-start justify-between">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${card.gradient} shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3`}
                >
                  <Icon className="h-7 w-7 text-white" />
                </div>
              </div>

              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[color:var(--color-analytics-text-muted)]">
                {card.title}
              </h3>

              <p className="text-3xl font-bold text-[color:var(--color-analytics-text-primary)]">
                {renderStatValue(card.value)}
              </p>

              <p className="mt-2 text-xs font-medium text-[color:var(--color-analytics-text-muted)]">
                {card.description}
              </p>

              <div className={`mt-4 h-1 w-full rounded-full bg-gradient-to-r ${card.gradient} opacity-90`} />
            </div>
          </Card>
        );
      })}
    </div>
  </section>
);

const TopSellingSection: React.FC<{
  items: Array<TopSellingProduct | null>;
  isLoading: boolean;
  formatCurrency: (value?: number) => string;
  formatNumber: (value?: number) => string;
  colors: AnalyticsColors;
}> = ({ items, isLoading, formatCurrency, formatNumber, colors }) => (
  <Card
    className="relative overflow-hidden border border-[color:var(--color-analytics-card-border)] bg-background-1 p-8 shadow-xl"
    style={{
      background: `linear-gradient(145deg, ${colors.cardStart}, ${colors.cardEnd})`,
    }}
  >
    <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-primary-3/10 blur-3xl" />
    <div className="relative">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/30">
            <Star className="h-7 w-7 text-white" />
          </span>
          <div>
            <h2 className="text-2xl font-bold text-[color:var(--color-analytics-text-primary)]">
              Sản phẩm bán chạy
            </h2>
            <p className="text-sm text-[color:var(--color-analytics-text-muted)]">
              Top 8 sản phẩm nổi bật với doanh thu cao nhất
            </p>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-2 text-xs font-semibold text-amber-700 shadow-md">
          <ShoppingBag className="h-4 w-4" />
          <span>Hiệu suất cửa hàng</span>
        </div>
      </div>

      {items.length === 0 && !isLoading ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[color:var(--color-analytics-card-border)] bg-background-1/60 p-12 text-sm text-[color:var(--color-analytics-text-muted)]">
          <BarChart3 className="h-8 w-8 text-neutral-5" />
          <p className="font-medium text-[color:var(--color-analytics-text-primary)]">
            Chưa có dữ liệu bán chạy
          </p>
          <p className="text-xs">Hãy thử làm mới hoặc chờ đơn hàng</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {items.map((product, index) => {
            if (!product) {
              return (
                <div
                  key={index}
                  className="flex flex-col gap-3 rounded-2xl border border-[color:var(--color-analytics-card-border)] bg-background-1/80 p-5 shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-8 w-8 animate-pulse rounded-full bg-neutral-3" />
                    <span className="h-6 w-14 animate-pulse rounded bg-neutral-3" />
                  </div>
                  <div className="flex gap-3">
                    <div className="h-16 w-16 animate-pulse rounded-xl bg-neutral-3" />
                    <div className="flex flex-1 flex-col gap-2">
                      <span className="h-4 w-32 animate-pulse rounded bg-neutral-3" />
                      <span className="h-3 w-24 animate-pulse rounded bg-neutral-3" />
                      <span className="h-3 w-20 animate-pulse rounded bg-neutral-3" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="h-4 w-full animate-pulse rounded bg-neutral-3" />
                    <span className="h-4 w-full animate-pulse rounded bg-neutral-3" />
                    <span className="h-4 w-full animate-pulse rounded bg-neutral-3" />
                    <span className="h-4 w-full animate-pulse rounded bg-neutral-3" />
                  </div>
                </div>
              );
            }

            const initial = product.productName?.charAt(0).toUpperCase() || "P";

            return (
              <div
                key={product.productId || index}
                className="group relative flex h-full flex-col gap-4 rounded-2xl border border-[color:var(--color-analytics-card-border)] bg-background-1/80 p-5 shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-primary-4 hover:shadow-xl hover:shadow-primary-3/20"
              >
                <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-md">
                  <Star className="h-3 w-3 fill-white" />#{index + 1}
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 overflow-hidden rounded-xl shadow-md ring-2 ring-[color:var(--color-border-1)]">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.productName}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.src =
                            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80";
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-2 to-primary-5 text-lg font-semibold text-white">
                        {initial}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-semibold text-[color:var(--color-analytics-text-primary)] line-clamp-2 transition-colors hover:text-primary-6">
                      {product.productName}
                    </h3>
                    <p className="text-xs text-[color:var(--color-analytics-text-muted)] line-clamp-1">
                      <span className="inline-flex items-center gap-1">
                        <Tag className="h-3 w-3 text-neutral-5" />
                        {product.category}
                      </span>
                    </p>
                    <div className="mt-1 grid grid-cols-2 gap-2 text-[11px] text-[color:var(--color-analytics-text-muted)]">
                      <div className="flex items-center gap-1 rounded-lg bg-neutral-2 px-2 py-1">
                        <DollarSign className="h-3 w-3 text-primary-6" />
                        <span>{formatCurrency(product.price)}</span>
                      </div>
                      <div className="flex items-center gap-1 rounded-lg bg-neutral-2 px-2 py-1">
                        <BarChart3 className="h-3 w-3 text-primary-6" />
                        <span>{formatNumber(product.salesCount)} lượt</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  </Card>
);

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
        gradient: "from-blue-500 via-blue-600 to-indigo-600",
        bgGradient: "from-blue-50 via-blue-100 to-indigo-50",
        iconBg: "bg-blue-500",
        shadowColor: "shadow-blue-500/20",
        trend: "+12.5%",
        trendUp: true,
      },
      {
        id: "active-users",
        title: "Người dùng hoạt động",
        value: userStatistics?.activeUsers ?? 0,
        icon: Activity,
        gradient: "from-emerald-500 via-green-600 to-teal-600",
        bgGradient: "from-emerald-50 via-green-100 to-teal-50",
        iconBg: "bg-emerald-500",
        shadowColor: "shadow-emerald-500/20",
        trend: "+8.3%",
        trendUp: true,
      },
      {
        id: "new-users-month",
        title: "Người dùng mới (tháng này)",
        value: userStatistics?.newUsersThisMonth ?? 0,
        icon: TrendingUp,
        gradient: "from-purple-500 via-violet-600 to-fuchsia-600",
        bgGradient: "from-purple-50 via-violet-100 to-fuchsia-50",
        iconBg: "bg-purple-500",
        shadowColor: "shadow-purple-500/20",
        trend: "+15.7%",
        trendUp: true,
      },
      {
        id: "total-products",
        title: "Tổng sản phẩm",
        value: productStatistics?.totalProducts ?? 0,
        icon: Package,
        gradient: "from-orange-500 via-amber-600 to-yellow-600",
        bgGradient: "from-orange-50 via-amber-100 to-yellow-50",
        iconBg: "bg-orange-500",
        shadowColor: "shadow-orange-500/20",
        trend: "+5.2%",
        trendUp: true,
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
        gradient: "from-green-500 via-emerald-600 to-teal-600",
        bgGradient: "from-green-50 via-emerald-100 to-teal-50",
        iconBg: "bg-green-500",
        shadowColor: "shadow-green-500/20",
        description: "Đang kinh doanh",
      },
      {
        id: "low-stock-products",
        title: "Sản phẩm sắp hết",
        value: productStatistics?.lowStockProducts ?? 0,
        icon: AlertCircle,
        gradient: "from-yellow-500 via-amber-600 to-orange-600",
        bgGradient: "from-yellow-50 via-amber-100 to-orange-50",
        iconBg: "bg-yellow-500",
        shadowColor: "shadow-yellow-500/20",
        description: "Cần nhập thêm",
      },
      {
        id: "out-of-stock-products",
        title: "Hết hàng",
        value: productStatistics?.outOfStockProducts ?? 0,
        icon: XCircle,
        gradient: "from-red-500 via-rose-600 to-pink-600",
        bgGradient: "from-red-50 via-rose-100 to-pink-50",
        iconBg: "bg-red-500",
        shadowColor: "shadow-red-500/20",
        description: "Tạm ngừng bán",
      },
    ],
    [productStatistics]
  );

  const renderStatValue = (value: number) =>
    isLoading ? (
      <span className="inline-flex h-8 w-24 animate-pulse rounded-lg bg-neutral-3" />
    ) : (
      value.toLocaleString("vi-VN")
    );

  const formatCurrency = (value?: number) =>
    value !== undefined && value !== null
      ? value.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
      : "—";

  const formatNumber = (value?: number) =>
    value !== undefined && value !== null ? value.toLocaleString("vi-VN") : "—";

  const topSellingItems: Array<TopSellingProduct | null> = isLoading
    ? Array.from({ length: 8 }, () => null)
    : productStatistics?.topSellingProducts?.slice(0, 8) || [];

  const usersByStatusEntries = useMemo(() => {
    const entries = Object.entries(userStatistics?.usersByStatus || {});
    const total = entries.reduce((sum, [, val]) => sum + val, 0);
    return entries.map(([status, val]) => ({
      status,
      value: val,
      percent: total > 0 ? Math.round((val / total) * 1000) / 10 : 0,
    }));
  }, [userStatistics?.usersByStatus]);

  const activeRate = userStatistics?.activeRate ?? 0;
  const monthlyGrowth = userStatistics?.monthlyGrowth ?? 0;
  const inactiveUsers = userStatistics?.inactiveUsers ?? 0;
  const analyticsColors = useAnalyticsColors();

  return (
    <div
      className="min-h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] overflow-y-auto hidden-scrollbar bg-background-1 p-6"
      style={{ color: analyticsColors.textPrimary }}
    >
      <HeaderSection onRefresh={fetchDashboardData} />
      <UserCardsSection
        cards={userCards}
        isLoading={isLoading}
        renderStatValue={renderStatValue}
      />
      <UserHealthSection
        activeRate={activeRate}
        inactiveUsers={inactiveUsers}
        monthlyGrowth={monthlyGrowth}
        isLoading={isLoading}
        usersByStatusEntries={usersByStatusEntries}
        totalUsers={userStatistics?.totalUsers}
        activeUsers={userStatistics?.activeUsers}
      />
      <ProductCardsSection
        cards={productCards}
        renderStatValue={renderStatValue}
      />
      <TopSellingSection
        items={topSellingItems}
        isLoading={isLoading}
        formatCurrency={formatCurrency}
        formatNumber={formatNumber}
        colors={analyticsColors}
      />
    </div>
  );
};

export default DashboardPage;