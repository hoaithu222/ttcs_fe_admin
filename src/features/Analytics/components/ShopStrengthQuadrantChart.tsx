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
  ReferenceLine,
  ReferenceArea,
} from "recharts";
import { ShopStrengthItem } from "@/core/api/analytics/type";
import { Card } from "@/foundation/components/info/Card";
import { TrendingUp } from "lucide-react";
import {
  axisTickStyle,
  chartTheme,
  formatLargeNumber,
  tooltipStyle,
} from "./chartTheme";

interface ShopStrengthQuadrantChartProps {
  data: ShopStrengthItem[];
  isLoading?: boolean;
}

const ShopStrengthQuadrantChart: React.FC<ShopStrengthQuadrantChartProps> = ({
  data,
  isLoading,
}) => {
  if (isLoading || !data || data.length === 0) {
    const message = isLoading ? "Đang tải dữ liệu..." : "Chưa có dữ liệu";
    return (
      <Card className={chartTheme.card} style={chartTheme.cardStyle}>
        <div className="flex items-center gap-2">
          <div className="rounded-2xl bg-emerald-500/15 p-3 text-emerald-300">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className={`text-xs ${chartTheme.copy.eyebrow}`}>SHOP STRENGTH</p>
            <h2 className={`text-xl ${chartTheme.copy.heading}`}>
              Biểu đồ sức mạnh & Phân loại Shop
            </h2>
          </div>
        </div>
        <div className={`flex h-80 items-center justify-center text-sm ${chartTheme.copy.muted}`}>
          {message}
        </div>
      </Card>
    );
  }

  // Calculate averages for quadrant lines
  const avgGmv = data.reduce((sum, shop) => sum + shop.gmv, 0) / data.length || 1;
  const avgRating = data.reduce((sum, shop) => sum + shop.rating, 0) / data.length || 1;

  // Prepare scatter data
  const scatterData = data.map((shop) => ({
    x: shop.gmv,
    y: shop.rating,
    z: shop.totalOrders,
    name: shop.shopName,
    shopId: shop.shopId,
    quadrant: shop.quadrant,
    quadrantName: shop.quadrantName,
    quadrantColor: shop.quadrantColor,
    conversionRate: shop.conversionRate,
    totalOrders: shop.totalOrders,
  }));

  // Get max values for axis
  const maxGmv = Math.max(...scatterData.map((d) => d.x), 1);
  const maxRating = Math.max(...scatterData.map((d) => d.y), 1);

  return (
    <Card className={`${chartTheme.card} space-y-4`} style={chartTheme.cardStyle}>
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-emerald-500/15 p-3 text-emerald-300">
          <TrendingUp className="h-5 w-5" />
        </div>
        <div>
          <p className={`text-xs ${chartTheme.copy.eyebrow}`}>SHOP STRENGTH</p>
          <h2 className={`text-xl ${chartTheme.copy.heading}`}>
            Biểu đồ sức mạnh & Phân loại Shop
          </h2>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={500}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
          <CartesianGrid
            strokeDasharray="4 8"
            stroke={chartTheme.gridStroke}
            vertical={false}
          />

          {/* Quadrant Background Areas */}
          <ReferenceArea
            x1={avgGmv}
            x2={maxGmv * 1.1}
            y1={avgRating}
            y2={maxRating * 1.1}
            fill="#22c55e"
            fillOpacity={0.1}
            stroke="none"
          />
          <ReferenceArea
            x1={avgGmv}
            x2={maxGmv * 1.1}
            y1={0}
            y2={avgRating}
            fill="#f59e0b"
            fillOpacity={0.1}
            stroke="none"
          />
          <ReferenceArea
            x1={0}
            x2={avgGmv}
            y1={0}
            y2={avgRating}
            fill="#ef4444"
            fillOpacity={0.1}
            stroke="none"
          />
          <ReferenceArea
            x1={0}
            x2={avgGmv}
            y1={avgRating}
            y2={maxRating * 1.1}
            fill="#3b82f6"
            fillOpacity={0.1}
            stroke="none"
          />

          {/* Reference Lines */}
          <ReferenceLine
            x={avgGmv}
            stroke={chartTheme.gridStroke}
            strokeDasharray="2 4"
            label={{ value: "TB GMV", position: "top", fill: chartTheme.axisLabel }}
          />
          <ReferenceLine
            y={avgRating}
            stroke={chartTheme.gridStroke}
            strokeDasharray="2 4"
            label={{ value: "TB Rating", position: "right", fill: chartTheme.axisLabel }}
          />

          <XAxis
            type="number"
            dataKey="x"
            name="GMV"
            label={{
              value: "Tổng doanh thu (GMV)",
              position: "insideBottom",
              offset: -10,
              fill: chartTheme.axisLabel,
            }}
            tick={axisTickStyle}
            axisLine={{ stroke: chartTheme.gridStroke }}
            tickLine={false}
            tickFormatter={(value) => formatLargeNumber(value)}
            domain={[0, maxGmv * 1.1]}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Rating"
            label={{
              value: "Điểm đánh giá (Rating)",
              angle: -90,
              position: "insideLeft",
              fill: chartTheme.axisLabel,
            }}
            tick={axisTickStyle}
            axisLine={{ stroke: chartTheme.gridStroke }}
            tickLine={false}
            domain={[0, maxRating * 1.1]}
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3", stroke: "rgba(248,250,252,0.35)" }}
            contentStyle={tooltipStyle}
            labelStyle={{ color: "#e2e8f0", fontWeight: 600 }}
            formatter={(value: number, name: string, props: any) => {
              if (name === "x") {
                return [`${value.toLocaleString("vi-VN")} đ`, "GMV"];
              }
              if (name === "y") {
                return [value.toFixed(2), "Rating"];
              }
              if (name === "z") {
                return [value, "Số đơn hàng"];
              }
              return [value, name];
            }}
            labelFormatter={(label, payload) => {
              if (payload && payload[0]) {
                const shop = payload[0].payload;
                return `${shop.name} (${shop.quadrantName})`;
              }
              return label;
            }}
          />
          <Scatter name="Shops" data={scatterData}>
            {scatterData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.quadrantColor} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-4 rounded-xl border border-white/10 bg-white/5 p-4 dark:bg-neutral-900/30">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-emerald-500"></div>
          <span className="text-sm text-neutral-7 dark:text-neutral-4">
            Tăng mạnh (GMV cao, Rating cao)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-amber-500"></div>
          <span className="text-sm text-neutral-7 dark:text-neutral-4">
            Suy yếu (GMV cao, Rating thấp)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-red-500"></div>
          <span className="text-sm text-neutral-7 dark:text-neutral-4">
            Giảm mạnh (GMV thấp, Rating thấp)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-blue-500"></div>
          <span className="text-sm text-neutral-7 dark:text-neutral-4">
            Hồi phục (GMV thấp, Rating cao)
          </span>
        </div>
      </div>

      <div className={`text-sm ${chartTheme.copy.muted}`}>
        <p>
          * Trục X: Tổng doanh thu (GMV) | Trục Y: Điểm đánh giá (Rating) | Kích thước chấm: Số
          lượng đơn hàng
        </p>
      </div>
    </Card>
  );
};

export default ShopStrengthQuadrantChart;

