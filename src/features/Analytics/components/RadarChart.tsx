import React from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from "recharts";
import { TopShop } from "@/core/api/analytics/type";
import { Card } from "@/foundation/components/info/Card";
import { Target } from "lucide-react";

interface RadarChartProps {
  data: TopShop[];
  isLoading?: boolean;
}

const RadarChartComponent: React.FC<RadarChartProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Target className="w-5 h-5 text-primary-6" />
          <h2 className="text-xl font-bold text-neutral-10">Biểu đồ radar cửa hàng</h2>
        </div>
        <div className="h-80 flex items-center justify-center">
          <p className="text-neutral-6">Đang tải dữ liệu...</p>
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Target className="w-5 h-5 text-primary-6" />
          <h2 className="text-xl font-bold text-neutral-10">Biểu đồ radar cửa hàng</h2>
        </div>
        <div className="h-80 flex items-center justify-center">
          <p className="text-neutral-6">Chưa có dữ liệu</p>
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
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Target className="w-5 h-5 text-primary-6" />
        <h2 className="text-xl font-bold text-neutral-10">Biểu đồ radar cửa hàng (Top 5)</h2>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="shop"
            tick={{ fill: "#6b7280", fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: "#6b7280", fontSize: 10 }}
          />
          <Radar
            name="Doanh thu"
            dataKey="revenue"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.6}
          />
          <Radar
            name="Đơn hàng"
            dataKey="orders"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
          />
          <Legend
            wrapperStyle={{ paddingTop: "20px" }}
            formatter={(value) => {
              if (value === "Doanh thu") return "Doanh thu (%)";
              if (value === "Đơn hàng") return "Đơn hàng (%)";
              return value;
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
      <div className="mt-4 text-sm text-neutral-6">
        <p>* Giá trị được chuẩn hóa theo thang điểm 0-100%</p>
      </div>
    </Card>
  );
};

export default RadarChartComponent;

