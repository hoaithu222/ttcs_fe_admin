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
import {
  axisTickStyle,
  chartTheme,
  formatLargeNumber,
  tooltipStyle,
} from "./chartTheme";

interface ScatterChartProps {
  data: TopProduct[];
  isLoading?: boolean;
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

const ScatterChartComponent: React.FC<ScatterChartProps> = ({ data, isLoading }) => {
  if (isLoading || !data || data.length === 0) {
    const message = isLoading ? "Đang tải dữ liệu..." : "Chưa có dữ liệu";
    return (
      <Card className={chartTheme.card} style={chartTheme.cardStyle}>
        <div className="flex items-center gap-2">
          <div className="rounded-2xl bg-rose-500/15 p-3 text-rose-300">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <p className={`text-xs ${chartTheme.copy.eyebrow}`}>CORRELATION</p>
            <h2 className={`text-xl ${chartTheme.copy.heading}`}>Phân tích tương quan giá & số lượng</h2>
          </div>
        </div>
        <div className={`flex h-80 items-center justify-center text-sm ${chartTheme.copy.muted}`}>
          {message}
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
    <Card className={`${chartTheme.card} space-y-4`} style={chartTheme.cardStyle}>
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-rose-500/15 p-3 text-rose-300">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <p className={`text-xs ${chartTheme.copy.eyebrow}`}>CORRELATION</p>
          <h2 className={`text-xl ${chartTheme.copy.heading}`}>Phân tích tương quan giá & số lượng</h2>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
          <CartesianGrid
            strokeDasharray="4 8"
            stroke={chartTheme.gridStroke}
            vertical={false}
          />
          <XAxis
            type="number"
            dataKey="x"
            name="Số lượng"
            label={{
              value: "Số lượng bán",
              position: "insideBottom",
              offset: -5,
              fill: chartTheme.axisLabel,
            }}
            tick={axisTickStyle}
            axisLine={{ stroke: chartTheme.gridStroke }}
            tickLine={false}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Giá TB"
            label={{
              value: "Giá trung bình (đ)",
              angle: -90,
              position: "insideLeft",
              fill: chartTheme.axisLabel,
            }}
            tick={axisTickStyle}
            axisLine={{ stroke: chartTheme.gridStroke }}
            tickLine={false}
            tickFormatter={(value) => formatLargeNumber(value)}
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3", stroke: "rgba(248,250,252,0.35)" }}
            contentStyle={tooltipStyle}
            labelStyle={{ color: "#e2e8f0", fontWeight: 600 }}
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
          <Scatter name="Sản phẩm" data={scatterData}>
            {scatterData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      <div className={`text-sm ${chartTheme.copy.muted}`}>
        <p>* Trục X: Số lượng bán | Trục Y: Giá trung bình | Kích thước: Tổng doanh thu</p>
      </div>
    </Card>
  );
};

export default ScatterChartComponent;

