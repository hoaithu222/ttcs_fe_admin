import { AUTH_ENDPOINTS, OTP_ENDPOINTS, SOCIAL_AUTH_ENDPOINTS } from "./path";
import type {
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
  RefreshTokenResponse,
} from "./type";
import { API_BASE_URL } from "@/app/config/env.config";

// Simple axios instance for auth API
import axios from "axios";

const authClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor để thêm access token
authClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để handle token expiry
authClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const refreshResponse = await authClient.post(AUTH_ENDPOINTS.REFRESH_TOKEN, {
            refreshToken,
          });

          if (refreshResponse.data.success) {
            const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;

            // Cập nhật token mới
            localStorage.setItem("accessToken", accessToken);
            if (newRefreshToken) {
              localStorage.setItem("refreshToken", newRefreshToken);
            }

            // Retry original request với token mới
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return authClient(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh token thất bại, logout user
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Authentication API service
export const authApi = {
  // Register new user
  register: async (userData: RegisterUserRequest): Promise<ApiSuccess<RegisterResponseData>> => {
    const response = await authClient.post(AUTH_ENDPOINTS.REGISTER, userData);
    return response.data;
  },

  // Verify email with token
  verifyEmail: async (token: string): Promise<ApiSuccess<SimpleMessageData>> => {
    const response = await authClient.get(AUTH_ENDPOINTS.VERIFY_EMAIL, {
      params: { token },
    });
    return response.data;
  },

  // Resend verification email
  resendVerifyEmail: async (
    data: ResendVerifyEmailRequest
  ): Promise<ApiSuccess<SimpleMessageData>> => {
    const response = await authClient.post(AUTH_ENDPOINTS.RESEND_VERIFY_EMAIL, data);
    return response.data;
  },

  // Login user
  login: async (credentials: LoginRequest): Promise<ApiSuccess<LoginResponseData>> => {
    const response = await authClient.post(AUTH_ENDPOINTS.LOGIN, credentials);
    return response.data;
  },

  // Forgot password
  forgotPassword: async (data: ForgotPasswordRequest): Promise<ApiSuccess<SimpleMessageData>> => {
    const response = await authClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, data);
    return response.data;
  },

  // Reset password
  resetPassword: async (data: ResetPasswordRequest): Promise<ApiSuccess<SimpleMessageData>> => {
    const response = await authClient.post(AUTH_ENDPOINTS.RESET_PASSWORD, data);
    return response.data;
  },

  // Logout user
  logout: async (): Promise<ApiSuccess<void>> => {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await authClient.post(AUTH_ENDPOINTS.LOGOUT, {
      token: refreshToken,
    });
    return response.data;
  },

  // Refresh access token
  refreshToken: async (refreshToken: string): Promise<ApiSuccess<RefreshTokenResponse>> => {
    const response = await authClient.post(AUTH_ENDPOINTS.REFRESH_TOKEN, {
      refreshToken,
    });
    return response.data;
  },

  // Get user profile
  getProfile: async (): Promise<ApiSuccess<User>> => {
    const response = await authClient.get(AUTH_ENDPOINTS.PROFILE);
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData: Partial<User>): Promise<ApiSuccess<User>> => {
    const response = await authClient.put(AUTH_ENDPOINTS.UPDATE_PROFILE, userData);
    return response.data;
  },

  // Change password
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<ApiSuccess<void>> => {
    const response = await authClient.post(AUTH_ENDPOINTS.CHANGE_PASSWORD, data);
    return response.data;
  },
};

// OTP API service
export const otpApi = {
  // Request OTP
  request: async (data: OtpRequest): Promise<ApiSuccess<SimpleMessageData>> => {
    const response = await authClient.post(OTP_ENDPOINTS.REQUEST, data);
    return response.data;
  },

  // Verify OTP
  verify: async (data: OtpVerifyRequest): Promise<ApiSuccess<SimpleMessageData>> => {
    const response = await authClient.post(OTP_ENDPOINTS.VERIFY, data);
    return response.data;
  },
};

// Social Authentication API service
export const socialAuthApi = {
  // Google OAuth
  google: {
    login: (): string => {
      // Return Google OAuth URL for redirect
      return `${API_BASE_URL}${SOCIAL_AUTH_ENDPOINTS.GOOGLE}`;
    },
    callback: async (): Promise<ApiSuccess<SocialLoginResponseData>> => {
      const response = await authClient.get(SOCIAL_AUTH_ENDPOINTS.GOOGLE_CALLBACK);
      return response.data;
    },
  },

  // Facebook OAuth
  facebook: {
    login: (): string => {
      // Return Facebook OAuth URL for redirect
      return `${API_BASE_URL}${SOCIAL_AUTH_ENDPOINTS.FACEBOOK}`;
    },
    callback: async (): Promise<ApiSuccess<SocialLoginResponseData>> => {
      const response = await authClient.get(SOCIAL_AUTH_ENDPOINTS.FACEBOOK_CALLBACK);
      return response.data;
    },
  },

  // GitHub OAuth
  github: {
    login: (): string => {
      // Return GitHub OAuth URL for redirect
      return `${API_BASE_URL}${SOCIAL_AUTH_ENDPOINTS.GITHUB}`;
    },
    callback: async (): Promise<ApiSuccess<SocialLoginResponseData>> => {
      const response = await authClient.get(SOCIAL_AUTH_ENDPOINTS.GITHUB_CALLBACK);
      return response.data;
    },
  },
};

// Export default
export default authApi;
