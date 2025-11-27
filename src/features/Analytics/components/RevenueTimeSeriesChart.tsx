import React from "react";
import {
  LineChart,
  Line,
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

interface RevenueTimeSeriesChartProps {
  data: TimeSeriesData[];
  isLoading?: boolean;
}

const RevenueTimeSeriesChart: React.FC<RevenueTimeSeriesChartProps> = ({ data, isLoading }) => {
  if (isLoading || !data || data.length === 0) {
    const message = isLoading ? "Đang tải dữ liệu..." : "Chưa có dữ liệu";
    return (
      <Card className={chartTheme.card} style={chartTheme.cardStyle}>
        <div className="flex items-center gap-2">
          <div className="rounded-2xl bg-emerald-500/15 p-3 text-emerald-300">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className={`text-xs ${chartTheme.copy.eyebrow}`}>TREND</p>
            <h2 className={`text-xl ${chartTheme.copy.heading}`}>Xu hướng doanh thu theo thời gian</h2>
          </div>
        </div>
        <div className={`flex h-80 items-center justify-center text-sm ${chartTheme.copy.muted}`}>
          {message}
        </div>
      </Card>
    );
  }

  // Format data for chart
  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString("vi-VN", { month: "short", day: "numeric" }),
    revenue: item.revenue || 0,
    orders: item.orders || 0,
    customers: item.customers || 0,
  }));

  return (
    <Card className={chartTheme.card} style={chartTheme.cardStyle}>
      <div className="flex items-center gap-3 pb-4">
        <div className="rounded-2xl bg-emerald-500/15 p-3 text-emerald-300">
          <TrendingUp className="h-5 w-5" />
        </div>
        <div>
          <p className={`text-xs ${chartTheme.copy.eyebrow}`}>REVENUE</p>
          <h2 className={`text-xl ${chartTheme.copy.heading}`}>Xu hướng doanh thu theo thời gian</h2>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="orderGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="4 8"
            stroke={chartTheme.gridStroke}
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={axisTickStyle}
            tickLine={false}
            axisLine={{ stroke: chartTheme.gridStroke }}
          />
          <YAxis
            tick={axisTickStyle}
            axisLine={{ stroke: chartTheme.gridStroke }}
            tickLine={false}
            tickFormatter={(value) => formatLargeNumber(value)}
            label={{ ...axisLabelStyle, value: "Giá trị (đ)", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={{ color: "#e2e8f0", fontWeight: 600 }}
            formatter={(value: number, name: string) => {
              if (name === "revenue") {
                return [`${value.toLocaleString("vi-VN")} đ`, "Hiện tại"];
              }
              if (name === "orders") {
                return [value, "Đơn hàng"];
              }
              if (name === "customers") {
                return [value, "Khách hàng"];
              }
              return [value, name];
            }}
          />
          <Legend
            wrapperStyle={legendWrapperStyle}
            iconType="circle"
            formatter={(value) => {
              if (value === "revenue") return "Doanh thu";
              if (value === "orders") return "Đơn hàng";
              if (value === "customers") return "Khách hàng";
              return value;
            }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#34d399"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 5, strokeWidth: 0 }}
            name="revenue"
            fill="url(#revenueGradient)"
          />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#60a5fa"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5, strokeWidth: 0 }}
            name="orders"
          />
          <Line
            type="monotone"
            dataKey="customers"
            stroke="#fbbf24"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5, strokeWidth: 0 }}
            name="customers"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default RevenueTimeSeriesChart;

