import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  selectCurrentConversation,
  selectChatMessages,
  selectChatStatus,
  selectTypingUsers,
  selectOnlineUsers,
  selectConversations,
} from "@/app/store/slices/chat/chat.selector";
import { selectUser } from "@/features/Auth/components/slice/auth.selector";
import {
  getMessagesStart,
  markAsReadStart,
  setCurrentConversation,
  setTyping,
  addOnlineUser,
  removeOnlineUser,
} from "@/app/store/slices/chat/chat.slice";
import { socketClients, SOCKET_EVENTS } from "@/core/socket";
import ScrollView from "@/foundation/components/scroll/ScrollView";
import Spinner from "@/foundation/components/feedback/Spinner";
import Empty from "@/foundation/components/empty/Empty";
import MessageItem from "./MessageItem";
import type { ChatMessage } from "@/core/api/chat/type";
import { CallComponent } from "./CallComponent";

const ChatWindow: React.FC = () => {
  const [showCall, setShowCall] = useState(false);
  const [callType, setCallType] = useState<"voice" | "video" | null>(null);
  const dispatch = useAppDispatch();
  const currentConversation = useAppSelector(selectCurrentConversation);
  const conversations = useAppSelector(selectConversations);
  const messages = useAppSelector((state) => {
    if (!currentConversation) return [];
    const result = selectChatMessages(currentConversation._id)(state);
    console.log("[ChatWindow] Messages selector result:", {
      conversationId: currentConversation._id,
      messagesCount: result.length,
      messageIds: result.map((m: any) => m._id),
      last5Messages: result.slice(-5).map((m: any) => ({ 
        id: m._id, 
        text: m.message?.substring(0, 30),
        createdAt: m.createdAt,
        senderId: m.senderId,
      })),
    });
    return result;
  });
  const status = useAppSelector(selectChatStatus);
  const user = useAppSelector(selectUser);
  const currentUserId = user?._id;
  const typingUsers = useAppSelector((state) =>
    currentConversation ? selectTypingUsers(currentConversation._id)(state) : []
  );
  const onlineUsers = useAppSelector((state) =>
    currentConversation ? selectOnlineUsers(currentConversation._id)(state) : []
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);
  const typingUsersRef = useRef<string[]>([]);

  useEffect(() => {
    typingUsersRef.current = typingUsers;
  }, [typingUsers]);

  useEffect(() => {
    if (!currentConversation) {
      return;
    }

    const conversationId = String(currentConversation._id);
    dispatch(
      getMessagesStart({
        conversationId,
        query: { page: 1, limit: 50 },
      })
    );

    // Join conversation room to receive real-time messages
    const channel = (currentConversation.channel as "admin" | "shop" | "ai") || "admin";
    let socketClient;

    switch (channel) {
      case "admin":
        socketClient = socketClients.adminChat;
        break;
      case "shop":
        socketClient = socketClients.shopChat;
        break;
      case "ai":
        socketClient = socketClients.aiChat;
        break;
      default:
        socketClient = socketClients.adminChat;
    }

    if (socketClient) {
      const socket = socketClient.connect();
      socketRef.current = socket;
      if (socket && socket.connected) {
        console.log("[ChatWindow] Joining conversation room:", {
          conversationId,
          channel,
          socketId: socket.id,
          socketConnected: socket.connected,
        });
        
        socket.emit(SOCKET_EVENTS.CHAT_CONVERSATION_JOIN, {
          conversationId,
        });
        
        // Listen for ALL socket events for debugging
        socket.onAny((eventName, ...args) => {
          if (eventName === SOCKET_EVENTS.CHAT_MESSAGE_RECEIVE) {
            console.log("[ChatWindow] Socket event received in ChatWindow:", {
              eventName,
              conversationId,
              payload: args[0],
            });
          }
        });

        // Listen for typing events
        socket.on(SOCKET_EVENTS.CHAT_TYPING, (payload: any) => {
          if (payload?.conversationId === conversationId && payload?.userId !== currentUserId) {
            dispatch(
              setTyping({
                conversationId: payload.conversationId,
                userId: payload.userId,
                isTyping: payload.isTyping !== false,
              })
            );

            // Auto clear typing after 3 seconds
            if (payload.isTyping !== false) {
              setTimeout(() => {
                dispatch(
                  setTyping({
                    conversationId: payload.conversationId,
                    userId: payload.userId,
                    isTyping: false,
                  })
                );
              }, 3000);
            }
          }
        });

        // Track online users (when user joins conversation, they're online)
        const otherParticipant = currentConversation.participants.find(
          (p: { userId: string }) => p.userId !== currentUserId
        );
        if (otherParticipant) {
          dispatch(
            addOnlineUser({
              conversationId,
              userId: otherParticipant.userId,
            })
          );
        }
      }
    }

    return () => {
      // Leave socket room and cleanup transient state
      if (socketRef.current) {
        socketRef.current.emit(SOCKET_EVENTS.CHAT_CONVERSATION_LEAVE, {
          conversationId,
        });
        socketRef.current.off(SOCKET_EVENTS.CHAT_TYPING);
      }

      typingUsersRef.current.forEach((userId) => {
        dispatch(
          setTyping({
            conversationId,
            userId,
            isTyping: false,
          })
        );
      });

      currentConversation.participants.forEach((participant: { userId: string }) => {
        dispatch(
          removeOnlineUser({
            conversationId,
            userId: participant.userId,
          })
        );
      });
    };
  }, [currentConversation?._id, currentConversation?.channel, currentUserId, dispatch]);

  // Mark as read only when ChatWindow is actually visible and messages are loaded
  useEffect(() => {
    if (
      currentConversation &&
      messages.length > 0 &&
      status !== "LOADING" // Only mark as read after messages are loaded
    ) {
      // Mark as read when viewing conversation (ChatWindow is mounted and visible)
      dispatch(markAsReadStart({ conversationId: currentConversation._id }));
    }
  }, [currentConversation?._id, messages.length, status, dispatch]);

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!currentConversation) {
    return (
      <div className="flex items-center justify-center h-full bg-neutral-1">
        <Empty
          variant="mail"
          title="Chọn cuộc trò chuyện"
          description="Chọn một cuộc trò chuyện từ danh sách để bắt đầu nhắn tin"
          size="medium"
        />
      </div>
    );
  }

  // Always get conversation from list to ensure participants are preserved
  const conversationToUse =
    conversations.find((c: any) => c._id === currentConversation._id) || currentConversation;

  const otherParticipant =
    conversationToUse.participants.find((p: { userId: string }) => p.userId !== currentUserId) ||
    conversationToUse.participants[0];

  const isOtherUserOnline = otherParticipant && onlineUsers.includes(otherParticipant.userId);
  const isOtherUserTyping = otherParticipant && typingUsers.includes(otherParticipant.userId);

  const handleClose = () => {
    dispatch(setCurrentConversation(null));
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-neutral-1">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 bg-background-2 border-b border-neutral-3 flex-shrink-0">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-3 flex items-center justify-center flex-shrink-0">
          {otherParticipant?.avatar ? (
            <img
              src={otherParticipant.avatar}
              alt={otherParticipant.name || "User"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-primary-6 text-background-1 flex items-center justify-center text-sm font-semibold">
              {(otherParticipant?.name || "U")[0].toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-start text-neutral-10 truncate">
            {otherParticipant?.name || "Người dùng"}
          </h3>
          {isOtherUserTyping ? (
            <p className="text-xs flex items-center gap-1 text-start text-primary-7 italic">
              <span className="animate-pulse">●</span>
              <span>Đang nhập...</span>
            </p>
          ) : isOtherUserOnline ? (
            <p className="text-xs flex items-center gap-1 text-start text-success">
              <span className="block w-2 h-2 bg-success rounded-full animate-pulse"></span>
              <span>Đang hoạt động</span>
            </p>
          ) : (
            <p className="text-xs text-neutral-6 text-start">Offline</p>
          )}
        </div>
        {/* <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => {
              setCallType("voice");
              setShowCall(true);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-neutral-2 text-neutral-7 hover:text-primary-7"
            aria-label="Gọi thoại"
            title="Gọi thoại"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setCallType("video");
              setShowCall(true);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-neutral-2 text-neutral-7 hover:text-primary-7"
            aria-label="Gọi video"
            title="Gọi video"
          >
            <Video className="w-4 h-4" />
          </button>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-neutral-2 flex-shrink-0"
            aria-label="Đóng cuộc trò chuyện"
          >
            <X className="w-4 h-4 text-neutral-7" />
          </button>
        </div> */}
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto w-full">
        {status === "LOADING" && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <Spinner size="lg" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <Empty
              variant="mail"
              title="Chưa có tin nhắn"
              description="Bắt đầu cuộc trò chuyện bằng cách gửi tin nhắn đầu tiên"
              size="small"
            />
          </div>
        ) : (
          <ScrollView scrollRef={scrollRef} className="h-full w-full">
            <div className="p-4 pb-6">
              {messages.map((message, index) => {
                const msg = message as ChatMessage;
                // Log last 3 messages to debug
                if (index >= messages.length - 3) {
                  console.log(`[ChatWindow] Rendering message ${index + 1}/${messages.length}:`, {
                    id: msg._id,
                    text: msg.message?.substring(0, 30),
                    senderId: msg.senderId,
                    createdAt: msg.createdAt,
                  });
                }
                return (
                  <MessageItem
                    key={msg._id}
                    message={msg}
                    isOwn={msg.senderId === currentUserId}
                    currentUserId={currentUserId}
                    conversation={currentConversation}
                  />
                );
              })}
              {isOtherUserTyping && (
                <div className="flex gap-3 mb-3">
                  {!otherParticipant || otherParticipant.userId === currentUserId ? null : (
                    <div className="flex-shrink-0">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-primary-5 to-primary-7 flex items-center justify-center shadow-sm">
                        {otherParticipant?.avatar ? (
                          <img
                            src={otherParticipant.avatar}
                            alt={otherParticipant.name || "User"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-primary-6 text-white flex items-center justify-center text-sm font-semibold">
                            {(otherParticipant?.name || "U")[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col max-w-[75%] sm:max-w-[65%]">
                    <div className="rounded-2xl px-4 py-2.5 bg-gradient-to-br from-background-2 to-background-1 text-neutral-10 rounded-bl-md border border-neutral-3">
                      <div className="flex gap-1">
                        <span
                          className="w-2 h-2 bg-neutral-6 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></span>
                        <span
                          className="w-2 h-2 bg-neutral-6 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></span>
                        <span
                          className="w-2 h-2 bg-neutral-6 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollView>
        )}
      </div>

      {/* Call Component */}
      {showCall && currentConversation && callType && (
        <CallComponent
          conversationId={currentConversation._id}
          channel={(currentConversation.channel as "admin" | "shop" | "ai") || "admin"}
          callType={callType}
          onCallEnd={() => {
            setShowCall(false);
            setCallType(null);
          }}
        />
      )}
    </div>
  );
};

export default ChatWindow;
