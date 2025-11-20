import { Link, useLocation } from "react-router-dom";
import { NAVIGATION_CONFIG } from "@/app/router/naviagtion.config";
import {
  Home,
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  FolderOpen,
  BarChart3,
  Settings,
  LogOut,
  ShoppingBag,
  Wallet,
} from "lucide-react";
import Button from "@/foundation/components/buttons/Button";
import ScrollView from "@/foundation/components/scroll/ScrollView";
import { useAuth } from "@/features/Auth/hooks/useAuth";

const Sidebar = () => {
  const location = useLocation();
  const { onLogout } = useAuth();

  const menuItems = [
    { key: "home", icon: Home, path: NAVIGATION_CONFIG.home.path },
    { key: "dashboard", icon: LayoutDashboard, path: NAVIGATION_CONFIG.dashboard.path },
    { key: "users", icon: Users, path: NAVIGATION_CONFIG.users.path },
    // { key: "products", icon: Package, path: NAVIGATION_CONFIG.products.path },
    // { key: "orders", icon: ShoppingCart, path: NAVIGATION_CONFIG.orders.path },
    { key: "categories", icon: FolderOpen, path: NAVIGATION_CONFIG.categories.path },
    { key: "subCategories", icon: FolderOpen, path: NAVIGATION_CONFIG.subCategories.path },
    { key: "attributes", icon: FolderOpen, path: NAVIGATION_CONFIG.attributes.path },
    { key: "shops", icon: ShoppingBag, path: NAVIGATION_CONFIG.shops.path },
    { key: "analytics", icon: BarChart3, path: NAVIGATION_CONFIG.analytics.path },
    { key: "wallets", icon: Wallet, path: NAVIGATION_CONFIG.wallets.path },
    { key: "settings", icon: Settings, path: NAVIGATION_CONFIG.settings.path },
  ];

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="flex flex-col h-full border-r shadow-lg border-border-2">
      {/* Navigation Menu */}
      <ScrollView
        className="flex-1"
        hideScrollbarX={true}
        scrollbarThickness={6}
        thumbClassName="bg-neutral-4 hover:bg-neutral-5"
        trackClassName="bg-transparent"
      >
        <nav className="px-4 py-6 space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.key}
                to={item.path}
                style={{ animationDelay: `${index * 50}ms` }}
                className={`group relative flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] ${
                  isActive
                    ? "shadow-md text-primary-6 bg-primary-10 hover:bg-primary-10"
                    : "text-neutral-6 hover:text-primary-6 hover:bg-neutral-2/70 hover:shadow-sm"
                }`}
              >
                {/* Active Background Layer */}
                {isActive && (
                  <>
                    <div className="absolute left-0 top-1/2 w-1 h-10 bg-gradient-to-b rounded-r-full shadow-sm -translate-y-1/2 from-primary-6 to-primary-8" />
                    <div className="absolute inset-0 bg-gradient-to-r to-transparent rounded-xl from-primary-6/5" />
                    <div className="absolute inset-0 rounded-xl ring-1 ring-primary-6/20" />
                  </>
                )}

                {/* Hover Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-r to-transparent rounded-xl opacity-0 transition-opacity duration-300 from-primary-6/10 group-hover:opacity-100" />

                {/* Icon Container with Animation */}
                <div
                  className={`relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "text-white bg-gradient-to-br shadow-md scale-105 from-primary-6 to-primary-8"
                      : "bg-icon-rounded-first text-neutral-6 group-hover:bg-primary-10/50 group-hover:text-primary-6 group-hover:scale-105 group-hover:shadow-sm"
                  }`}
                >
                  <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-tr to-transparent rounded-lg from-white/20" />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`relative text-sm font-medium flex-1 transition-all duration-300 ${
                    isActive ? "font-semibold text-primary-6" : "group-hover:font-medium"
                  }`}
                >
                  {NAVIGATION_CONFIG[item.key]?.name}
                </span>

                {/* Active Badge */}
                {isActive && (
                  <div className="absolute right-3 top-1/2 w-2 h-2 rounded-full shadow-sm animate-pulse -translate-y-1/2 bg-primary-6" />
                )}

                {/* Hover Arrow with Animation */}
                {!isActive && (
                  <div className="opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-6" />
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </ScrollView>

      {/* Logout Section */}
      <div className="px-4 py-4 pb-6 border-t border-divider-1 bg-neutral-1/30">
        <Button
          onClick={handleLogout}
          className="flex justify-start items-center px-4 py-3.5 space-x-3 w-full rounded-xl transition-all duration-300 text-error hover:bg-error/10 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden"
          variant="ghost"
        >
          {/* Gradient Background on Hover */}
          <div className="absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-300 from-error/10 to-error/5 group-hover:opacity-100" />

          <div className="flex relative justify-center items-center w-10 h-10 rounded-lg transition-all duration-300 bg-error/10 group-hover:bg-error/20 group-hover:scale-105 group-hover:shadow-sm">
            <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </div>
          <span className="relative text-sm font-medium">Logout</span>

          {/* Hover Indicator */}
          <div className="absolute left-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="w-1 h-6 rounded-full bg-error" />
          </div>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
