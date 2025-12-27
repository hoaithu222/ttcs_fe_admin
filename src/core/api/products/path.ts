// Product API endpoints
export const PRODUCT_ENDPOINTS = {
  LIST: "/products",
  GET: "/products/:id",
  UPDATE_STATUS: "/products/:id/status",
  SEARCH: "/products/search",
} as const;

// Alias for backward compatibility
export const PRODUCTS_ENDPOINTS = PRODUCT_ENDPOINTS;

// Generic endpoint builder
export const buildEndpoint = (
  endpoint: string,
  params?: Record<string, string | number>
): string => {
  if (!params) return endpoint;

  return Object.entries(params).reduce(
    (acc, [key, value]) => acc.replace(`:${key}`, String(value)),
    endpoint
  );
};
