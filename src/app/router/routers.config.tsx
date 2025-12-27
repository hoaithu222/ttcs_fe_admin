import { lazy } from "react";
import { NAVIGATION_CONFIG } from "./naviagtion.config";
const HomePage = lazy(() => import("@/features/Home/page/HomePage"));
const AuthPage = lazy(() => import("@/features/Auth/AuthPage"));
const DashboardPage = lazy(() => import("@/features/Dashboard/page/DashboardPage"));
const AnalyticsPage = lazy(() => import("@/features/Analytics/page/AnalyticsPage"));
const SettingsPage = lazy(() => import("@/features/Settings/page/SettingsPage"));
const UsersPage = lazy(() => import("@/features/Users/UsersPage"));
const ProductsPage = lazy(() => import("@/features/Products/ProductsPage").then(module => ({ default: module.ProductsPage })));
const ShopPage = lazy(() => import("@/features/Shop/page/ShopPage"));
// Switch to static imports to avoid dynamic import fetch errors during dev
import CategoriesPage from "@/features/Category/page/CategoryPage";
import SubCategoriesPage from "@/features/SubCategory/page/SubCategoryPage";
const AttributesPage = lazy(() => import("@/features/Attribute/pages/AttributePage"));
const WalletPage = lazy(() => import("@/features/Wallet/pages/WalletPage"));
const ChatPage = lazy(() => import("@/features/Chat/pages/ChatPage"));
const HomeConfigurationPage = lazy(() => import("@/features/Home/pages/HomeConfigurationPage"));
const defaultOptions = {
  requireAuth: false,
  requireAdmin: false,
  hideInMenu: false,
};
const defaultAuthOptions = {
  ...defaultOptions,
  requireAuth: true,
};
const defaultAdminOptions = {
  ...defaultAuthOptions,
  requireAdmin: true,
};

export const ROUTE = {
  home: {
    path: NAVIGATION_CONFIG.homeConfiguration.path,
    element: <HomeConfigurationPage />,
    layout: "main",
    options: defaultAdminOptions,
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
    options: defaultAdminOptions,
  },
  users: {
    path: NAVIGATION_CONFIG.users.path,
    element: <UsersPage />,
    layout: "main",
    options: defaultAdminOptions,
  },
  products: {
    path: NAVIGATION_CONFIG.products.path,
    element: <ProductsPage />,
    layout: "main",
    options: defaultAdminOptions,
  },
  categories: {
    path: NAVIGATION_CONFIG.categories.path,
    element: <CategoriesPage />,
    layout: "main",
    options: defaultAdminOptions,
  },
  subCategories: {
    path: NAVIGATION_CONFIG.subCategories.path,
    element: <SubCategoriesPage />,
    layout: "main",
    options: defaultAdminOptions,
  },
  attributes: {
    path: NAVIGATION_CONFIG.attributes.path,
    element: <AttributesPage />,
    layout: "main",
    options: defaultAdminOptions,
  },
  shops: {
    path: NAVIGATION_CONFIG.shops.path,
    element: <ShopPage />,
    layout: "main",
    options: defaultAdminOptions,
  },
  analytics: {
    path: NAVIGATION_CONFIG.analytics.path,
    element: <AnalyticsPage />,
    layout: "main",
    options: defaultAdminOptions,
  },
  settings: {
    path: NAVIGATION_CONFIG.settings.path,
    element: <SettingsPage />,
    layout: "main",
    options: defaultAdminOptions,
  },
  wallets: {
    path: NAVIGATION_CONFIG.wallets.path,
    element: <WalletPage />,
    layout: "main",
    options: defaultAdminOptions,
  },
  chat: {
    path: NAVIGATION_CONFIG.chat.path,
    element: <ChatPage />,
    layout: "main",
    options: defaultAdminOptions,
  },
  // homeConfiguration: {
  //   path: NAVIGATION_CONFIG.homeConfiguration.path,
  //   element: <HomeConfigurationPage />,
  //   layout: "main",
  //   options: defaultAuthOptions,
  // },
} satisfies Record<
  string,
  {
    path: string;
    element: React.ReactNode;
    layout: React.ReactNode;
    options: {
      requireAuth: boolean;
      requireAdmin?: boolean;
      hideInMenu: boolean;
    };
  }
>;
