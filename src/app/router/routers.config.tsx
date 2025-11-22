import { lazy } from "react";
import { NAVIGATION_CONFIG } from "./naviagtion.config";
const HomePage = lazy(() => import("@/features/Home/page/HomePage"));
const AuthPage = lazy(() => import("@/features/Auth/AuthPage"));
const DashboardPage = lazy(() => import("@/features/Dashboard/page/DashboardPage"));
const AnalyticsPage = lazy(() => import("@/features/Analytics/page/AnalyticsPage"));
const SettingsPage = lazy(() => import("@/features/Settings/page/SettingsPage"));
const UsersPage = lazy(() => import("@/features/Users/UsersPage"));
const ProductsPage = lazy(() => import("@/features/Products/ProductsPage"));
const ShopPage = lazy(() => import("@/features/Shop/page/ShopPage"));
// Switch to static imports to avoid dynamic import fetch errors during dev
import CategoriesPage from "@/features/Category/page/CategoryPage";
import SubCategoriesPage from "@/features/SubCategory/page/SubCategoryPage";
const AttributesPage = lazy(() => import("@/features/Attribute/pages/AttributePage"));
const WalletPage = lazy(() => import("@/features/Wallet/pages/WalletPage"));
const ChatPage = lazy(() => import("@/features/Chat/pages/ChatPage"));
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
  subCategories: {
    path: NAVIGATION_CONFIG.subCategories.path,
    element: <SubCategoriesPage />,
    layout: "main",
    options: defaultAuthOptions,
  },
  attributes: {
    path: NAVIGATION_CONFIG.attributes.path,
    element: <AttributesPage />,
    layout: "main",
    options: defaultAuthOptions,
  },
  shops: {
    path: NAVIGATION_CONFIG.shops.path,
    element: <ShopPage />,
    layout: "main",
    options: defaultAuthOptions,
  },
  analytics: {
    path: NAVIGATION_CONFIG.analytics.path,
    element: <AnalyticsPage />,
    layout: "main",
    options: defaultAuthOptions,
  },
  settings: {
    path: NAVIGATION_CONFIG.settings.path,
    element: <SettingsPage />,
    layout: "main",
    options: defaultAuthOptions,
  },
  wallets: {
    path: NAVIGATION_CONFIG.wallets.path,
    element: <WalletPage />,
    layout: "main",
    options: defaultAuthOptions,
  },
  chat: {
    path: NAVIGATION_CONFIG.chat.path,
    element: <ChatPage />,
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
