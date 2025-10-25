// Admin API endpoints
export const ADMIN_ENDPOINTS = {
  LOGS: "/admin/logs",
  USER_STATISTICS: "/admin/users/statistics",
  PRODUCT_STATISTICS: "/admin/products/statistics",
  CONFIG: "/admin/config",
  USER_ROLE: "/admin/users/:id/role",
  DELETE_USER: "/admin/users/:id",
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
