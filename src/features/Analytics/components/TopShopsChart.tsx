import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TopShop } from "@/core/api/analytics/type";
import { Card } from "@/foundation/components/info/Card";
import { ShoppingBag } from "lucide-react";

interface TopShopsChartProps {
  data: TopShop[];
  isLoading?: boolean;
}

const TopShopsChart: React.FC<TopShopsChartProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <ShoppingBag className="w-5 h-5 text-primary-6" />
          <h2 className="text-xl font-bold text-neutral-10">Top cửa hàng hàng đầu</h2>
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
          <ShoppingBag className="w-5 h-5 text-primary-6" />
          <h2 className="text-xl font-bold text-neutral-10">Top cửa hàng hàng đầu</h2>
        </div>
        <div className="h-80 flex items-center justify-center">
          <p className="text-neutral-6">Chưa có dữ liệu</p>
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
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        <ShoppingBag className="w-5 h-5 text-primary-6" />
        <h2 className="text-xl font-bold text-neutral-10">Top cửa hàng hàng đầu</h2>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={100}
            stroke="#6b7280"
            style={{ fontSize: "11px" }}
            tick={{ fill: "#6b7280" }}
          />
          <YAxis
            yAxisId="left"
            stroke="#6b7280"
            style={{ fontSize: "12px" }}
            tick={{ fill: "#6b7280" }}
            tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#6b7280"
            style={{ fontSize: "12px" }}
            tick={{ fill: "#6b7280" }}
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
              if (value === "orders") return "Số đơn hàng";
              return value;
            }}
          />
          <Bar
            yAxisId="left"
            dataKey="revenue"
            fill="#8b5cf6"
            radius={[8, 8, 0, 0]}
            name="revenue"
          />
          <Bar
            yAxisId="right"
            dataKey="orders"
            fill="#f59e0b"
            radius={[8, 8, 0, 0]}
            name="orders"
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default TopShopsChart;

