// Attribute Types API endpoints
export const ATTRIBUTE_TYPES_ENDPOINTS = {
  LIST: "/attribute-types",
  DETAIL: "/attribute-types/:id",
  CREATE: "/attribute-types",
  UPDATE: "/attribute-types/:id",
  DELETE: "/attribute-types/:id",
  RESTORE: "/attribute-types/:id/restore",
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

