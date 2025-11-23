// Home API endpoints
export const HOME_ENDPOINTS = {
  BANNER: "/home/banner",
  CATEGORIES: "/home/categories",
  BEST_SELLER: "/home/best-seller",
  BEST_SHOPS: "/home/best-shops",
  FLASH_SALE: "/home/flash-sale",
  SEARCH_SUGGESTION: "/home/search-suggestion",
  // Home Configuration endpoints
  CONFIGURATION: "/home/configuration",
  ADMIN_CONFIGURATION: "/home/admin/configuration",
  ADMIN_CONFIGURATION_DETAIL: "/home/admin/configuration/:id",
} as const;

// Generic endpoint builder
export const buildEndpoint = (
  endpoint: string,
  params?: Record<string, string | number>
): string => {
  let builtEndpoint = endpoint;
  if (params) {
    Object.keys(params).forEach((key) => {
      builtEndpoint = builtEndpoint.replace(`:${key}`, String(params[key]));
    });
  }
  return builtEndpoint;
};

