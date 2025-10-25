// Categories API endpoints
export const CATEGORIES_ENDPOINTS = {
  LIST: "/category",
  DETAIL: "/category/:id",
  SUB_CATEGORIES: "/category/:id/sub-categories",
  CREATE: "/category",
  UPDATE: "/category/:id",
  DELETE: "/category/:id",
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
