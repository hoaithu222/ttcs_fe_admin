// Orders API endpoints
export const ORDERS_ENDPOINTS = {
  LIST: "/orders",
  DETAIL: "/orders/:id",
  CREATE: "/orders",
  UPDATE: "/orders/:id",
  UPDATE_STATUS: "/orders/:id/status",
  DELETE: "/orders/:id",
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
