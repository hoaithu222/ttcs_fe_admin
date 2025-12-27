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
import { SystemLoadItem } from "@/core/api/analytics/type";
import { Card } from "@/foundation/components/info/Card";
import { Activity } from "lucide-react";
import {
  axisTickStyle,
  chartTheme,
  formatLargeNumber,
  tooltipStyle,
} from "./chartTheme";

interface SystemLoadChartProps {
  data: SystemLoadItem[];
  isLoading?: boolean;
}

const SystemLoadChart: React.FC<SystemLoadChartProps> = ({ data, isLoading }) => {
  if (isLoading || !data || data.length === 0) {
    const message = isLoading ? "Đang tải dữ liệu..." : "Chưa có dữ liệu";
    return (
      <Card className={chartTheme.card} style={chartTheme.cardStyle}>
        <div className="flex items-center gap-2">
          <div className="rounded-2xl bg-orange-500/15 p-3 text-orange-300">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <p className={`text-xs ${chartTheme.copy.eyebrow}`}>SYSTEM LOAD</p>
            <h2 className={`text-xl ${chartTheme.copy.heading}`}>
              Thống kê truy cập & Tải hệ thống
            </h2>
          </div>
        </div>
        <div className={`flex h-80 items-center justify-center text-sm ${chartTheme.copy.muted}`}>
          {message}
        </div>
      </Card>
    );
  }

  // Format timestamp for display
  const chartData = data.map((item) => ({
    timestamp: item.timestamp,
    requestCount: item.requestCount,
    comparisonValue: item.comparisonValue,
    // Calculate percentage change
    changePercent:
      item.comparisonValue > 0
        ? ((item.requestCount - item.comparisonValue) / item.comparisonValue) * 100
        : 0,
  }));

  return (
    <Card className={`${chartTheme.card} space-y-4`} style={chartTheme.cardStyle}>
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-orange-500/15 p-3 text-orange-300">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <p className={`text-xs ${chartTheme.copy.eyebrow}`}>SYSTEM LOAD</p>
          <h2 className={`text-xl ${chartTheme.copy.heading}`}>
            Thống kê truy cập & Tải hệ thống
          </h2>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid
            strokeDasharray="4 8"
            stroke={chartTheme.gridStroke}
            vertical={false}
          />
          <XAxis
            dataKey="timestamp"
            tick={axisTickStyle}
            axisLine={{ stroke: chartTheme.gridStroke }}
            tickLine={false}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            yAxisId="left"
            tick={axisTickStyle}
            axisLine={{ stroke: chartTheme.gridStroke }}
            tickLine={false}
            tickFormatter={(value) => formatLargeNumber(value)}
            label={{
              value: "Số lượng Request",
              angle: -90,
              position: "insideLeft",
              fill: chartTheme.axisLabel,
            }}
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3", stroke: "rgba(248,250,252,0.35)" }}
            contentStyle={tooltipStyle}
            labelStyle={{ color: "#e2e8f0", fontWeight: 600 }}
            formatter={(value: number, name: string, props: any) => {
              if (name === "requestCount") {
                return [
                  `${value.toLocaleString("vi-VN")} requests`,
                  "Request hiện tại",
                ];
              }
              if (name === "comparisonValue") {
                return [
                  `${value.toLocaleString("vi-VN")} requests`,
                  "So sánh (cùng giờ hôm qua/trung bình tuần)",
                ];
              }
              return [value, name];
            }}
            labelFormatter={(label) => `Thời điểm: ${label}`}
          />
          <Legend
            wrapperStyle={{ paddingTop: 20 }}
            iconType="line"
            formatter={(value) => {
              const labels: Record<string, string> = {
                requestCount: "Request hiện tại (Real-time)",
                comparisonValue: "So sánh (cùng giờ hôm qua/trung bình tuần)",
              };
              return labels[value] || value;
            }}
          />

          {/* Bar Chart: Real-time Request Count */}
          <Bar
            yAxisId="left"
            dataKey="requestCount"
            fill="#22c55e"
            name="requestCount"
            radius={[4, 4, 0, 0]}
          />

          {/* Line Chart: Comparison Value */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="comparisonValue"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: "#3b82f6", r: 4 }}
            name="comparisonValue"
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Alert indicator for high load */}
      {chartData.some(
        (item) => item.changePercent > 50 && item.requestCount > item.comparisonValue
      ) && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
          <p className="text-sm font-semibold text-amber-400">
            ⚠️ Cảnh báo: Phát hiện lượng truy cập tăng đột biến. Có thể là DDOS hoặc sự cố hệ
            thống.
          </p>
        </div>
      )}

      <div className={`text-sm ${chartTheme.copy.muted}`}>
        <p>
          * Cột xanh: Số lượng Request/Truy cập API tại thời điểm hiện tại (Real-time) | Đường
          xanh dương: So sánh với cùng giờ ngày hôm qua hoặc trung bình tuần trước
        </p>
      </div>
    </Card>
  );
};

export default SystemLoadChart;

