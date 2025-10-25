//  định nghĩa các route cho navigation

export interface NavigationConfig {
  path: string;
  name: string;
  requireAuth: boolean;
}
export const NAVIGATION_CONFIG: Record<string, NavigationConfig> = {
  home: {
    path: "/",
    name: "Home",
    requireAuth: true,
  },
  login: {
    path: "/login",
    name: "Login",
    requireAuth: false,
  },
  dashboard: {
    path: "/dashboard",
    name: "Dashboard",
    requireAuth: true,
  },
  users: {
    path: "/users",
    name: "Users",
    requireAuth: true,
  },
  products: {
    path: "/products",
    name: "Products",
    requireAuth: true,
  },
  orders: {
    path: "/orders",
    name: "Orders",
    requireAuth: true,
  },
  categories: {
    path: "/categories",
    name: "Categories",
    requireAuth: true,
  },
  analytics: {
    path: "/analytics",
    name: "Analytics",
    requireAuth: true,
  },
  settings: {
    path: "/settings",
    name: "Settings",
    requireAuth: true,
  },
} satisfies Record<string, NavigationConfig>;
