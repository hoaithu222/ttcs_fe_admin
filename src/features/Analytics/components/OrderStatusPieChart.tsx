import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { OrderStatusDistribution as OrderStatusDistributionItem } from "@/core/api/analytics/type";
import { Card } from "@/foundation/components/info/Card";
import { BarChart3 } from "lucide-react";

interface OrderStatusPieChartProps {
  data: OrderStatusDistributionItem[];
  isLoading?: boolean;
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

const OrderStatusPieChart: React.FC<OrderStatusPieChartProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="w-5 h-5 text-primary-6" />
          <h2 className="text-xl font-bold text-neutral-10">Phân bổ trạng thái đơn hàng</h2>
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
          <h2 className="text-xl font-bold text-neutral-10">Phân bổ trạng thái đơn hàng</h2>
        </div>
        <div className="h-80 flex items-center justify-center">
          <p className="text-neutral-6">Chưa có dữ liệu</p>
        </div>
      </Card>
    );
  }

  // Format data for chart
  const chartData = data.map((item, index) => ({
    name: item.status,
    value: item.count,
    percentage: item.percentage || 0,
    color: COLORS[index % COLORS.length],
  }));

  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        <BarChart3 className="w-5 h-5 text-primary-6" />
        <h2 className="text-xl font-bold text-neutral-10">Phân bổ trạng thái đơn hàng</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
              formatter={(value: number, name: string, props: any) => {
                return [
                  `${value} (${props.payload.percentage.toFixed(1)}%)`,
                  "Số lượng",
                ];
              }}
            />
            <Legend
              formatter={(value, entry: any) => {
                return `${value}: ${entry.payload.percentage.toFixed(1)}%`;
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="flex flex-col justify-center space-y-3">
          <div className="text-center mb-4">
            <p className="text-sm text-neutral-6 mb-1">Tổng số đơn hàng</p>
            <p className="text-3xl font-bold text-primary-6">{total.toLocaleString("vi-VN")}</p>
          </div>
          <div className="space-y-2">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-neutral-2 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-neutral-10">{item.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-neutral-10">{item.value.toLocaleString("vi-VN")}</p>
                  <p className="text-xs text-neutral-6">{item.percentage.toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OrderStatusPieChart;

