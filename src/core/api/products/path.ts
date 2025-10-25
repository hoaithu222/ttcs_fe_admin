// Products API endpoints
export const PRODUCTS_ENDPOINTS = {
  LIST: "/products",
  DETAIL: "/products/:id",
  CREATE: "/products",
  UPDATE: "/products/:id",
  DELETE: "/products/:id",
  SEARCH: "/products/search",
  CATEGORIES: "/products/categories",
  SUBCATEGORIES: "/products/subcategories",
  SHOPS: "/products/shops",
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
