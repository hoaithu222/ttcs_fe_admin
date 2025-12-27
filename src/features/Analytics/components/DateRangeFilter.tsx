import React, { useState, useCallback } from "react";
import { Card } from "@/foundation/components/info/Card";
import { Calendar, Filter } from "lucide-react";
import { AnalyticsQuery } from "@/core/api/analytics/type";
import DatePicker from "@/foundation/components/input/DatePicker";

interface DateRangeFilterProps {
  onFilterChange: (query: AnalyticsQuery) => void;
  currentQuery?: AnalyticsQuery;
}

const PERIOD_OPTIONS = [
  { value: "day", label: "Hôm nay" },
  { value: "week", label: "7 ngày qua" },
  { value: "month", label: "30 ngày qua" },
  { value: "year", label: "1 năm qua" },
  { value: "custom", label: "Tùy chỉnh" },
] as const;

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  onFilterChange,
  currentQuery,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<
    "day" | "week" | "month" | "year" | "custom"
  >(currentQuery?.period || "month");
  const [startDate, setStartDate] = useState<string>(
    currentQuery?.startDate || ""
  );
  const [endDate, setEndDate] = useState<string>(currentQuery?.endDate || "");

  const handlePeriodChange = useCallback(
    (period: "day" | "week" | "month" | "year" | "custom") => {
      setSelectedPeriod(period);

      if (period === "custom") {
        // Keep current dates for custom
        onFilterChange({
          period: undefined,
          startDate,
          endDate,
        });
        return;
      }

      // Calculate date range based on period
      const now = new Date();
      const to = new Date(now);
      const from = new Date(now);

      switch (period) {
        case "day":
          from.setDate(from.getDate() - 1);
          break;
        case "week":
          from.setDate(from.getDate() - 7);
          break;
        case "month":
          from.setDate(from.getDate() - 30);
          break;
        case "year":
          from.setFullYear(from.getFullYear() - 1);
          break;
      }

      const newStartDate = from.toISOString().split("T")[0];
      const newEndDate = to.toISOString().split("T")[0];

      setStartDate(newStartDate);
      setEndDate(newEndDate);

      onFilterChange({
        period,
        startDate: newStartDate,
        endDate: newEndDate,
      });
    },
    [onFilterChange, startDate, endDate]
  );

  const handleCustomDateChange = useCallback(() => {
    if (startDate && endDate) {
      onFilterChange({
        period: "custom",
        startDate,
        endDate,
      });
    }
  }, [onFilterChange, startDate, endDate]);

  return (
    <Card className="border border-white/10 bg-white/90 p-4 shadow-lg backdrop-blur dark:bg-neutral-900/70 rounded-3xl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary-6/15 p-2 text-primary-6">
            <Filter className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-semibold text-neutral-10 ">Bộ lọc thời gian</h3>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Period Selector */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-neutral-6">Chu kỳ:</label>
            <div className="flex gap-1 rounded-lg border border-neutral-3 bg-neutral-1 p-1 dark:border-neutral-8 dark:bg-neutral-9/80">
              {PERIOD_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    handlePeriodChange(
                      option.value as "day" | "week" | "month" | "year" | "custom"
                    )
                  }
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    selectedPeriod === option.value
                      ? "bg-primary-6 text-white shadow-sm"
                      : "text-neutral-6 hover:bg-neutral-2 dark:text-neutral-5 dark:hover:bg-neutral-8"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Date Range */}
          {selectedPeriod === "custom" && (
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-blue-500/15 p-2 text-blue-500">
                <Calendar className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2">
                <input
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (e.target.value && endDate) {
                      setTimeout(() => {
                        onFilterChange({
                          period: "custom",
                          startDate: e.target.value,
                          endDate,
                        });
                      }, 100);
                    }
                  }}
                  className="rounded-lg border border-neutral-3 bg-white px-3 py-1.5 text-xs text-neutral-10 focus:border-primary-5 focus:outline-none focus:ring-2 focus:ring-primary-5/20 dark:border-neutral-8 dark:bg-neutral-9 dark:text-neutral-1"
                />
                <span className="text-xs text-neutral-6">đến</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    if (startDate && e.target.value) {
                      setTimeout(() => {
                        onFilterChange({
                          period: "custom",
                          startDate,
                          endDate: e.target.value,
                        });
                      }, 100);
                    }
                  }}
                  className="rounded-lg border border-neutral-3 bg-white px-3 py-1.5 text-xs text-neutral-10 focus:border-primary-5 focus:outline-none focus:ring-2 focus:ring-primary-5/20 dark:border-neutral-8 dark:bg-neutral-9 dark:text-neutral-1"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default DateRangeFilter;

