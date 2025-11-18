import React from "react";
import { Card } from "@/foundation/components/info/Card";
import { Settings, User, Bell, Shield, Globe, Palette } from "lucide-react";

const SettingsPage: React.FC = () => {
  return (
    <div className="p-6 min-h-screen bg-background-base">
      <h1 className="text-3xl font-bold mb-6 text-neutral-10">Cài đặt</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-10">Tài khoản</h3>
              <p className="text-sm text-neutral-6">Quản lý thông tin tài khoản</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <Bell className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-10">Thông báo</h3>
              <p className="text-sm text-neutral-6">Cài đặt thông báo</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-10">Bảo mật</h3>
              <p className="text-sm text-neutral-6">Cài đặt bảo mật và quyền truy cập</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Globe className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-10">Ngôn ngữ</h3>
              <p className="text-sm text-neutral-6">Cài đặt ngôn ngữ hiển thị</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-pink-100 dark:bg-pink-900 rounded-lg">
              <Palette className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-10">Giao diện</h3>
              <p className="text-sm text-neutral-6">Tùy chỉnh giao diện</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gray-100 dark:bg-gray-900 rounded-lg">
              <Settings className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-10">Hệ thống</h3>
              <p className="text-sm text-neutral-6">Cài đặt hệ thống</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;

