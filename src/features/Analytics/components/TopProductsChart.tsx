import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TopProduct } from "@/core/api/analytics/type";
import { Card } from "@/foundation/components/info/Card";
import { Package } from "lucide-react";

interface TopProductsChartProps {
  data: TopProduct[];
  isLoading?: boolean;
}

const TopProductsChart: React.FC<TopProductsChartProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Package className="w-5 h-5 text-primary-6" />
          <h2 className="text-xl font-bold text-neutral-10">Top sản phẩm bán chạy</h2>
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
          <Package className="w-5 h-5 text-primary-6" />
          <h2 className="text-xl font-bold text-neutral-10">Top sản phẩm bán chạy</h2>
        </div>
        <div className="h-80 flex items-center justify-center">
          <p className="text-neutral-6">Chưa có dữ liệu</p>
        </div>
      </Card>
    );
  }

  // Format data for chart (top 10)
  const chartData = data.slice(0, 10).map((product) => ({
    name: product.productName.length > 20
      ? `${product.productName.substring(0, 20)}...`
      : product.productName,
    revenue: product.revenue || 0,
    quantity: product.quantitySold || 0,
  }));

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Package className="w-5 h-5 text-primary-6" />
        <h2 className="text-xl font-bold text-neutral-10">Top sản phẩm bán chạy</h2>
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
              if (name === "quantity") {
                return [value, "Số lượng"];
              }
              return [value, name];
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: "20px" }}
            formatter={(value) => {
              if (value === "revenue") return "Doanh thu";
              if (value === "quantity") return "Số lượng bán";
              return value;
            }}
          />
          <Bar
            yAxisId="left"
            dataKey="revenue"
            fill="#10b981"
            radius={[8, 8, 0, 0]}
            name="revenue"
          />
          <Bar
            yAxisId="right"
            dataKey="quantity"
            fill="#3b82f6"
            radius={[8, 8, 0, 0]}
            name="quantity"
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default TopProductsChart;

