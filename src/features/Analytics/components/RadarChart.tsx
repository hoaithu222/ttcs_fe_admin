import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TopShop } from "@/core/api/analytics/type";
import { Card } from "@/foundation/components/info/Card";
import { Target } from "lucide-react";
import { axisTickStyle, chartTheme, legendWrapperStyle, tooltipStyle } from "./chartTheme";

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
            <h2 className={`text-xl ${chartTheme.copy.heading}`}>Chỉ số hiệu quả (Radar)</h2>
          </div>
        </div>
        <div className={`flex h-80 items-center justify-center text-sm ${chartTheme.copy.muted}`}>
          {message}
        </div>
      </Card>
    );
  }

  // Lấy top 6 shops để so sánh
  const topShops = data.slice(0, 6);
  
  // Debug: Log để kiểm tra dữ liệu
  console.log("🔍 [RadarChart] Top shops data:", topShops);
  
  // Tính max values để normalize (scale 0-100) cho so sánh công bằng
  const maxRevenue = Math.max(...topShops.map((s) => s.totalRevenue || 0), 1);
  const maxOrders = Math.max(...topShops.map((s) => s.totalOrders || 0), 1);
  const maxAOV = Math.max(
    ...topShops.map((s) => {
      const aov = s.averageOrderValue || (s.totalOrders > 0 ? s.totalRevenue / s.totalOrders : 0);
      return aov;
    }),
    1
  );
  
  // Tạo dữ liệu cho bar chart: mỗi shop là một nhóm với 3 cột (normalized 0-100)
  const chartData = topShops.map((shop, index) => {
    const aov = shop.averageOrderValue || (shop.totalOrders > 0 ? shop.totalRevenue / shop.totalOrders : 0);
    const shopName = shop.shopName || `Shop ${index + 1}`;
    const displayName = shopName.length > 15 ? `${shopName.substring(0, 13)}...` : shopName;
    
    console.log(`🔍 [RadarChart] Shop ${index + 1}:`, {
      shopId: shop.shopId,
      shopName,
      displayName,
      fullShop: shop,
    });
    
    return {
      name: displayName,
      fullName: shopName, // Lưu tên đầy đủ cho tooltip
      shopId: shop.shopId,
      rank: shop.rank || index + 1,
      // Giá trị normalized (0-100) để so sánh công bằng
      "Doanh thu": maxRevenue > 0 ? ((shop.totalRevenue || 0) / maxRevenue) * 100 : 0,
      "Đơn hàng": maxOrders > 0 ? ((shop.totalOrders || 0) / maxOrders) * 100 : 0,
      "AOV": maxAOV > 0 ? (aov / maxAOV) * 100 : 0,
      // Giá trị thực tế để hiển thị trong tooltip
      originalRevenue: shop.totalRevenue || 0,
      originalOrders: shop.totalOrders || 0,
      originalAOV: Math.round(aov),
    };
  });

  return (
    <Card className={`${chartTheme.card} space-y-4`} style={chartTheme.cardStyle}>
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-500/15 p-3 text-emerald-300">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <p className={`text-xs ${chartTheme.copy.eyebrow}`}>STORE INDEX</p>
            <h2 className={`text-xl ${chartTheme.copy.heading}`}>Hiệu suất cửa hàng</h2>
          </div>
        </div>
      </div>
      
      <div className="relative h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 10, bottom: 60 }}
            barGap={8}
          >
            <CartesianGrid
              strokeDasharray="4 8"
              stroke={chartTheme.gridStroke}
              vertical={false}
            />
            <XAxis
              dataKey="name"
              angle={-15}
              textAnchor="end"
              height={80}
              tick={axisTickStyle}
              tickLine={false}
              axisLine={{ stroke: chartTheme.gridStroke }}
            />
            <YAxis
              tick={axisTickStyle}
              tickFormatter={(value) => `${Math.round(value)}%`}
              domain={[0, 100]}
              axisLine={{ stroke: chartTheme.gridStroke }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              labelStyle={{ color: "#e2e8f0", fontWeight: 600 }}
              formatter={(value: number, name: string, props: any) => {
                const payload = props.payload;
                if (name === "Doanh thu") {
                  return [
                    `${payload.originalRevenue.toLocaleString("vi-VN")} đ (${Math.round(value)}%)`,
                    name
                  ];
                } else if (name === "Đơn hàng") {
                  return [
                    `${payload.originalOrders.toLocaleString("vi-VN")} đơn (${Math.round(value)}%)`,
                    name
                  ];
                } else if (name === "AOV") {
                  return [
                    `${payload.originalAOV.toLocaleString("vi-VN")} đ (${Math.round(value)}%)`,
                    name
                  ];
                }
                return [`${Math.round(value)}%`, name];
              }}
              labelFormatter={(label) => {
                const shop = chartData.find((d) => d.name === label);
                return shop ? `${shop.fullName} (#${shop.rank})` : label;
              }}
            />
            <Legend 
              wrapperStyle={legendWrapperStyle} 
              iconType="circle"
            />
            
            {/* Cột Doanh thu - Màu xanh ngọc */}
            <Bar
              dataKey="Doanh thu"
              fill="url(#barRevenue)"
              radius={[8, 8, 0, 0]}
              name="Doanh thu"
            />
            
            {/* Cột Đơn hàng - Màu tím */}
            <Bar
              dataKey="Đơn hàng"
              fill="url(#barOrders)"
              radius={[8, 8, 0, 0]}
              name="Đơn hàng"
            />
            
            {/* Cột AOV - Màu xanh dương */}
            <Bar
              dataKey="AOV"
              fill="url(#barAOV)"
              radius={[8, 8, 0, 0]}
              name="AOV"
            />

            <defs>
              <linearGradient id="barRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.7} />
              </linearGradient>
              <linearGradient id="barOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.7} />
              </linearGradient>
              <linearGradient id="barAOV" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0.7} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
        
        {/* Chú thích nhỏ bên dưới */}
        <div className="absolute bottom-0 right-0 text-xs text-slate-500 italic">
          * Giá trị normalized (0-100%) để so sánh công bằng
        </div>
      </div>
      
      {/* Bảng so sánh chi tiết */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-2 px-3 text-xs font-semibold uppercase text-neutral-6">#</th>
              <th className="text-left py-2 px-3 text-xs font-semibold uppercase text-neutral-6">Cửa hàng</th>
              <th className="text-right py-2 px-3 text-xs font-semibold uppercase text-neutral-6">Doanh thu</th>
              <th className="text-right py-2 px-3 text-xs font-semibold uppercase text-neutral-6">Đơn hàng</th>
              <th className="text-right py-2 px-3 text-xs font-semibold uppercase text-neutral-6">AOV</th>
              <th className="text-right py-2 px-3 text-xs font-semibold uppercase text-neutral-6">Tổng điểm</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((shop) => {
              const totalScore = Math.round(
                (shop["Doanh thu"] + shop["Đơn hàng"] + shop["AOV"]) / 3
              );
              return (
                <tr
                  key={shop.shopId}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-2 px-3 text-neutral-7 font-semibold">#{shop.rank}</td>
                  <td className="py-2 px-3 text-neutral-10 font-medium">{shop.fullName}</td>
                  <td className="py-2 px-3 text-right text-neutral-9">
                    {shop.originalRevenue.toLocaleString("vi-VN")} đ
                    <span className="ml-2 text-xs text-neutral-6">
                      ({Math.round(shop["Doanh thu"])}%)
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right text-neutral-9">
                    {shop.originalOrders.toLocaleString("vi-VN")} đơn
                    <span className="ml-2 text-xs text-neutral-6">
                      ({Math.round(shop["Đơn hàng"])}%)
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right text-neutral-9">
                    {shop.originalAOV.toLocaleString("vi-VN")} đ
                    <span className="ml-2 text-xs text-neutral-6">
                      ({Math.round(shop["AOV"])}%)
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right">
                    <span
                      className={`inline-flex items-center justify-center min-w-[50px] px-2 py-1 rounded-full text-xs font-bold ${
                        totalScore >= 80
                          ? "bg-emerald-500/20 text-emerald-400"
                          : totalScore >= 60
                          ? "bg-blue-500/20 text-blue-400"
                          : totalScore >= 40
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {totalScore}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default RadarChartComponent;