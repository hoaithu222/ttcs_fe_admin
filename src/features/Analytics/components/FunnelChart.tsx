import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { OrderStatusDistribution } from "@/core/api/analytics/type";
import { Card } from "@/foundation/components/info/Card";
import { Filter } from "lucide-react";
import {
  axisTickStyle,
  chartTheme,
  tooltipStyle,
} from "./chartTheme";

interface FunnelChartProps {
  data: OrderStatusDistribution[];
  isLoading?: boolean;
}

const FunnelChartComponent: React.FC<FunnelChartProps> = ({ data, isLoading }) => {
  if (isLoading || !data || data.length === 0) {
    const message = isLoading ? "Đang tải dữ liệu..." : "Chưa có dữ liệu";
    return (
      <Card className={chartTheme.card} style={chartTheme.cardStyle}>
        <div className="flex items-center gap-2">
          <div className="rounded-2xl bg-purple-500/15 p-3 text-purple-300">
            <Filter className="h-5 w-5" />
          </div>
          <div>
            <p className={`text-xs ${chartTheme.copy.eyebrow}`}>FUNNEL</p>
            <h2 className={`text-xl ${chartTheme.copy.heading}`}>Funnel trạng thái đơn hàng</h2>
          </div>
        </div>
        <div className={`flex h-80 items-center justify-center text-sm ${chartTheme.copy.muted}`}>
          {message}
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
    display: `${item.count.toLocaleString("vi-VN")} (${(item.percentage || 0).toFixed(1)}%)`,
  }));

  return (
    <Card className={chartTheme.card} style={chartTheme.cardStyle}>
      <div className="flex items-center gap-3 pb-4">
        <div className="rounded-2xl bg-purple-500/15 p-3 text-purple-300">
          <Filter className="h-5 w-5" />
        </div>
        <div>
          <p className={`text-xs ${chartTheme.copy.eyebrow}`}>FUNNEL</p>
          <h2 className={`text-xl ${chartTheme.copy.heading}`}>Funnel trạng thái đơn hàng</h2>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={funnelData}
          layout="vertical"
          margin={{ top: 20, right: 40, left: 120, bottom: 10 }}
        >
          <CartesianGrid
            strokeDasharray="0"
            stroke="rgba(255,255,255,0.05)"
            horizontal={false}
          />
          <XAxis type="number" hide />
          <YAxis
            dataKey="status"
            type="category"
            width={100}
            tick={axisTickStyle}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={{ color: "#e2e8f0", fontWeight: 600 }}
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
            fill="url(#funnelGradient)"
            radius={[0, 20, 20, 0]}
          >
            <LabelList
              dataKey="display"
              position="right"
              fill={chartTheme.axisTick}
              style={{ fontSize: 12 }}
            />
          </Bar>
          <defs>
            <linearGradient id="funnelGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default FunnelChartComponent;

