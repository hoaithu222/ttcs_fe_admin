// Users API endpoints
export const USERS_ENDPOINTS = {
  LIST: "/users/users",
  DETAIL: "/users/users/:id",
  UPDATE: "/users/users/:id",
  UPDATE_PARTIAL: "/users/users/update/:id",
  DELETE: "/users/users/:id",
  SUSPEND: "/users/users/:id/suspend",
  UNLOCK: "/users/users/:id/unlock",
  SECURITY: "/users/me/security",
  ENABLE_2FA: "/users/me/2fa/enable",
  VERIFY_2FA: "/users/me/2fa/verify",
  DELETE_ACCOUNT: "/users/me",
  CHANGE_OTP_METHOD: "/change-method-otp",
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
