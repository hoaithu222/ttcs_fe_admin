import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TopShop } from "@/core/api/analytics/type";
import { Card } from "@/foundation/components/info/Card";
import { ShoppingBag } from "lucide-react";
import {
  axisTickStyle,
  chartTheme,
  formatLargeNumber,
  legendWrapperStyle,
  tooltipStyle,
} from "./chartTheme";

interface TopShopsChartProps {
  data: TopShop[];
  isLoading?: boolean;
}

const TopShopsChart: React.FC<TopShopsChartProps> = ({ data, isLoading }) => {
  if (isLoading || !data || data.length === 0) {
    const message = isLoading ? "Đang tải dữ liệu..." : "Chưa có dữ liệu";
    return (
      <Card className={chartTheme.card} style={chartTheme.cardStyle}>
        <div className="flex items-center gap-2">
          <div className="rounded-2xl bg-amber-500/15 p-3 text-amber-300">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <p className={`text-xs ${chartTheme.copy.eyebrow}`}>STORES</p>
            <h2 className={`text-xl ${chartTheme.copy.heading}`}>Top cửa hàng hàng đầu</h2>
          </div>
        </div>
        <div className={`flex h-80 items-center justify-center text-sm ${chartTheme.copy.muted}`}>
          {message}
        </div>
      </Card>
    );
  }

  // Format data for chart (top 10)
  const chartData = data.slice(0, 10).map((shop) => ({
    name: shop.shopName.length > 15 ? `${shop.shopName.substring(0, 15)}...` : shop.shopName,
    revenue: shop.totalRevenue || 0,
    orders: shop.totalOrders || 0,
  }));

  return (
    <Card className={chartTheme.card} style={chartTheme.cardStyle}>
      <div className="flex items-center gap-3 pb-4">
        <div className="rounded-2xl bg-amber-500/15 p-3 text-amber-300">
          <ShoppingBag className="h-5 w-5" />
        </div>
        <div>
          <p className={`text-xs ${chartTheme.copy.eyebrow}`}>STORES</p>
          <h2 className={`text-xl ${chartTheme.copy.heading}`}>Top cửa hàng hàng đầu</h2>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 24, left: 10, bottom: 60 }}
          barGap={12}
        >
          <CartesianGrid
            strokeDasharray="4 8"
            stroke={chartTheme.gridStroke}
            vertical={false}
          />
          <XAxis
            dataKey="name"
            angle={-35}
            textAnchor="end"
            height={80}
            tick={axisTickStyle}
            tickLine={false}
            axisLine={{ stroke: chartTheme.gridStroke }}
          />
          <YAxis
            yAxisId="left"
            tick={axisTickStyle}
            tickFormatter={(value) => formatLargeNumber(value)}
            axisLine={{ stroke: chartTheme.gridStroke }}
            tickLine={false}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={axisTickStyle}
            axisLine={{ stroke: chartTheme.gridStroke }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={{ color: "#e2e8f0", fontWeight: 600 }}
            formatter={(value: number, name: string) => {
              if (name === "revenue") {
                return [`${value.toLocaleString("vi-VN")} đ`, "Doanh thu"];
              }
              if (name === "orders") {
                return [value, "Đơn hàng"];
              }
              return [value, name];
            }}
          />
          <Legend wrapperStyle={legendWrapperStyle} iconType="circle" />
          <Bar
            yAxisId="left"
            dataKey="revenue"
            fill="url(#shopRevenue)"
            name="revenue"
            radius={[12, 12, 4, 4]}
          />
          <Bar
            yAxisId="right"
            dataKey="orders"
            fill="url(#shopOrders)"
            name="orders"
            radius={[12, 12, 4, 4]}
          />
          <defs>
            <linearGradient id="shopRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#c2410c" />
            </linearGradient>
            <linearGradient id="shopOrders" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#be123c" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default TopShopsChart;

