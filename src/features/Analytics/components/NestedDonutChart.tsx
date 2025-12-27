import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { PaymentMethodItem, DeviceTypeItem } from "@/core/api/analytics/type";
import { Card } from "@/foundation/components/info/Card";
import { CreditCard, Smartphone } from "lucide-react";
import { chartTheme, formatPercent, tooltipStyle } from "./chartTheme";

interface NestedDonutChartProps {
  paymentMethods: PaymentMethodItem[];
  deviceTypes: DeviceTypeItem[];
  isLoading?: boolean;
}

const PAYMENT_COLORS = ["#3b82f6", "#22c55e", "#f59e0b"]; // VNPay, Ví điện tử, COD
const DEVICE_COLORS = ["#8b5cf6", "#ec4899", "#06b6d4"]; // Mobile App, Web PC, Mobile Web

const NestedDonutChart: React.FC<NestedDonutChartProps> = ({
  paymentMethods,
  deviceTypes,
  isLoading,
}) => {
  if (
    isLoading ||
    !paymentMethods ||
    paymentMethods.length === 0 ||
    !deviceTypes ||
    deviceTypes.length === 0
  ) {
    const message = isLoading ? "Đang tải dữ liệu..." : "Chưa có dữ liệu";
    return (
      <Card className={chartTheme.card} style={chartTheme.cardStyle}>
        <div className="flex items-center gap-2">
          <div className="rounded-2xl bg-purple-500/15 p-3 text-purple-300">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <p className={`text-xs ${chartTheme.copy.eyebrow}`}>DISTRIBUTION</p>
            <h2 className={`text-xl ${chartTheme.copy.heading}`}>
              Tỷ trọng người dùng & Dòng tiền
            </h2>
          </div>
        </div>
        <div className={`flex h-80 items-center justify-center text-sm ${chartTheme.copy.muted}`}>
          {message}
        </div>
      </Card>
    );
  }

  // Prepare data for outer ring (Payment Methods)
  const paymentData = paymentMethods.map((item, index) => ({
    name: item.method,
    value: item.count,
    percentage: item.percentage,
    color: PAYMENT_COLORS[index % PAYMENT_COLORS.length],
  }));

  // Prepare data for inner ring (Device Types)
  const deviceData = deviceTypes.map((item, index) => ({
    name: item.device,
    value: item.count,
    percentage: item.percentage,
    color: DEVICE_COLORS[index % DEVICE_COLORS.length],
  }));

  const totalPayment = paymentMethods.reduce((sum, p) => sum + p.count, 0);
  const totalDevice = deviceTypes.reduce((sum, d) => sum + d.count, 0);

  return (
    <Card className={`${chartTheme.card} space-y-4`} style={chartTheme.cardStyle}>
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-purple-500/15 p-3 text-purple-300">
          <CreditCard className="h-5 w-5" />
        </div>
        <div>
          <p className={`text-xs ${chartTheme.copy.eyebrow}`}>DISTRIBUTION</p>
          <h2 className={`text-xl ${chartTheme.copy.heading}`}>
            Tỷ trọng người dùng & Dòng tiền
          </h2>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          {/* Outer Ring: Payment Methods */}
          <Pie
            data={paymentData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            innerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percentage }) => `${name}: ${formatPercent(percentage)}`}
          >
            {paymentData.map((entry, index) => (
              <Cell key={`cell-payment-${index}`} fill={entry.color} />
            ))}
          </Pie>

          {/* Inner Ring: Device Types */}
          <Pie
            data={deviceData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={70}
            innerRadius={30}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percentage }) => `${name}: ${formatPercent(percentage)}`}
          >
            {deviceData.map((entry, index) => (
              <Cell key={`cell-device-${index}`} fill={entry.color} />
            ))}
          </Pie>

          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value: number, name: string, props: any) => {
              const percentage = props.payload.percentage || 0;
              return [
                `${value.toLocaleString("vi-VN")} (${formatPercent(percentage)})`,
                props.payload.name || name,
              ];
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="space-y-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-neutral-10">Phương thức thanh toán</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {paymentData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-xs text-neutral-6 dark:text-neutral-5">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-neutral-10">Thiết bị người dùng</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {deviceData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-xs text-neutral-6 dark:text-neutral-5">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`text-sm ${chartTheme.copy.muted}`}>
        <p>
          * Vòng ngoài: Phương thức thanh toán | Vòng trong: Thiết bị người dùng
        </p>
      </div>
    </Card>
  );
};

export default NestedDonutChart;

