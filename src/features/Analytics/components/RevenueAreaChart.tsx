import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TimeSeriesData } from "@/core/api/analytics/type";
import { Card } from "@/foundation/components/info/Card";
import { TrendingUp } from "lucide-react";
import {
  axisLabelStyle,
  axisTickStyle,
  chartTheme,
  formatLargeNumber,
  legendWrapperStyle,
  tooltipStyle,
} from "./chartTheme";

interface RevenueAreaChartProps {
  data: TimeSeriesData[];
  isLoading?: boolean;
}

const RevenueAreaChart: React.FC<RevenueAreaChartProps> = ({ data, isLoading }) => {
  if (isLoading || !data || data.length === 0) {
    const message = isLoading ? "Đang tải dữ liệu..." : "Chưa có dữ liệu";
    return (
      <Card className={chartTheme.card} style={chartTheme.cardStyle}>
        <div className="flex items-center gap-2">
          <div className="rounded-2xl bg-sky-500/15 p-3 text-sky-300">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className={`text-xs ${chartTheme.copy.eyebrow}`}>FORECAST</p>
            <h2 className={`text-xl ${chartTheme.copy.heading}`}>Biểu đồ vùng doanh thu</h2>
          </div>
        </div>
        <div className={`flex h-80 items-center justify-center text-sm ${chartTheme.copy.muted}`}>
          {message}
        </div>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString("vi-VN", { month: "short", day: "numeric" }),
    revenue: item.revenue || 0,
    orders: item.orders || 0,
  }));

  return (
    <Card className={chartTheme.card} style={chartTheme.cardStyle}>
      <div className="flex items-center gap-3 pb-4">
        <div className="rounded-2xl bg-sky-500/15 p-3 text-sky-300">
          <TrendingUp className="h-5 w-5" />
        </div>
        <div>
          <p className={`text-xs ${chartTheme.copy.eyebrow}`}>MOMENTUM</p>
          <h2 className={`text-xl ${chartTheme.copy.heading}`}>Biểu đồ vùng doanh thu</h2>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={chartData} margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.7} />
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="4 8"
            stroke={chartTheme.gridStroke}
            vertical={false}
          />
          <XAxis dataKey="date" tick={axisTickStyle} tickLine={false} axisLine={false} />
          <YAxis
            tick={axisTickStyle}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => formatLargeNumber(value)}
            label={{
              ...axisLabelStyle,
              value: "Giá trị (đ)",
              angle: -90,
              position: "insideLeft",
            }}
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
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#22d3ee"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorRevenue)"
            name="revenue"
          />
          <Area
            type="monotone"
            dataKey="orders"
            stroke="#a855f7"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorOrders)"
            name="orders"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default RevenueAreaChart;

