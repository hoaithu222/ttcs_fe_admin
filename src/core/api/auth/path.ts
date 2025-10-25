// Authentication API endpoints
export const AUTH_ENDPOINTS = {
  REGISTER: "/auth/register",
  VERIFY_EMAIL: "/auth/verify-email",
  RESEND_VERIFY_EMAIL: "/auth/resend-verify-email",
  LOGIN: "/auth/login",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  LOGOUT: "/auth/logout",
  REFRESH_TOKEN: "/auth/refresh",
  PROFILE: "/auth/profile",
  UPDATE_PROFILE: "/auth/profile",
  CHANGE_PASSWORD: "/auth/change-password",
} as const;

// OTP API endpoints
export const OTP_ENDPOINTS = {
  REQUEST: "/otp/request",
  VERIFY: "/otp/verify",
} as const;

// Social Authentication endpoints
export const SOCIAL_AUTH_ENDPOINTS = {
  GOOGLE: "/auth/social/google",
  GOOGLE_CALLBACK: "/auth/social/google/callback",
  FACEBOOK: "/auth/social/facebook",
  FACEBOOK_CALLBACK: "/auth/social/facebook/callback",
  GITHUB: "/auth/social/github",
  GITHUB_CALLBACK: "/auth/social/github/callback",
} as const;

// Products API endpoints (legacy)
export const PRODUCTS_ENDPOINTS = {
  LIST: "/products",
  DETAIL: "/products/:id",
  CREATE: "/products",
  UPDATE: "/products/:id",
  DELETE: "/products/:id",
  SEARCH: "/products/search",
  CATEGORIES: "/products/categories",
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
