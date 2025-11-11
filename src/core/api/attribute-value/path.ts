// Attribute Values API endpoints
export const ATTRIBUTE_VALUES_ENDPOINTS = {
  LIST: "/attribute-values",
  DETAIL: "/attribute-values/:id",
  CREATE: "/attribute-values",
  UPDATE: "/attribute-values/:id",
  DELETE: "/attribute-values/:id",
  BULK_UPSERT: "/attribute-values/bulk",
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

