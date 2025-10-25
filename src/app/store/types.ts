// Store types
export interface RootState {
  language: {
    current: string;
    available: string[];
  };
  theme: {
    mode: "light" | "dark";
    colors: Record<string, string>;
  };
  auth: {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: {
      _id: string;
      name: string;
      email: string;
      avatar?: string;
      status: "active" | "inactive";
      role: string;
      accessToken?: string;
      refreshToken?: string;
      createdAt: string;
      updatedAt: string;
    } | null;
    error: string | null;
  };
  toast: {
    messages: Array<{
      id: string;
      type: "success" | "error" | "warning" | "info";
      message: string;
      duration?: number;
    }>;
  };
}

export enum ReduxStateType {
  INIT = "INIT",
  LOADING = "LOADING",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

// Define AppReducerType as a const object for use as values
export const AppReducerType = {
  LANGUAGE: "language",
  THEME: "theme",
  AUTH: "auth",
  TOAST: "toast",
} as const;

export type AppReducerTypeKeys = keyof typeof AppReducerType;
