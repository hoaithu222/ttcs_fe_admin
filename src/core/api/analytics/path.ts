// Analytics API endpoints
export const ANALYTICS_ENDPOINTS = {
  ADMIN_REVENUE: "/analytics/admin/revenue",
  SHOP_REVENUE: "/analytics/shops/:shopId/revenue",
  TIMESERIES_REVENUE: "/analytics/timeseries/revenue",
  TOP_PRODUCTS: "/analytics/top/products",
  SHOP_TOP_PRODUCTS: "/analytics/shops/:shopId/top-products",
  TOP_SHOPS: "/analytics/top/shops",
  ORDERS_STATUS_DISTRIBUTION: "/analytics/orders/status-distribution",
  ORDERS_AOV: "/analytics/orders/aov",
} as const;

// Generic endpoint builder
export const buildEndpoint = (
  endpoint: string,
  params?: Record<string, string | number>
): string => {
  if (!params) return endpoint;

  return Object.entries(params).reduce((url, [key, value]) => {
    return url.replace(`:${key}`, String(value));
  }, endpoint);
};
