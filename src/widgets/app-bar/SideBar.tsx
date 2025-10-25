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
} from "lucide-react";
import Button from "@/foundation/components/buttons/Button";
import { useAuth } from "@/features/Auth/hooks/useAuth";

const Sidebar = () => {
  const location = useLocation();
  const { onLogout } = useAuth();

  const menuItems = [
    { key: "home", icon: Home, path: NAVIGATION_CONFIG.home.path },
    { key: "dashboard", icon: LayoutDashboard, path: NAVIGATION_CONFIG.dashboard.path },
    { key: "users", icon: Users, path: NAVIGATION_CONFIG.users.path },
    { key: "products", icon: Package, path: NAVIGATION_CONFIG.products.path },
    { key: "orders", icon: ShoppingCart, path: NAVIGATION_CONFIG.orders.path },
    { key: "categories", icon: FolderOpen, path: NAVIGATION_CONFIG.categories.path },
    { key: "analytics", icon: BarChart3, path: NAVIGATION_CONFIG.analytics.path },
    { key: "settings", icon: Settings, path: NAVIGATION_CONFIG.settings.path },
  ];

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="h-full bg-white border-r border-gray-200 shadow-sm">
      <div className="p-4">
        <h2 className="mb-6 text-lg font-semibold text-gray-800">Admin Panel</h2>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.key}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "text-blue-600 bg-blue-50 border-r-2 border-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{NAVIGATION_CONFIG[item.key]?.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 mt-8 border-t border-gray-200">
          <Button
            onClick={handleLogout}
            className="flex items-center px-3 py-2 space-x-3 w-full text-red-600 hover:bg-red-50"
            variant="ghost"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
