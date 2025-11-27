export const analyticsVar = (token: string) => `var(--color-${token})`;
const cssVar = analyticsVar;

const textPrimary = cssVar("analytics-text-primary");
const textMuted = cssVar("analytics-text-muted");

export const chartTheme = {
  card:
    "p-6 rounded-3xl border shadow-[0_30px_60px_rgba(2,6,23,0.35)] backdrop-blur transition-colors duration-300",
  cardStyle: {
    background: `linear-gradient(140deg, ${cssVar("analytics-card-start")} 0%, ${cssVar("analytics-card-end")} 100%)`,
    borderColor: cssVar("analytics-card-border"),
    color: textPrimary,
  },
  copy: {
    eyebrow:
      "font-semibold uppercase tracking-[0.35em] text-[var(--color-analytics-text-muted)]",
    heading: "font-semibold text-[var(--color-analytics-text-primary)]",
    muted: "text-[var(--color-analytics-text-muted)]",
    primary: "text-[var(--color-analytics-text-primary)]",
  },
  gridStroke: cssVar("analytics-grid"),
  axisTick: textMuted,
  axisLabel: textMuted,
  legendText: textMuted,
  tooltipBg: cssVar("analytics-tooltip-bg"),
  tooltipBorder: cssVar("analytics-tooltip-border"),
  tooltipShadow: "0 25px 65px rgba(2, 6, 23, 0.45)",
  donutCenterBg: "rgba(2, 6, 23, 0.55)",
  palettes: {
    primary: ["#3b82f6", "#22d3ee", "#a855f7", "#f472b6", "#facc15", "#38bdf8", "#60a5fa"],
    status: ["#10b981", "#f97316", "#fbbf24", "#ef4444", "#6366f1", "#0ea5e9"],
    semantic: ["#34d399", "#31c48d", "#047857", "#d946ef", "#fb7185", "#facc15"],
  },
};

export const axisTickStyle = {
  fill: chartTheme.axisTick,
  fontSize: 12,
  fontWeight: 500,
  fontFamily: "Inter, sans-serif",
};

export const axisLabelStyle = {
  fill: chartTheme.axisLabel,
  fontSize: 11,
  fontFamily: "Inter, sans-serif",
};

export const legendWrapperStyle = {
  color: chartTheme.legendText,
  fontSize: 12,
  paddingTop: 20,
};

export const tooltipStyle = {
  backgroundColor: chartTheme.tooltipBg,
  border: `1px solid ${chartTheme.tooltipBorder}`,
  borderRadius: 16,
  boxShadow: chartTheme.tooltipShadow,
  backdropFilter: "blur(12px)",
};

export const formatLargeNumber = (value: number) => {
  const absValue = Math.abs(value);
  if (absValue >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (absValue >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (absValue >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toString();
};

export const formatCompactCurrency = (value: number) => {
  if (!value && value !== 0) return "—";
  return new Intl.NumberFormat("vi-VN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
};

export const formatPercent = (value: number, digits = 1) => `${value.toFixed(digits)}%`;

