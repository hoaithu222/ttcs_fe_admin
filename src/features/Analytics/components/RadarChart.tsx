import React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TopShop } from "@/core/api/analytics/type";
import { Card } from "@/foundation/components/info/Card";
import { Target } from "lucide-react";
import { axisTickStyle, chartTheme, legendWrapperStyle } from "./chartTheme";

interface RadarChartProps {
  data: TopShop[];
  isLoading?: boolean;
}

const RadarChartComponent: React.FC<RadarChartProps> = ({ data, isLoading }) => {
  if (isLoading || !data || data.length === 0) {
    const message = isLoading ? "Đang tải dữ liệu..." : "Chưa có dữ liệu";
    return (
      <Card className={chartTheme.card} style={chartTheme.cardStyle}>
        <div className="flex items-center gap-2">
          <div className="rounded-2xl bg-emerald-500/15 p-3 text-emerald-300">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <p className={`text-xs ${chartTheme.copy.eyebrow}`}>STORE INDEX</p>
            <h2 className={`text-xl ${chartTheme.copy.heading}`}>Biểu đồ radar cửa hàng</h2>
          </div>
        </div>
        <div className={`flex h-80 items-center justify-center text-sm ${chartTheme.copy.muted}`}>
          {message}
        </div>
      </Card>
    );
  }

  // Normalize data for radar chart (top 5 shops)
  const top5Shops = data.slice(0, 5);
  const maxRevenue = Math.max(...top5Shops.map((s) => s.totalRevenue || 0));
  const maxOrders = Math.max(...top5Shops.map((s) => s.totalOrders || 0));

  const radarData = top5Shops.map((shop) => ({
    shop: shop.shopName.length > 10 ? `${shop.shopName.substring(0, 10)}...` : shop.shopName,
    revenue: maxRevenue > 0 ? Math.round((shop.totalRevenue / maxRevenue) * 100) : 0,
    orders: maxOrders > 0 ? Math.round((shop.totalOrders / maxOrders) * 100) : 0,
  }));

  return (
    <Card className={`${chartTheme.card} space-y-4`} style={chartTheme.cardStyle}>
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-emerald-500/15 p-3 text-emerald-300">
          <Target className="h-5 w-5" />
        </div>
        <div>
          <p className={`text-xs ${chartTheme.copy.eyebrow}`}>STORE INDEX</p>
          <h2 className={`text-xl ${chartTheme.copy.heading}`}>Biểu đồ radar cửa hàng (Top 5)</h2>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={380}>
        <RadarChart data={radarData}>
          <PolarGrid stroke={chartTheme.gridStroke} />
          <PolarAngleAxis dataKey="shop" tick={axisTickStyle} />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={axisTickStyle}
            stroke="rgba(255,255,255,0.05)"
          />
          <Radar
            name="Doanh thu"
            dataKey="revenue"
            stroke="#34d399"
            fill="url(#radarRevenue)"
            fillOpacity={0.7}
          />
          <Radar
            name="Đơn hàng"
            dataKey="orders"
            stroke="#60a5fa"
            fill="url(#radarOrders)"
            fillOpacity={0.6}
          />
          <Legend wrapperStyle={legendWrapperStyle} />
          <defs>
            <radialGradient id="radarRevenue" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#34d399" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#065f46" stopOpacity={0.8} />
            </radialGradient>
            <radialGradient id="radarOrders" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.8} />
            </radialGradient>
          </defs>
        </RadarChart>
      </ResponsiveContainer>
      <div className={`text-sm ${chartTheme.copy.muted}`}>
        <p>* Giá trị được chuẩn hóa theo thang điểm 0 - 100%</p>
      </div>
    </Card>
  );
};

export default RadarChartComponent;

