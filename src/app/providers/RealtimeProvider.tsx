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
import { useAppDispatch, useAppSelector } from "@/app/store";
import { updateNotificationFromSocket } from "@/app/store/slices/notification/notification.slice";
import { updateMessageFromSocket, updateConversationFromSocket } from "@/app/store/slices/chat/chat.slice";
import { selectConversations } from "@/app/store/slices/chat/chat.selector";

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
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => (state as any).auth.user);
  const conversations = useAppSelector(selectConversations);
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

    const socket = socketClients.notifications.connect();

    const handleNotification = (payload: Record<string, any>) => {
      addNotification(payload);
      
      // Update notification in Redux store
      dispatch(
        updateNotificationFromSocket({
          notification: {
            _id: payload.notificationId || payload.id || generateNotificationId(),
            userId: authUser?._id || "",
            title: payload.title || "",
            message: payload.content || payload.title || "",
            type: payload.type || "system",
            isRead: false,
            data: payload.metadata || {},
            actionUrl: payload.actionUrl,
            createdAt: payload.createdAt || new Date().toISOString(),
          },
          notificationId: payload.notificationId || payload.id,
        })
      );

      const message =
        payload?.content ||
        payload?.title ||
        "Bạn vừa nhận được một thông báo mới";
      toastUtils.info(message);
    };

    socket.on(SOCKET_EVENTS.NOTIFICATION_SEND, handleNotification);

    return () => {
      socket.off(SOCKET_EVENTS.NOTIFICATION_SEND, handleNotification);
      socketClients.notifications.disconnect(true);
    };
  }, [addNotification, hasTokens, dispatch, authUser]);

  // Handle chat socket events
  useEffect(() => {
    if (!hasTokens) {
      socketClients.shopChat?.disconnect(true);
      socketClients.adminChat?.disconnect(true);
      socketClients.aiChat?.disconnect(true);
      return;
    }

    // Define handlers at higher scope for cleanup
    let handleShopChatMessage: ((payload: Record<string, any>) => void) | undefined;
    let handleShopConversationUpdate: ((payload: Record<string, any>) => void) | undefined;
    let handleAdminChatMessage: ((payload: Record<string, any>) => void) | undefined;
    let handleAdminConversationUpdate: ((payload: Record<string, any>) => void) | undefined;

    // Handle shop chat messages (admin can receive shop chat messages)
    const shopChatSocket = socketClients.shopChat?.connect();
    if (shopChatSocket) {
      handleShopChatMessage = (payload: Record<string, any>) => {
        console.log("[Shop Chat] Raw socket event received:", {
          payload,
          conversationId: payload?.conversationId,
          hasMessage: !!payload?.message,
          messageId: payload?._id || payload?.messageId,
        });
        
        // Handle both old format (flat) and new format (nested message object)
        let messageData = payload.message;
        if (!messageData && payload.conversationId) {
          // Old format: message fields are at root level
          messageData = {
            _id: payload._id || payload.messageId,
            conversationId: payload.conversationId,
            senderId: payload.senderId,
            senderName: payload.senderName,
            senderAvatar: payload.senderAvatar,
            message: payload.message || payload.messageText,
            attachments: payload.attachments,
            metadata: payload.metadata,
            isRead: payload.isRead || false,
            isDelivered: payload.isDelivered || false,
            createdAt: payload.createdAt || payload.sentAt,
          };
        }

        if (payload?.conversationId && messageData) {
          // Try to get senderAvatar from conversation participants if missing
          let senderAvatar = messageData.senderAvatar || payload.senderAvatar;
          if (!senderAvatar && payload.conversationId) {
            const normalizedConvId = String(payload.conversationId);
            const conversation = conversations.find(
              (c: any) => String(c._id) === normalizedConvId
            );
            if (conversation) {
              const senderId = messageData.senderId || payload.senderId;
              const senderParticipant = conversation.participants.find(
                (p: { userId: string }) => p.userId === senderId
              );
              if (senderParticipant?.avatar) {
                senderAvatar = senderParticipant.avatar;
              }
            }
          }

          // Normalize conversationId to ensure consistency with store
          const normalizedConversationId = String(payload.conversationId);
          
          console.log("[Shop Chat] Received message from socket:", {
            originalConversationId: payload.conversationId,
            normalizedConversationId,
            messageId: messageData._id || payload.messageId || payload._id,
            senderId: messageData.senderId || payload.senderId,
            messageText: messageData.message || payload.message || "",
          });
          
          const message = {
            _id: messageData._id || payload.messageId || payload._id || generateNotificationId(),
            conversationId: normalizedConversationId,
            senderId: messageData.senderId || payload.senderId || "",
            senderName: messageData.senderName || payload.senderName,
            senderAvatar: senderAvatar,
            message: messageData.message || payload.message || "",
            attachments: messageData.attachments || payload.attachments || [],
            metadata: messageData.metadata || payload.metadata || {},
            isRead: messageData.isRead || payload.isRead || false,
            isDelivered: messageData.isDelivered || payload.isDelivered || false,
            createdAt: messageData.createdAt || payload.sentAt || payload.createdAt || new Date().toISOString(),
          };

          console.log("[Shop Chat] Dispatching updateMessageFromSocket:", {
            conversationId: normalizedConversationId,
            messageId: message._id,
            messageText: message.message,
          });

          dispatch(
            updateMessageFromSocket({
              conversationId: normalizedConversationId,
              message,
              isSender: message.senderId === authUser?._id,
            })
          );

          // Update conversation if provided
          if (payload.conversation) {
            dispatch(
              updateConversationFromSocket({
                conversation: payload.conversation,
              })
            );
          }
        }
      };

      handleShopConversationUpdate = (payload: Record<string, any>) => {
        const conversationId = payload?.conversationId || payload?.conversation?._id;
        const lastMessage = payload?.conversation?.lastMessage || payload?.lastMessage;
        const rootMessage = payload?.message;
        
        console.log("[Shop Chat] Conversation update received:", {
          payload,
          hasConversation: !!payload?.conversation,
          hasMessage: !!rootMessage,
          hasLastMessage: !!lastMessage,
          conversationId,
          lastMessage,
          messageInPayload: rootMessage,
        });
        
        // Check if message is in the payload root (not nested in conversation)
        if (rootMessage && conversationId && handleShopChatMessage) {
          console.log("[Shop Chat] Found message in root payload, dispatching updateMessageFromSocket");
          handleShopChatMessage(payload);
        }
        // Check if message is in conversation.lastMessage
        else if (lastMessage && conversationId && handleShopChatMessage) {
          console.log("[Shop Chat] Found message in conversation.lastMessage, dispatching updateMessageFromSocket");
          // Create a payload-like object with message at root level for handleShopChatMessage
          handleShopChatMessage({
            ...payload,
            message: lastMessage,
            conversationId,
          });
        }
        
        if (payload?.conversation) {
          dispatch(
            updateConversationFromSocket({
              conversation: payload.conversation,
            })
          );
        } else if (payload?.conversationId) {
          console.warn("[Shop Chat] Conversation update without conversation object:", payload);
        }
      };

      console.log("[Shop Chat] Setting up socket listeners");
      shopChatSocket.on(SOCKET_EVENTS.CHAT_MESSAGE_RECEIVE, handleShopChatMessage);
      shopChatSocket.on(SOCKET_EVENTS.CHAT_CONVERSATION_JOIN, handleShopConversationUpdate);
      
      // Debug: listen to all events
      shopChatSocket.onAny((eventName, ...args) => {
        if (eventName.includes('message') || eventName.includes('chat')) {
          const firstArg = args[0] || {};
          console.log("[Shop Chat] Any socket event:", { 
            eventName, 
            argsCount: args.length,
            firstArg,
            hasMessage: !!firstArg?.message,
            hasLastMessage: !!firstArg?.conversation?.lastMessage,
            lastMessage: firstArg?.conversation?.lastMessage,
          });
        }
      });
    }

    // Handle admin chat messages
    const adminChatSocket = socketClients.adminChat?.connect();
    if (adminChatSocket) {
      handleAdminChatMessage = (payload: Record<string, any>) => {
        console.log("[Admin Chat] Raw socket event received:", {
          payload,
          conversationId: payload?.conversationId,
          hasMessage: !!payload?.message,
          messageId: payload?._id || payload?.messageId,
        });
        
        // Handle both old format (flat) and new format (nested message object)
        let messageData = payload.message;
        if (!messageData && payload.conversationId) {
          // Old format: message fields are at root level
          messageData = {
            _id: payload._id || payload.messageId,
            conversationId: payload.conversationId,
            senderId: payload.senderId,
            senderName: payload.senderName,
            senderAvatar: payload.senderAvatar,
            message: payload.message || payload.messageText,
            attachments: payload.attachments,
            metadata: payload.metadata,
            isRead: payload.isRead || false,
            isDelivered: payload.isDelivered || false,
            createdAt: payload.createdAt || payload.sentAt,
          };
        }

        if (payload?.conversationId && messageData) {
          // Try to get senderAvatar from conversation participants if missing
          let senderAvatar = messageData.senderAvatar || payload.senderAvatar;
          if (!senderAvatar && payload.conversationId) {
            const normalizedConvId = String(payload.conversationId);
            const conversation = conversations.find(
              (c: any) => String(c._id) === normalizedConvId
            );
            if (conversation) {
              const senderId = messageData.senderId || payload.senderId;
              const senderParticipant = conversation.participants.find(
                (p: { userId: string }) => p.userId === senderId
              );
              if (senderParticipant?.avatar) {
                senderAvatar = senderParticipant.avatar;
              }
            }
          }

          // Normalize conversationId to ensure consistency with store
          const normalizedConversationId = String(payload.conversationId);
          
          console.log("[Admin Chat] Received message from socket:", {
            originalConversationId: payload.conversationId,
            normalizedConversationId,
            messageId: messageData._id || payload.messageId || payload._id,
            senderId: messageData.senderId || payload.senderId,
            messageText: messageData.message || payload.message || "",
          });
          
          const message = {
            _id: messageData._id || payload.messageId || payload._id || generateNotificationId(),
            conversationId: normalizedConversationId,
            senderId: messageData.senderId || payload.senderId || "",
            senderName: messageData.senderName || payload.senderName,
            senderAvatar: senderAvatar,
            message: messageData.message || payload.message || "",
            attachments: messageData.attachments || payload.attachments || [],
            metadata: messageData.metadata || payload.metadata || {},
            isRead: messageData.isRead || payload.isRead || false,
            isDelivered: messageData.isDelivered || payload.isDelivered || false,
            createdAt: messageData.createdAt || payload.sentAt || payload.createdAt || new Date().toISOString(),
          };

          console.log("[Admin Chat] Dispatching updateMessageFromSocket:", {
            conversationId: normalizedConversationId,
            messageId: message._id,
            messageText: message.message,
          });

          dispatch(
            updateMessageFromSocket({
              conversationId: normalizedConversationId,
              message,
              isSender: message.senderId === authUser?._id,
            })
          );

          // Update conversation if provided
          if (payload.conversation) {
            dispatch(
              updateConversationFromSocket({
                conversation: payload.conversation,
              })
            );
          }
        }
      };

      handleAdminConversationUpdate = (payload: Record<string, any>) => {
        const conversationId = payload?.conversationId || payload?.conversation?._id;
        const lastMessage = payload?.conversation?.lastMessage || payload?.lastMessage;
        const rootMessage = payload?.message;
        
        console.log("[Admin Chat] Conversation update received:", {
          payload,
          hasConversation: !!payload?.conversation,
          hasMessage: !!rootMessage,
          hasLastMessage: !!lastMessage,
          conversationId,
          lastMessage,
          messageInPayload: rootMessage,
        });
        
        // Check if message is in the payload root (not nested in conversation)
        if (rootMessage && conversationId && handleAdminChatMessage) {
          console.log("[Admin Chat] Found message in root payload, dispatching updateMessageFromSocket");
          handleAdminChatMessage(payload);
        }
        // Check if message is in conversation.lastMessage
        else if (lastMessage && conversationId && handleAdminChatMessage) {
          console.log("[Admin Chat] Found message in conversation.lastMessage, dispatching updateMessageFromSocket");
          // Create a payload-like object with message at root level for handleAdminChatMessage
          handleAdminChatMessage({
            ...payload,
            message: lastMessage,
            conversationId,
          });
        }
        
        if (payload?.conversation) {
          dispatch(
            updateConversationFromSocket({
              conversation: payload.conversation,
            })
          );
        } else if (payload?.conversationId) {
          // If only conversationId is provided, we might need to fetch it
          // But for now, just log it
          console.warn("[Admin Chat] Conversation update without conversation object:", payload);
        }
      };

      console.log("[Admin Chat] Setting up socket listeners");
      adminChatSocket.on(SOCKET_EVENTS.CHAT_MESSAGE_RECEIVE, handleAdminChatMessage);
      adminChatSocket.on(SOCKET_EVENTS.CHAT_CONVERSATION_JOIN, handleAdminConversationUpdate);
      
      // Debug: listen to all events
      adminChatSocket.onAny((eventName, ...args) => {
        if (eventName.includes('message') || eventName.includes('chat')) {
          const firstArg = args[0] || {};
          console.log("[Admin Chat] Any socket event:", { 
            eventName, 
            argsCount: args.length,
            firstArg,
            hasMessage: !!firstArg?.message,
            hasLastMessage: !!firstArg?.conversation?.lastMessage,
            lastMessage: firstArg?.conversation?.lastMessage,
          });
        }
      });
    }

    return () => {
      if (shopChatSocket && handleShopChatMessage && handleShopConversationUpdate) {
        shopChatSocket.off(SOCKET_EVENTS.CHAT_MESSAGE_RECEIVE, handleShopChatMessage);
        shopChatSocket.off(SOCKET_EVENTS.CHAT_CONVERSATION_JOIN, handleShopConversationUpdate);
        socketClients.shopChat?.disconnect(true);
      }
      if (adminChatSocket && handleAdminChatMessage && handleAdminConversationUpdate) {
        adminChatSocket.off(SOCKET_EVENTS.CHAT_MESSAGE_RECEIVE, handleAdminChatMessage);
        adminChatSocket.off(SOCKET_EVENTS.CHAT_CONVERSATION_JOIN, handleAdminConversationUpdate);
        socketClients.adminChat?.disconnect(true);
      }
    };
  }, [hasTokens, dispatch, authUser, conversations]);

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


