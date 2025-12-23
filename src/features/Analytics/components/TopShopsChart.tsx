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
import { ShoppingBag } from "lucide-react";
import {
  axisTickStyle,
  chartTheme,
  formatLargeNumber,
  legendWrapperStyle,
  tooltipStyle,
} from "./chartTheme";

interface TopShopsChartProps {
  data: TopShop[];
  isLoading?: boolean;
}

const TopShopsChart: React.FC<TopShopsChartProps> = ({ data, isLoading }) => {
  if (isLoading || !data || data.length === 0) {
    const message = isLoading ? "Đang tải dữ liệu..." : "Chưa có dữ liệu";
    return (
      <Card className={chartTheme.card} style={chartTheme.cardStyle}>
        <div className="flex items-center gap-2">
          <div className="rounded-2xl bg-amber-500/15 p-3 text-amber-300">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <p className={`text-xs ${chartTheme.copy.eyebrow}`}>STORES</p>
            <h2 className={`text-xl ${chartTheme.copy.heading}`}>Top cửa hàng hàng đầu</h2>
          </div>
        </div>
        <div className={`flex h-80 items-center justify-center text-sm ${chartTheme.copy.muted}`}>
          {message}
        </div>
      </Card>
    );
  }

  // Format data for chart (top 10)
  const chartData = data.slice(0, 10).map((shop) => ({
    name: shop.shopName.length > 15 ? `${shop.shopName.substring(0, 15)}...` : shop.shopName,
    revenue: shop.totalRevenue || 0,
    orders: shop.totalOrders || 0,
  }));

  return (
    <Card className={chartTheme.card} style={chartTheme.cardStyle}>
      <div className="flex items-center gap-3 pb-4">
        <div className="rounded-2xl bg-amber-500/15 p-3 text-amber-300">
          <ShoppingBag className="h-5 w-5" />
        </div>
        <div>
          <p className={`text-xs text-start ${chartTheme.copy.eyebrow}`}>STORES</p>
          <h2 className={`text-xl text-start ${chartTheme.copy.heading}`}>Top cửa hàng hàng đầu</h2>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          // Tăng margin bottom để nhãn trục X không bị cắt nếu xoay nghiêng
          margin={{ top: 30, right: 24, left: 10, bottom: 10 }} 
          barGap={8} // Khoảng cách giữa 2 cột trong cùng 1 nhóm
        >
          <CartesianGrid
            strokeDasharray="4 8"
            stroke={chartTheme.gridStroke}
            vertical={false}
          />
          <XAxis
            dataKey="name"
            axisLine={{ stroke: chartTheme.gridStroke }}
            tickLine={false}
            tick={axisTickStyle}
            // Chỉ xoay nhẹ hoặc bỏ xoay nếu tên ngắn để dễ đọc hơn
            angle={-15} 
            textAnchor="end"
            interval={0} // Hiển thị tất cả nhãn
            height={60}
          />
          
          {/* Trục trái: Doanh thu */}
          <YAxis
            yAxisId="left"
            tick={axisTickStyle}
            tickFormatter={(value) => formatLargeNumber(value)}
            axisLine={false}
            tickLine={false}
          />
          
          {/* Trục phải: Đơn hàng */}
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={axisTickStyle}
            axisLine={false}
            tickLine={false}
            allowDecimals={false} // QUAN TRỌNG: Không hiện số lẻ (vd: 0.5 đơn)
          />
          
          <Tooltip
            contentStyle={tooltipStyle}
            cursor={{ fill: 'transparent' }} // Bỏ màu nền xám khi hover vào cột
            labelStyle={{ color: "#e2e8f0", fontWeight: 600 }}
            formatter={(value: number, name: string) => {
              if (name === "Doanh thu") {
                return [`${value.toLocaleString("vi-VN")} đ`, name];
              }
              return [value, name];
            }}
          />
          
          <Legend 
            wrapperStyle={{ ...legendWrapperStyle, paddingTop: '20px' }} 
            iconType="circle" 
          />
          
          {/* Cột Doanh thu */}
          <Bar
            yAxisId="left"
            dataKey="revenue"
            name="Doanh thu" // Đặt tên tiếng Việt cho Legend
            fill="url(#shopRevenue)"
            radius={[4, 4, 0, 0]} // Bo góc nhẹ nhàng hơn (chỉ bo trên)
            barSize={32} // QUAN TRỌNG: Giới hạn chiều rộng cột tối đa 32px
            maxBarSize={50}
          />
          
          {/* Cột Đơn hàng */}
          <Bar
            yAxisId="right"
            dataKey="orders"
            name="Đơn hàng" // Đặt tên tiếng Việt cho Legend
            fill="url(#shopOrders)"
            radius={[4, 4, 0, 0]}
            barSize={32} // Cân đối với cột bên cạnh
            maxBarSize={50}
          />
          
          <defs>
            <linearGradient id="shopRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#d97706" stopOpacity={1} />
            </linearGradient>
            <linearGradient id="shopOrders" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f472b6" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#be123c" stopOpacity={1} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default TopShopsChart;