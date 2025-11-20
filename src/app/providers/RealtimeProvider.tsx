import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { socketClients, SOCKET_EVENTS } from "@/core/socket";
import { tokenStorage } from "@/core/base";
import { AUTH_TOKENS_CHANGED_EVENT } from "@/shared/constants/events";
import { toastUtils } from "@/shared/utils/toast.utils";

const MAX_NOTIFICATIONS = 50;

export interface RealtimeNotification {
  id: string;
  title?: string;
  content?: string;
  type?: string;
  icon?: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
  priority?: string;
  createdAt?: string;
  isRead?: boolean;
  raw?: Record<string, unknown>;
}

interface NotificationCenterValue {
  notifications: RealtimeNotification[];
  unreadCount: number;
  markAllAsRead: () => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
}

const NotificationCenterContext = createContext<
  NotificationCenterValue | undefined
>(undefined);

export const useNotificationCenter = () => {
  const context = useContext(NotificationCenterContext);
  if (!context) {
    throw new Error(
      "useNotificationCenter must be used within RealtimeProvider"
    );
  }
  return context;
};

const generateNotificationId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
};

const toRealtimeNotification = (
  payload: Record<string, any>
): RealtimeNotification => {
  const id =
    (payload.notificationId && String(payload.notificationId)) ||
    (payload.id && String(payload.id)) ||
    generateNotificationId();

  return {
    id,
    title: payload.title,
    content: payload.content,
    type: payload.type,
    icon: payload.icon,
    actionUrl: payload.actionUrl,
    metadata: payload.metadata,
    priority: payload.priority,
    createdAt: payload.createdAt || new Date().toISOString(),
    isRead: false,
    raw: payload,
  };
};

const RealtimeProvider = ({ children }: PropsWithChildren) => {
  const [hasTokens, setHasTokens] = useState(() => tokenStorage.hasTokens());
  const [notifications, setNotifications] = useState<RealtimeNotification[]>(
    []
  );

  useEffect(() => {
    const handleTokenChange = (event: Event) => {
      const detail = (event as CustomEvent<{ hasTokens?: boolean }>).detail;
      if (detail && typeof detail.hasTokens === "boolean") {
        setHasTokens(detail.hasTokens);
      } else {
        setHasTokens(tokenStorage.hasTokens());
      }
    };
    const refreshFromFocus = () => setHasTokens(tokenStorage.hasTokens());

    window.addEventListener(
      AUTH_TOKENS_CHANGED_EVENT,
      handleTokenChange as EventListener
    );
    window.addEventListener("focus", refreshFromFocus);

    return () => {
      window.removeEventListener(
        AUTH_TOKENS_CHANGED_EVENT,
        handleTokenChange as EventListener
      );
      window.removeEventListener("focus", refreshFromFocus);
    };
  }, []);

  const addNotification = useCallback((payload: Record<string, any>) => {
    const notification = toRealtimeNotification(payload);
    setNotifications((prev) => {
      const next = [notification, ...prev];
      if (next.length > MAX_NOTIFICATIONS) {
        next.length = MAX_NOTIFICATIONS;
      }
      return next;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((item) => (item.isRead ? item : { ...item, isRead: true }))
    );
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id && !item.isRead ? { ...item, isRead: true } : item
      )
    );
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications]
  );

  useEffect(() => {
    if (!hasTokens) {
      socketClients.notifications.disconnect(true);
      return;
    }

    const socket = socketClients.notifications.connect(true);

    const handleNotification = (payload: Record<string, any>) => {
      addNotification(payload);
      const message =
        payload?.content ||
        payload?.title ||
        "Bạn vừa nhận được một thông báo mới";
      toastUtils.info(message);
    };

    socket.on(SOCKET_EVENTS.NOTIFICATION_SEND, handleNotification);

    return () => {
      socket.off(SOCKET_EVENTS.NOTIFICATION_SEND, handleNotification);
      socketClients.notifications.disconnect();
    };
  }, [addNotification, hasTokens]);

  const contextValue = useMemo(
    () => ({
      notifications,
      unreadCount,
      markAllAsRead,
      markAsRead,
      clearNotifications,
    }),
    [notifications, unreadCount, markAllAsRead, markAsRead, clearNotifications]
  );

  return (
    <NotificationCenterContext.Provider value={contextValue}>
      {children}
    </NotificationCenterContext.Provider>
  );
};

export default RealtimeProvider;


