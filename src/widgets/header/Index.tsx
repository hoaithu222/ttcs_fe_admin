import { Bell, User, LogOut, Settings, ChevronDown, Moon, Sun, MessageSquare } from "lucide-react";
import Button from "@/foundation/components/buttons/Button";
import { useAuth } from "@/features/Auth/hooks/useAuth";
import { useState, useRef, useEffect } from "react";

import Image from "@/foundation/components/icons/Image";
import IconButton from "@/foundation/components/buttons/IconButton";
import { RootState } from "@/app/store";
import { themeRootSelector } from "@/app/store/slices/theme/selectors";
import { toggleTheme } from "@/app/store/slices/theme";
import { useAppDispatch, useAppSelector } from "@/app/store";
import SearchInput from "@/foundation/components/input/search-input/SearchInput";
import * as Form from "@radix-ui/react-form";
import { useNavigate } from "react-router-dom";
import { NAVIGATION_CONFIG } from "@/app/router/naviagtion.config";
import {
  selectNotifications,
  selectUnreadCount,
} from "@/app/store/slices/notification/notification.selector";
import {
  getNotificationsStart,
  markAsReadStart,
  markAllAsReadStart,
} from "@/app/store/slices/notification/notification.slice";
import { Notification } from "@/core/api/notifications/type";
import { selectTotalUnreadCount } from "@/app/store/slices/chat/chat.selector";
import { getConversationsStart } from "@/app/store/slices/chat/chat.slice";

const Header = () => {
  const { user, onLogout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const navigation = useNavigate();
  const { theme } = useAppSelector((state: RootState) => themeRootSelector(state));
  
  // Get notifications from Redux slice
  const notifications = useAppSelector(selectNotifications);
  const unreadCount = useAppSelector(selectUnreadCount);
  
  // Get chat unread count
  const chatUnreadCount = useAppSelector(selectTotalUnreadCount);

  const displayedNotifications = notifications.slice(0, 8);

  // Load notifications when component mounts
  useEffect(() => {
    dispatch(getNotificationsStart({ query: { page: 1, limit: 10 } }));
  }, [dispatch]);

  // Load conversations when component mounts
  useEffect(() => {
    if (user?._id) {
      dispatch(getConversationsStart({ query: { page: 1, limit: 50 } }));
    }
  }, [dispatch, user?._id]);

  const formatRelativeTime = (value?: string) => {
    if (!value) return "";
    const date = new Date(value);
    const diffSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diffSeconds < 60) return "Vừa xong";
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} phút trước`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} giờ trước`;
    return date.toLocaleDateString("vi-VN");
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isNotificationOpen && unreadCount > 0) {
      dispatch(markAllAsReadStart());
    }
  }, [isNotificationOpen, dispatch, unreadCount]);

  // Load more notifications when notification panel opens
  useEffect(() => {
    if (isNotificationOpen) {
      dispatch(getNotificationsStart({ query: { page: 1, limit: 20 } }));
    }
  }, [isNotificationOpen, dispatch]);

  const handleLogout = () => {
    onLogout();
    setIsDropdownOpen(false);
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <header className="border-b shadow-sm border-border-2 bg-header">
      <div className="flex justify-between items-center px-6 py-4 h-16">
        {/* Left side - Logo/Brand */}
        <div className="flex items-center space-x-4">
          <div
            className="flex overflow-hidden items-center space-x-2 w-12 h-12 rounded-lg cursor-pointer lg:w-14 lg:h-14"
            onClick={() => navigation(NAVIGATION_CONFIG.homeConfiguration.path)}
          >
            <Image name="logo" alt="logo" />
          </div>
        </div>

        {/* Center - Search 
        <div className="flex flex-1 justify-center items-center mx-4 max-w-md md:mx-8">
          <div className="relative w-full">
          
            <div className="absolute inset-0 bg-gradient-to-r rounded-xl opacity-0 blur-sm transition-opacity duration-300 from-primary-6/20 via-primary-8/10 to-primary-6/20 hover:opacity-100" />

         
            <div className="absolute inset-0 rounded-xl border opacity-0 transition-all duration-300 pointer-events-none border-primary-6/30 hover:opacity-100" />

            <div className="relative">
              <Form.Root>
                <Form.Field name="search">
                  <SearchInput
                    searchItems={[]}
                    name="search"
                    sizeInput="xl"
                    inputWrapperClassName="w-full"
                    inputClassName="focus:ring-2 focus:ring-primary-6/50 focus:border-primary-6 transition-all duration-300 h-12"
                  />
                </Form.Field>
              </Form.Root>
            </div>
          </div>
        </div>
        */}

        {/* Right side - Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <Button
              variant="ghost"
              className="relative"
              onClick={() => setIsNotificationOpen((prev) => !prev)}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1 min-w-[1.25rem] h-5 flex justify-center items-center text-xs font-semibold text-white bg-red-500 rounded-full">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Button>

            {isNotificationOpen && (
              <div className="absolute right-0 z-50 mt-2 w-96 rounded-lg border border-border-2 bg-white shadow-lg dark:bg-gray-800 dark:border-gray-700">
                <div className="flex justify-between items-center px-4 py-3 border-b border-border-2">
                  <p className="text-lg text-primary-6 font-semibold">Thông báo</p>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => dispatch(markAllAsReadStart())}
                      className="text-xs text-primary-6 hover:underline"
                    >
                      Đánh dấu đã đọc
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto hidden-scrollbar">
                  {displayedNotifications.length === 0 ? (
                    <p className="px-4 py-6 text-sm text-gray-500">
                      Chưa có thông báo nào
                    </p>
                  ) : (
                    displayedNotifications.map((notification: Notification) => (
                      <button
                        key={notification._id}
                        className={`flex flex-col px-4 py-3 w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                          !notification.isRead ? "bg-blue-50 dark:bg-blue-900/10" : ""
                        }`}
                        onClick={() => {
                          // Mark as read when clicked
                          if (!notification.isRead) {
                            dispatch(markAsReadStart({ id: notification._id }));
                          }
                          if (notification.actionUrl) {
                            navigation(notification.actionUrl);
                          }
                          setIsNotificationOpen(false);
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                              {notification.title || "Thông báo"}
                            </p>
                            {notification.message && (
                              <p className="mt-1 text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                                {notification.message}
                              </p>
                            )}
                            <span className="mt-1 text-[11px] text-gray-400">
                              {formatRelativeTime(notification.createdAt)}
                            </span>
                          </div>
                          {!notification.isRead && (
                            <div className="ml-2 w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Hien thi icon chat */}
          <div className="relative">
            <IconButton
              icon={<MessageSquare className="w-5 h-5" />}
              variant="ghost"
              tooltip="Chat"
              onClick={() => navigation(NAVIGATION_CONFIG.chat.path)}
            />
            {chatUnreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-bold text-white bg-error rounded-full">
                {chatUnreadCount > 9 ? "9+" : chatUnreadCount}
              </span>
            )}
          </div>
          {/* Dark/Light Mode Toggle */}
          <IconButton
            icon={theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            variant="ghost"
            onClick={handleToggleTheme}
            tooltip={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            ariaLabel={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          />

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center px-3 py-2 space-x-3 rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {user?.name || "Admin User"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.role || "Administrator"}
                </p>
              </div>
              <div className="flex justify-center items-center w-8 h-8 bg-gray-300 rounded-full dark:bg-gray-600">
                <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 z-50 py-1 mt-2 w-48 bg-white rounded-lg border border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700">
                <button
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center px-4 py-2 space-x-3 w-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                <hr className="my-1 border-gray-200 dark:border-gray-700" />
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 space-x-3 w-full text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
