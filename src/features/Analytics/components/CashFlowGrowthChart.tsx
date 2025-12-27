import React from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import { CashFlowItem } from "@/core/api/analytics/type";
import { Card } from "@/foundation/components/info/Card";
import { DollarSign } from "lucide-react";
import {
  axisTickStyle,
  chartTheme,
  formatLargeNumber,
  tooltipStyle,
} from "./chartTheme";

interface CashFlowGrowthChartProps {
  data: CashFlowItem[];
  isLoading?: boolean;
}

const CashFlowGrowthChart: React.FC<CashFlowGrowthChartProps> = ({
  data,
  isLoading,
}) => {
  if (isLoading || !data || data.length === 0) {
    const message = isLoading ? "Đang tải dữ liệu..." : "Chưa có dữ liệu";
    return (
      <Card className={chartTheme.card} style={chartTheme.cardStyle}>
        <div className="flex items-center gap-2">
          <div className="rounded-2xl bg-blue-500/15 p-3 text-blue-300">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <p className={`text-xs ${chartTheme.copy.eyebrow}`}>CASH FLOW</p>
            <h2 className={`text-xl ${chartTheme.copy.heading}`}>
              Dòng tiền & Tăng trưởng toàn sàn
            </h2>
          </div>
        </div>
        <div className={`flex h-80 items-center justify-center text-sm ${chartTheme.copy.muted}`}>
          {message}
        </div>
      </Card>
    );
  }

  return (
    <Card className={`${chartTheme.card} space-y-4`} style={chartTheme.cardStyle}>
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-blue-500/15 p-3 text-blue-300">
          <DollarSign className="h-5 w-5" />
        </div>
        <div>
          <p className={`text-xs ${chartTheme.copy.eyebrow}`}>CASH FLOW</p>
          <h2 className={`text-xl ${chartTheme.copy.heading}`}>
            Dòng tiền & Tăng trưởng toàn sàn
          </h2>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid
            strokeDasharray="4 8"
            stroke={chartTheme.gridStroke}
            vertical={false}
          />
          <XAxis
            dataKey="date"
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
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={axisTickStyle}
            axisLine={{ stroke: chartTheme.gridStroke }}
            tickLine={false}
            tickFormatter={(value) => formatLargeNumber(value)}
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3", stroke: "rgba(248,250,252,0.35)" }}
            contentStyle={tooltipStyle}
            labelStyle={{ color: "#e2e8f0", fontWeight: 600 }}
            formatter={(value: number, name: string) => {
              const formattedValue = `${value.toLocaleString("vi-VN")} đ`;
              const labels: Record<string, string> = {
                gmv: "Tổng doanh thu (GMV)",
                ma30: "Trung bình 30 ngày (MA30)",
                netProfit: "Lợi nhuận ròng",
              };
              return [formattedValue, labels[name] || name];
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: 20 }}
            iconType="line"
            formatter={(value) => {
              const labels: Record<string, string> = {
                gmv: "Tổng doanh thu (GMV)",
                ma30: "Trung bình 30 ngày (MA30)",
                netProfit: "Lợi nhuận ròng",
              };
              return labels[value] || value;
            }}
          />
          <ReferenceLine y={0} stroke={chartTheme.gridStroke} strokeDasharray="2 4" />
          
          {/* Line Chart: GMV and MA30 */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="gmv"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={false}
            name="gmv"
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="ma30"
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="ma30"
          />
          
          {/* Bar Chart: Net Profit - using Cell for conditional coloring */}
          <Bar yAxisId="right" dataKey="netProfit" name="netProfit" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.netProfit >= 0 ? "#22c55e" : "#ef4444"}
              />
            ))}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>

      <div className={`text-sm ${chartTheme.copy.muted}`}>
        <p>
          * Đường xanh: Tổng doanh thu (GMV) | Đường đứt nét đỏ: Trung bình 30 ngày (MA30) |
          Cột xanh/đỏ: Lợi nhuận ròng (Xanh: Lãi, Đỏ: Lỗ)
        </p>
      </div>
    </Card>
  );
};

export default CashFlowGrowthChart;

