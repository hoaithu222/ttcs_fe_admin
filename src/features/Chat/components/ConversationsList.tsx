import React, { useEffect } from "react";
import clsx from "clsx";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useAppDispatch, useAppSelector } from "@/app/store";
import {
  selectConversations,
  selectCurrentConversation,
  selectChatStatus,
} from "@/app/store/slices/chat/chat.selector";
import { selectUser } from "@/features/Auth/components/slice/auth.selector";
import { getConversationsStart, setCurrentConversation } from "@/app/store/slices/chat/chat.slice";
import Image from "@/foundation/components/icons/Image";
import Spinner from "@/foundation/components/feedback/Spinner";
import Empty from "@/foundation/components/empty/Empty";
import type { ChatConversation } from "@/core/api/chat/type";

const ConversationsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const conversations = useAppSelector(selectConversations);
  const currentConversation = useAppSelector(selectCurrentConversation);
  const status = useAppSelector(selectChatStatus);
  const user = useAppSelector(selectUser);
  const currentUserId = user?._id;

  useEffect(() => {
    dispatch(getConversationsStart({ query: { page: 1, limit: 50 } }));
  }, [dispatch]);

  const handleSelectConversation = (conversation: ChatConversation) => {
    dispatch(setCurrentConversation(conversation));
  };

  const getOtherParticipant = (conversation: ChatConversation) => {
    if (!currentUserId) return conversation.participants[0];
    return conversation.participants.find((p) => p.userId !== currentUserId) || conversation.participants[0];
  };

  const formatLastMessageTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const isToday = date.toDateString() === new Date().toDateString();
    const isYesterday = date.toDateString() === new Date(Date.now() - 86400000).toDateString();

    if (isToday) return format(date, "HH:mm", { locale: vi });
    if (isYesterday) return "Hôm qua";
    return format(date, "dd/MM/yyyy", { locale: vi });
  };

  if (status === "LOADING") {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <Empty
        variant="mail"
        title="Chưa có cuộc trò chuyện"
        description="Bắt đầu cuộc trò chuyện mới để nhắn tin"
        size="small"
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-background-1">
      <div className="p-4 border-b border-neutral-3">
        <h2 className="text-lg font-semibold text-neutral-10">Tin nhắn</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation: ChatConversation) => {
          const otherParticipant = getOtherParticipant(conversation);
          const isActive = currentConversation?._id === conversation._id;

          return (
            <div
              key={conversation._id}
              onClick={() => handleSelectConversation(conversation)}
              className={clsx(
                "flex items-center gap-3 p-4 cursor-pointer transition-colors border-b border-neutral-2",
                isActive ? "bg-background-2" : "hover:bg-background-1"
              )}
            >
              <div className="flex-shrink-0 relative">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-3 flex items-center justify-center">
                  {otherParticipant?.avatar ? (
                    <Image
                      src={otherParticipant.avatar}
                      alt={otherParticipant.name || "User"}
                      rounded
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary-6 text-neutral-1 flex items-center justify-center text-sm font-semibold">
                      {(otherParticipant?.name || "U")[0].toUpperCase()}
                    </div>
                  )}
                </div>
                {conversation.unreadCount && conversation.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-error rounded-full flex items-center justify-center text-xs text-white font-semibold">
                    {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-neutral-10 truncate">
                    {otherParticipant?.name || "Người dùng"}
                  </h3>
                  {conversation.lastMessage && (
                    <span className="text-xs text-neutral-6 flex-shrink-0 ml-2">
                      {formatLastMessageTime(conversation.lastMessage.createdAt)}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-neutral-7 truncate">
                    {conversation.lastMessage?.message || "Chưa có tin nhắn"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConversationsList;

