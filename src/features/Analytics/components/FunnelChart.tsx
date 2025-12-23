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
  Cell,
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

// 1. Cấu hình Mapping Tiếng Việt & Màu sắc (Đồng bộ với PieChart)
const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: "Chờ xử lý", color: "#22d3ee" },      // Cyan
  processing: { label: "Đang xử lý", color: "#a855f7" },  // Purple
  delivered: { label: "Đã giao hàng", color: "#facc15" }, // Yellow
  cancelled: { label: "Đã hủy", color: "#fb7185" },       // Red/Pink
  shipped: { label: "Đang vận chuyển", color: "#34d399" },
  returned: { label: "Trả hàng", color: "#94a3b8" },
};
const DEFAULT_COLOR = "#6366f1"; // Indigo

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

  // 2. Xử lý dữ liệu
  // Sắp xếp giảm dần để tạo hiệu ứng phễu
  const sortedData = [...data].sort((a, b) => b.count - a.count);
  const maxCount = Math.max(...sortedData.map((d) => d.count));

  const chartData = sortedData.map((item) => {
    const statusKey = item.status.toLowerCase();
    const config = STATUS_CONFIG[statusKey];
    return {
      // Tên hiển thị tiếng Việt
      name: config ? config.label : item.status, 
      originalStatus: item.status,
      count: item.count,
      percentage: item.percentage || 0,
      // Màu sắc theo cấu hình
      color: config ? config.color : DEFAULT_COLOR,
      // Giá trị nền (để vẽ thanh background full 100%)
      fullMark: maxCount, 
      // Text hiển thị bên phải
      displayValue: `${item.count.toLocaleString("vi-VN")}`,
      displayPercent: `(${item.percentage?.toFixed(1)}%)`,
    };
  });

  return (
    <Card className={chartTheme.card} style={chartTheme.cardStyle}>
      <div className="flex items-center gap-3 pb-4">
        <div className="rounded-2xl bg-purple-500/15 p-3 text-purple-300">
          <Filter className="h-5 w-5" />
        </div>
        <div>
          <p className={`text-xs text-start ${chartTheme.copy.eyebrow}`}>FUNNEL</p>
          <h2 className={`text-xl text-start ${chartTheme.copy.heading}`}>Funnel trạng thái đơn hàng</h2>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 10, right: 60, left: 10, bottom: 10 }}
          barGap={0} // Để các thanh gần nhau hơn hoặc chồng lên nhau nếu cần
        >
          <CartesianGrid
            strokeDasharray="4 8"
            stroke="rgba(255,255,255,0.05)"
            horizontal={false} // Ẩn lưới ngang
            vertical={true}    // Hiện lưới dọc mờ
          />
          <XAxis type="number" hide />
          <YAxis
            dataKey="name"
            type="category"
            width={110} // Tăng độ rộng để chứa đủ tên tiếng Việt
            tick={{...axisTickStyle, fontSize: 13, fontWeight: 500}}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            formatter={(value: number, name: string, props: any) => {
              if (name === "count") {
                return [
                  `${value.toLocaleString("vi-VN")} đơn`,
                  props.payload.name // Hiện tên tiếng Việt trên tooltip
                ];
              }
              return [value, name];
            }}
          />
          
          {/* Lớp nền: Tạo hiệu ứng thanh track mờ phía sau (Optional)
              Nếu muốn đơn giản thì bỏ Bar này đi. Nhưng giữ lại sẽ tạo cảm giác "Progress bar" đẹp hơn.
          */}
          <Bar
            dataKey="fullMark"
            barSize={24}
            radius={[99, 99, 99, 99]}
            fill="rgba(255,255,255,0.05)" // Màu xám rất mờ
            isAnimationActive={false}
            xAxisId={0}
            style={{ pointerEvents: 'none' }} // Không tương tác với thanh nền
          />

          {/* Lớp dữ liệu chính: Vẽ đè lên lớp nền (sử dụng margin âm hoặc kỹ thuật stack, 
              nhưng ở đây Recharts vẽ theo thứ tự nên ta vẽ cái này sau cùng cùng trục) 
              Cách đơn giản nhất trong Recharts layout vertical là vẽ Bar chính, 
              nhưng Bar nền ở trên cần kỹ thuật 'barGap' âm để chồng lên nhau. 
              
              Thay vào đó, ta chỉ vẽ Bar chính nhưng thiết kế đẹp:
          */}
          <Bar
            dataKey="count"
            barSize={24} // Kích thước thanh gọn gàng (Capsule)
            radius={[0, 99, 99, 0]} // Bo tròn đầu phải
            background={{ fill: "rgba(255,255,255,0.05)" }} // Cách tạo nền chuẩn của Recharts
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
            
            {/* Hiển thị số lượng */}
            <LabelList
              dataKey="displayValue"
              position="right"
              fill="#e2e8f0" // text-slate-200
              style={{ fontSize: 13, fontWeight: 600 }}
              offset={10}
            />
             {/* Hiển thị phần trăm (nếu muốn, có thể nối chuỗi vào dataKey trên hoặc dùng custom content) */}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default FunnelChartComponent;