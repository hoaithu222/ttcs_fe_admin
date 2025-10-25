// Base HTTP Client exports
export { VpsHttpClient, tokenStorage } from "./http-client";
export type { ErrorData } from "./http-client";

// Re-export commonly used types
export type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// Authentication API exports
export { authApi, otpApi, socialAuthApi } from "../api/auth";
export type {
  RegisterUserRequest,
  LoginRequest,
  ResendVerifyEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  OtpRequest,
  OtpVerifyRequest,
  LoginResponseData,
  RegisterResponseData,
  SimpleMessageData,
  SocialLoginResponseData,
  User,
  ApiSuccess,
  ApiError,
  AuthResponse,
  RefreshTokenResponse,
  UserRole,
  TokenPayload,
} from "../api/auth/type";

// Products API exports
export { productsApi } from "../api/products";
export type {
  CreateProductRequest,
  UpdateProductRequest,
  ProductsQueryParams,
  Product,
  ProductsListResponse,
} from "../api/products/type";

// API endpoints
export {
  AUTH_ENDPOINTS,
  OTP_ENDPOINTS,
  SOCIAL_AUTH_ENDPOINTS,
  PRODUCTS_ENDPOINTS,
  buildEndpoint,
} from "../api/auth/path";
export { PRODUCTS_ENDPOINTS as PRODUCTS_API_ENDPOINTS } from "../api/products/path";
