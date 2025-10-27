import { lazy } from "react";
import { NAVIGATION_CONFIG } from "./naviagtion.config";
const HomePage = lazy(() => import("@/features/Home/HomePage"));
const AuthPage = lazy(() => import("@/features/Auth/AuthPage"));
const DashboardPage = lazy(() => import("@/features/Dashboard/DashboardPage"));
const UsersPage = lazy(() => import("@/features/Users/UsersPage"));
const ProductsPage = lazy(() => import("@/features/Products/ProductsPage"));
const CategoriesPage = lazy(() => import("@/features/Category/page/CategoryPage"));
const defaultOptions = {
  requireAuth: false,
  hideInMenu: false,
};
const defaultAuthOptions = {
  ...defaultOptions,
  requireAuth: true,
};

export const ROUTE = {
  home: {
    path: NAVIGATION_CONFIG.home.path,
    element: <HomePage />,
    layout: "main",
    options: defaultAuthOptions,
  },
  login: {
    path: NAVIGATION_CONFIG.login.path,
    element: <AuthPage />,
    layout: "login",
    options: defaultOptions,
  },
  dashboard: {
    path: NAVIGATION_CONFIG.dashboard.path,
    element: <DashboardPage />,
    layout: "main",
    options: defaultAuthOptions,
  },
  users: {
    path: NAVIGATION_CONFIG.users.path,
    element: <UsersPage />,
    layout: "main",
    options: defaultAuthOptions,
  },
  products: {
    path: NAVIGATION_CONFIG.products.path,
    element: <ProductsPage />,
    layout: "main",
    options: defaultAuthOptions,
  },
  categories: {
    path: NAVIGATION_CONFIG.categories.path,
    element: <CategoriesPage />,
    layout: "main",
    options: defaultAuthOptions,
  },
} satisfies Record<
  string,
  {
    path: string;
    element: React.ReactNode;
    layout: React.ReactNode;
    options: {
      requireAuth: boolean;
      hideInMenu: boolean;
    };
  }
>;
