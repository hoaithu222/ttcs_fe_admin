// Sub Categories API endpoints
export const SUB_CATEGORIES_ENDPOINTS = {
  LIST: "/sub-category",
  DETAIL: "/sub-category/:id",
  CREATE: "/sub-category",
  UPDATE: "/sub-category/:id",
  DELETE: "/sub-category/:id",
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
