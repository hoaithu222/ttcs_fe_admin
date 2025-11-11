// Product Attributes API endpoints
export const PRODUCT_ATTRIBUTES_ENDPOINTS = {
  LIST: "/product-attributes",
  DETAIL: "/product-attributes/:id",
  CREATE: "/product-attributes",
  UPDATE: "/product-attributes/:id",
  DELETE: "/product-attributes/:id",
  BULK_ASSIGN: "/product-attributes/bulk-assign",
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
