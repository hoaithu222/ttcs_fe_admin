import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { OrderStatusDistribution as OrderStatusDistributionItem } from "@/core/api/analytics/type";
import { Card } from "@/foundation/components/info/Card";
import { BarChart3 } from "lucide-react";
import { analyticsVar, chartTheme, formatPercent, tooltipStyle } from "./chartTheme";

interface OrderStatusPieChartProps {
  data: OrderStatusDistributionItem[];
  isLoading?: boolean;
}

const RING_COLORS = ["#22d3ee", "#facc15", "#fb7185", "#a855f7", "#34d399", "#0ea5e9"];

const OrderStatusPieChart: React.FC<OrderStatusPieChartProps> = ({ data, isLoading }) => {
  if (isLoading || !data || data.length === 0) {
    const message = isLoading ? "Đang tải dữ liệu..." : "Chưa có dữ liệu";
    return (
      <Card className={chartTheme.card} style={chartTheme.cardStyle}>
        <div className="flex items-center gap-2">
          <div className="rounded-2xl bg-cyan-500/15 p-3 text-cyan-300">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <p className={`text-xs ${chartTheme.copy.eyebrow}`}>ORDERS</p>
            <h2 className={`text-xl ${chartTheme.copy.heading}`}>Phân bổ trạng thái đơn hàng</h2>
          </div>
        </div>
        <div className={`flex h-80 items-center justify-center text-sm ${chartTheme.copy.muted}`}>
          {message}
        </div>
      </Card>
    );
  }

  // Format data for chart
  const chartData = data.map((item, index) => ({
    name: item.status,
    value: item.count,
    percentage: item.percentage || 0,
    color: RING_COLORS[index % RING_COLORS.length],
  }));

  const total = data.reduce((sum, item) => sum + item.count, 0);
  const leading = chartData.reduce((prev, curr) => (curr.value > prev.value ? curr : prev), chartData[0]);

  const panelSurfaceStyle = {
    border: `1px solid ${analyticsVar("analytics-card-border")}`,
    background: `linear-gradient(145deg, ${analyticsVar("analytics-card-start")} 0%, ${analyticsVar("analytics-card-end")} 160%)`,
  };

  return (
    <Card className={`${chartTheme.card} space-y-6`} style={chartTheme.cardStyle}>
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-cyan-500/15 p-3 text-cyan-300">
          <BarChart3 className="h-5 w-5" />
        </div>
        <div>
          <p className={`text-xs ${chartTheme.copy.eyebrow}`}>ORDERS</p>
          <h2 className={`text-xl ${chartTheme.copy.heading}`}>Phân bổ trạng thái đơn hàng</h2>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="relative h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                cornerRadius={8}
                dataKey="value"
                stroke="transparent"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={{ color: "#e2e8f0", fontWeight: 600 }}
                formatter={(value: number, name: string, props: any) => {
                  return [
                    `${value.toLocaleString("vi-VN")} (${formatPercent(props.payload.percentage)})`,
                    props.payload.name,
                  ];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center rounded-full text-center"
            style={{
              background: `linear-gradient(180deg, transparent 0%, ${analyticsVar("analytics-card-end")} 120%)`,
            }}
          >
            <p className={`text-xs ${chartTheme.copy.eyebrow}`}>CHIẾM</p>
            <p className={`text-3xl font-bold ${chartTheme.copy.primary}`}>
              {formatPercent(leading.percentage)}
            </p>
            <p className={`text-xs ${chartTheme.copy.muted}`}>{leading.name}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div
            className="rounded-2xl p-4 text-center shadow-inner"
            style={panelSurfaceStyle}
          >
            <p className={`text-xs ${chartTheme.copy.eyebrow}`}>TỔNG ĐƠN</p>
            <p className={`text-4xl font-bold tracking-tight ${chartTheme.copy.primary}`}>
              {total.toLocaleString("vi-VN")}
            </p>
            <p className={`text-sm ${chartTheme.copy.muted}`}>Trong khoảng thời gian chọn</p>
          </div>
          <div className="space-y-3">
            {chartData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-2xl p-3"
                style={panelSurfaceStyle}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className={`text-sm font-medium ${chartTheme.copy.primary}`}>{item.name}</span>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${chartTheme.copy.primary}`}>
                    {item.value.toLocaleString("vi-VN")}
                  </p>
                  <p className={`text-xs ${chartTheme.copy.muted}`}>{formatPercent(item.percentage)}</p>
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

