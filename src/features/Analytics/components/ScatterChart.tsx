import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TopProduct } from "@/core/api/analytics/type";
import { Card } from "@/foundation/components/info/Card";
import { Activity } from "lucide-react";

interface ScatterChartProps {
  data: TopProduct[];
  isLoading?: boolean;
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

const ScatterChartComponent: React.FC<ScatterChartProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Activity className="w-5 h-5 text-primary-6" />
          <h2 className="text-xl font-bold text-neutral-10">Phân tích tương quan giá & số lượng</h2>
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
          <Activity className="w-5 h-5 text-primary-6" />
          <h2 className="text-xl font-bold text-neutral-10">Phân tích tương quan giá & số lượng</h2>
        </div>
        <div className="h-80 flex items-center justify-center">
          <p className="text-neutral-6">Chưa có dữ liệu</p>
        </div>
      </Card>
    );
  }

  // Calculate average price per unit
  const scatterData = data.map((product, index) => ({
    x: product.quantitySold || 0,
    y: product.revenue && product.quantitySold
      ? Math.round(product.revenue / product.quantitySold)
      : 0,
    z: product.revenue || 0,
    name: product.productName,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Activity className="w-5 h-5 text-primary-6" />
        <h2 className="text-xl font-bold text-neutral-10">Phân tích tương quan giá & số lượng</h2>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            type="number"
            dataKey="x"
            name="Số lượng"
            label={{ value: "Số lượng bán", position: "insideBottom", offset: -5 }}
            stroke="#6b7280"
            tick={{ fill: "#6b7280" }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Giá TB"
            label={{ value: "Giá trung bình (đ)", angle: -90, position: "insideLeft" }}
            stroke="#6b7280"
            tick={{ fill: "#6b7280" }}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
            formatter={(value: number, name: string, props: any) => {
              if (name === "x") {
                return [value, "Số lượng bán"];
              }
              if (name === "y") {
                return [`${value.toLocaleString("vi-VN")} đ`, "Giá trung bình"];
              }
              if (name === "z") {
                return [`${value.toLocaleString("vi-VN")} đ`, "Tổng doanh thu"];
              }
              return [value, name];
            }}
            labelFormatter={(label) => `Sản phẩm: ${label}`}
          />
          <Scatter name="Sản phẩm" data={scatterData} fill="#8884d8">
            {scatterData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      <div className="mt-4 text-sm text-neutral-6">
        <p>* Trục X: Số lượng bán | Trục Y: Giá trung bình | Kích thước: Tổng doanh thu</p>
      </div>
    </Card>
  );
};

export default ScatterChartComponent;

