import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { OrderStatusDistribution } from "@/core/api/analytics/type";
import { Card } from "@/foundation/components/info/Card";
import { Filter } from "lucide-react";

interface FunnelChartProps {
  data: OrderStatusDistribution[];
  isLoading?: boolean;
}

const FunnelChartComponent: React.FC<FunnelChartProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-primary-6" />
          <h2 className="text-xl font-bold text-neutral-10">Funnel trạng thái đơn hàng</h2>
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
          <Filter className="w-5 h-5 text-primary-6" />
          <h2 className="text-xl font-bold text-neutral-10">Funnel trạng thái đơn hàng</h2>
        </div>
        <div className="h-80 flex items-center justify-center">
          <p className="text-neutral-6">Chưa có dữ liệu</p>
        </div>
      </Card>
    );
  }

  // Sort by count descending for funnel effect
  const sortedData = [...data].sort((a, b) => b.count - a.count);
  const maxCount = Math.max(...sortedData.map((d) => d.count));

  const funnelData = sortedData.map((item, index) => ({
    status: item.status,
    count: item.count,
    percentage: item.percentage || 0,
    width: maxCount > 0 ? (item.count / maxCount) * 100 : 0,
  }));

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="w-5 h-5 text-primary-6" />
        <h2 className="text-xl font-bold text-neutral-10">Funnel trạng thái đơn hàng</h2>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={funnelData}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" stroke="#6b7280" tick={{ fill: "#6b7280" }} />
          <YAxis
            dataKey="status"
            type="category"
            width={80}
            stroke="#6b7280"
            tick={{ fill: "#6b7280", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
            formatter={(value: number, name: string, props: any) => {
              if (name === "count") {
                return [
                  `${value.toLocaleString("vi-VN")} (${props.payload.percentage.toFixed(1)}%)`,
                  "Số lượng",
                ];
              }
              return [value, name];
            }}
          />
          <Bar
            dataKey="count"
            fill="#8b5cf6"
            radius={[0, 8, 8, 0]}
            label={{ position: "right", fill: "#6b7280", fontSize: 12 }}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default FunnelChartComponent;

