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
  category: {
    categories: Array<any>;
    selectedCategory: any | null;
    isLoading: boolean;
    error: string | null;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    filters: {
      search: string;
      isActive: boolean | undefined;
    };
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
  CATEGORY: "category",
} as const;

export type AppReducerTypeKeys = keyof typeof AppReducerType;
