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
import {
  axisTickStyle,
  chartTheme,
  formatLargeNumber,
  legendWrapperStyle,
  tooltipStyle,
} from "./chartTheme";

interface ComposedChartProps {
  data: TopProduct[];
  isLoading?: boolean;
}

const ComposedChartComponent: React.FC<ComposedChartProps> = ({ data, isLoading }) => {
  if (isLoading || !data || data.length === 0) {
    const message = isLoading ? "Đang tải dữ liệu..." : "Chưa có dữ liệu";
    return (
      <Card className={chartTheme.card} style={chartTheme.cardStyle}>
        <div className="flex items-center gap-2">
          <div className="rounded-2xl bg-fuchsia-500/15 p-3 text-fuchsia-300">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <p className={`text-xs ${chartTheme.copy.eyebrow}`}>HYBRID</p>
            <h2 className={`text-xl ${chartTheme.copy.heading}`}>
              Biểu đồ kết hợp doanh thu & số lượng
            </h2>
          </div>
        </div>
        <div className={`flex h-80 items-center justify-center text-sm ${chartTheme.copy.muted}`}>
          {message}
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
    <Card className={chartTheme.card} style={chartTheme.cardStyle}>
      <div className="flex items-center gap-3 pb-4">
        <div className="rounded-2xl bg-fuchsia-500/15 p-3 text-fuchsia-300">
          <BarChart3 className="h-5 w-5" />
        </div>
        <div>
          <p className={`text-xs ${chartTheme.copy.eyebrow}`}>HYBRID</p>
          <h2 className={`text-xl ${chartTheme.copy.heading}`}>
            Biểu đồ kết hợp doanh thu & số lượng
          </h2>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={chartData} margin={{ top: 20, right: 24, left: 10, bottom: 60 }}>
          <CartesianGrid
            strokeDasharray="4 8"
            stroke={chartTheme.gridStroke}
            vertical={false}
          />
          <XAxis
            dataKey="name"
            angle={-35}
            textAnchor="end"
            height={80}
            tick={axisTickStyle}
            tickLine={false}
            axisLine={{ stroke: chartTheme.gridStroke }}
          />
          <YAxis
            yAxisId="left"
            tick={axisTickStyle}
            tickFormatter={(value) => formatLargeNumber(value)}
            axisLine={{ stroke: chartTheme.gridStroke }}
            tickLine={false}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={axisTickStyle}
            axisLine={{ stroke: chartTheme.gridStroke }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={{ color: "#e2e8f0", fontWeight: 600 }}
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
          <Legend wrapperStyle={legendWrapperStyle} iconType="circle" />
          <Bar
            yAxisId="left"
            dataKey="revenue"
            fill="url(#composedRevenue)"
            name="revenue"
            radius={[12, 12, 4, 4]}
          />
          <Bar
            yAxisId="right"
            dataKey="quantity"
            fill="url(#composedQuantity)"
            name="quantity"
            radius={[12, 12, 4, 4]}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="avgPrice"
            stroke="#facc15"
            strokeWidth={3}
            dot={{ fill: "#facc15", r: 5 }}
            name="avgPrice"
          />
          <defs>
            <linearGradient id="composedRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="composedQuantity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#312e81" />
            </linearGradient>
          </defs>
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default ComposedChartComponent;

