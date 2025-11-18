import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TimeSeriesData } from "@/core/api/analytics/type";
import { Card } from "@/foundation/components/info/Card";
import { TrendingUp } from "lucide-react";

interface RevenueAreaChartProps {
  data: TimeSeriesData[];
  isLoading?: boolean;
}

const RevenueAreaChart: React.FC<RevenueAreaChartProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary-6" />
          <h2 className="text-xl font-bold text-neutral-10">Biểu đồ vùng doanh thu</h2>
        </div>
        <div className="h-80 flex items-center justify-center">
          <p className="text-neutral-6">Đang tải dữ liệu...</p>
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary-6" />
          <h2 className="text-xl font-bold text-neutral-10">Biểu đồ vùng doanh thu</h2>
        </div>
        <div className="h-80 flex items-center justify-center">
          <p className="text-neutral-6">Chưa có dữ liệu</p>
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
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        <TrendingUp className="w-5 h-5 text-primary-6" />
        <h2 className="text-xl font-bold text-neutral-10">Biểu đồ vùng doanh thu</h2>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            style={{ fontSize: "12px" }}
            tick={{ fill: "#6b7280" }}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: "12px" }}
            tick={{ fill: "#6b7280" }}
            tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
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
          <Legend
            wrapperStyle={{ paddingTop: "20px" }}
            formatter={(value) => {
              if (value === "revenue") return "Doanh thu";
              if (value === "orders") return "Đơn hàng";
              return value;
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#colorRevenue)"
            name="revenue"
          />
          <Area
            type="monotone"
            dataKey="orders"
            stroke="#3b82f6"
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

