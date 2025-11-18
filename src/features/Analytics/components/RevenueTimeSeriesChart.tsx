import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TimeSeriesData } from "@/core/api/analytics/type";
import { Card } from "@/foundation/components/info/Card";
import { TrendingUp } from "lucide-react";

interface RevenueTimeSeriesChartProps {
  data: TimeSeriesData[];
  isLoading?: boolean;
}

const RevenueTimeSeriesChart: React.FC<RevenueTimeSeriesChartProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary-6" />
          <h2 className="text-xl font-bold text-neutral-10">Xu hướng doanh thu theo thời gian</h2>
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
          <h2 className="text-xl font-bold text-neutral-10">Xu hướng doanh thu theo thời gian</h2>
        </div>
        <div className="h-80 flex items-center justify-center">
          <p className="text-neutral-6">Chưa có dữ liệu</p>
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
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        <TrendingUp className="w-5 h-5 text-primary-6" />
        <h2 className="text-xl font-bold text-neutral-10">Xu hướng doanh thu theo thời gian</h2>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
              if (name === "customers") {
                return [value, "Khách hàng"];
              }
              return [value, name];
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: "20px" }}
            iconType="line"
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
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: "#10b981", r: 4 }}
            activeDot={{ r: 6 }}
            name="revenue"
          />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: "#3b82f6", r: 3 }}
            activeDot={{ r: 5 }}
            name="orders"
          />
          <Line
            type="monotone"
            dataKey="customers"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ fill: "#f59e0b", r: 3 }}
            activeDot={{ r: 5 }}
            name="customers"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default RevenueTimeSeriesChart;

