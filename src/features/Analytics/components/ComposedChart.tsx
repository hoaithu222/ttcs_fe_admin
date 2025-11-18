import React from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TopProduct } from "@/core/api/analytics/type";
import { Card } from "@/foundation/components/info/Card";
import { BarChart3 } from "lucide-react";

interface ComposedChartProps {
  data: TopProduct[];
  isLoading?: boolean;
}

const ComposedChartComponent: React.FC<ComposedChartProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="w-5 h-5 text-primary-6" />
          <h2 className="text-xl font-bold text-neutral-10">Biểu đồ kết hợp doanh thu & số lượng</h2>
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
          <BarChart3 className="w-5 h-5 text-primary-6" />
          <h2 className="text-xl font-bold text-neutral-10">Biểu đồ kết hợp doanh thu & số lượng</h2>
        </div>
        <div className="h-80 flex items-center justify-center">
          <p className="text-neutral-6">Chưa có dữ liệu</p>
        </div>
      </Card>
    );
  }

  const chartData = data.slice(0, 8).map((product) => ({
    name: product.productName.length > 15
      ? `${product.productName.substring(0, 15)}...`
      : product.productName,
    revenue: product.revenue || 0,
    quantity: product.quantitySold || 0,
    avgPrice: product.revenue && product.quantitySold
      ? Math.round(product.revenue / product.quantitySold)
      : 0,
  }));

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        <BarChart3 className="w-5 h-5 text-primary-6" />
        <h2 className="text-xl font-bold text-neutral-10">Biểu đồ kết hợp doanh thu & số lượng</h2>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
              if (name === "avgPrice") {
                return [`${value.toLocaleString("vi-VN")} đ`, "Giá TB"];
              }
              return [value, name];
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: "20px" }}
            formatter={(value) => {
              if (value === "revenue") return "Doanh thu";
              if (value === "quantity") return "Số lượng bán";
              if (value === "avgPrice") return "Giá trung bình";
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
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="avgPrice"
            stroke="#f59e0b"
            strokeWidth={3}
            dot={{ fill: "#f59e0b", r: 5 }}
            name="avgPrice"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default ComposedChartComponent;

