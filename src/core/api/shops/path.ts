// Shops API endpoints
export const SHOPS_ENDPOINTS = {
  LIST: "/shops",
  DETAIL: "/shops/:id",
  CREATE: "/shops",
  UPDATE: "/shops/:id",
  DELETE: "/shops/:id",
  FOLLOW: "/shops/:id/follow",
  UNFOLLOW: "/shops/:id/follow",
  FOLLOWING: "/shops/:id/following",
  FOLLOWERS_COUNT: "/shops/:id/followers/count",
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
