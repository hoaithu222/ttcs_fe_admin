import React, { useEffect, useState, useMemo } from "react";
import clsx from "clsx";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Search, MoreVertical } from "lucide-react";
import * as Form from "@radix-ui/react-form";
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
import Input from "@/foundation/components/input/Input";
import Tabs from "@/foundation/components/navigation/tabs/Tab";
import Popover from "@/foundation/components/popover/Popever";
import type { ChatConversation } from "@/core/api/chat/type";
import ScrollView from "@/foundation/components/scroll/ScrollView";

type FilterTab = "all" | "unread";
type SortOption = "time" | "name";

const ConversationsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const conversations = useAppSelector(selectConversations);
  const currentConversation = useAppSelector(selectCurrentConversation);
  const status = useAppSelector(selectChatStatus);
  const user = useAppSelector(selectUser);
  const currentUserId = user?._id;

  // Filter states
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("time");
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  useEffect(() => {
    dispatch(getConversationsStart({ query: { page: 1, limit: 50 } }));
  }, [dispatch]);

  const handleSelectConversation = (conversation: ChatConversation) => {
    dispatch(setCurrentConversation(conversation));
  };

  const getOtherParticipant = (conversation: ChatConversation) => {
    if (!conversation?.participants || conversation.participants.length === 0) {
      return null;
    }
    if (!currentUserId) return conversation.participants[0];
    return conversation.participants.find((p) => p.userId !== currentUserId) || conversation.participants[0];
  };

  // Helper function to truncate text to ~30 characters
  const truncateText = (text: string | undefined | null, maxLength: number = 30): string => {
    if (!text || typeof text !== 'string') return text || "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
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

  // Filter and sort conversations
  const filteredAndSortedConversations = useMemo(() => {
    let filtered = [...conversations];

    // Filter by tab (all/unread)
    if (activeTab === "unread") {
      filtered = filtered.filter((conv: ChatConversation) => (conv.unreadCount || 0) > 0);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((conv: ChatConversation) => {
        const otherParticipant = getOtherParticipant(conv);
        const name = (otherParticipant?.name || "").toLowerCase();
        return name.includes(query);
      });
    }

    // Sort conversations
    filtered = filtered.sort((a: ChatConversation, b: ChatConversation) => {
      if (sortBy === "name") {
        const nameA = (getOtherParticipant(a)?.name || "").toLowerCase();
        const nameB = (getOtherParticipant(b)?.name || "").toLowerCase();
        return nameA.localeCompare(nameB, "vi");
      } else {
        // Sort by time (most recent first)
        const timeA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
        const timeB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
        return timeB - timeA;
      }
    });

    return filtered;
  }, [conversations, activeTab, searchQuery, sortBy, currentUserId]);

  // Render header section
  const renderHeader = () => (
    <div className="bg-background-base border-b border-neutral-3">
      <Form.Root>
        <div className="px-4 pt-4 pb-3">
         

          {/* Search Input */}
          <div className="mb-3">
            <Input
              name="search"
              placeholder="Tìm kiếm theo tên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              iconLeft={<Search className="w-4 h-4 text-neutral-6" />}
              sizeInput="full"
              textSize="small"
              className="bg-background-1"
              inputCustomClass="border-neutral-3 focus:border-primary-6"
            />
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-2">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FilterTab)} className="flex-1">
              <Tabs.List variant="solid" fullWidth className="bg-background-1">
                <Tabs.Trigger value="all" className="text-sm font-medium">
                  Tất cả
                </Tabs.Trigger>
                <Tabs.Trigger value="unread" className="text-sm font-medium">
                  Chưa đọc
                </Tabs.Trigger>
              </Tabs.List>
            </Tabs>

            <Popover
              open={isSortMenuOpen}
              onOpenChange={setIsSortMenuOpen}
              side="bottom"
              align="end"
              contentClassName="bg-background-1 border border-neutral-3 rounded-lg shadow-lg p-1 min-w-[160px]"
              content={
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSortBy("time");
                      setIsSortMenuOpen(false);
                    }}
                    className={clsx(
                      "w-full text-left px-3 py-2 text-sm transition-colors rounded-md",
                      sortBy === "time"
                        ? "bg-background-1 text-primary-9 font-medium"
                        : "text-neutral-10 hover:bg-background-2"
                    )}
                  >
                    Theo thời gian
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSortBy("name");
                      setIsSortMenuOpen(false);
                    }}
                    className={clsx(
                      "w-full text-left px-3 py-2 text-sm transition-colors rounded-md",
                      sortBy === "name"
                        ? "bg-primary-1 text-primary-9 font-medium"
                        : "text-neutral-10 hover:bg-background-2"
                    )}
                  >
                    Theo tên
                  </button>
                </div>
              }
            >
              <button
                type="button"
                className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-background-2 transition-colors text-neutral-7 hover:text-neutral-10"
                aria-label="Sắp xếp"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </Popover>
          </div>
        </div>
      </Form.Root>
    </div>
  );

  // Render conversation item
  const renderConversationItem = (conversation: ChatConversation) => {
    // Always use conversation from list, not currentConversation, to ensure participants are preserved
    const conversationToUse =
      conversations.find((c: ChatConversation) => c._id === conversation._id) ||
      conversation;

    const otherParticipant = getOtherParticipant(conversationToUse);
    const isActive = currentConversation?._id === conversation._id;
    const hasUnread = (conversation.unreadCount || 0) > 0;
    
    // Get avatar with fallback - ensure it's always available
    // Use conversation participants directly to avoid stale data
    const participantAvatar = otherParticipant?.avatar;
    const avatar = participantAvatar && typeof participantAvatar === 'string' && participantAvatar.trim() ? participantAvatar : null;
    const displayName = otherParticipant?.name || "Người dùng";

    // DEBUG LOG: theo dõi data avatar / participants cho từng conversation
    console.log("[Admin Chat][ConversationsList] render item", {
      conversationId: conversation._id,
      isActive,
      participantsFromStore: conversationToUse.participants,
      otherParticipant,
      avatarFromParticipant: participantAvatar,
      avatarUsed: avatar,
    });

    return (
      <div
        key={conversation._id}
        onClick={() => handleSelectConversation(conversation)}
        className={clsx(
          "flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200",
          "border-b border-neutral-2",
          isActive
            ? "bg-background-1 border-l-4 border-primary-6 shadow-sm"
            : "hover:bg-background-2 active:bg-background-1"
        )}
      >
        <div className="flex-shrink-0 relative">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-neutral-3 flex items-center justify-center shadow-sm">
            {avatar ? (
              <Image
                src={avatar}
                alt={displayName}
                rounded
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to initial if image fails to load
                  const target = e.target as HTMLImageElement;
                  if (target.parentElement) {
                    target.style.display = 'none';
                  }
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-6 to-primary-7 text-neutral-1 flex items-center justify-center text-base font-bold">
                {displayName[0].toUpperCase()}
              </div>
            )}
          </div>
          {hasUnread && (
            <div className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-error rounded-full flex items-center justify-center text-xs text-white font-bold shadow-md">
              {(conversation.unreadCount || 0) > 9 ? "9+" : conversation.unreadCount}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <h3 className={clsx(
              "text-sm text-left",
              isActive ? "text-primary-9 font-bold" : "text-neutral-10 font-semibold",
              hasUnread && !isActive && "font-bold"
            )}>
              {truncateText(otherParticipant?.name || "Người dùng")}
            </h3>
            {conversation.lastMessage && (
              <span className="text-xs text-neutral-6 flex-shrink-0 ml-2 font-medium">
                {formatLastMessageTime(conversation.lastMessage.createdAt)}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            {(() => {
              const lastMessage = conversation.lastMessage;
              const hasText = lastMessage?.message && typeof lastMessage.message === 'string' && lastMessage.message.trim();
              const hasImageAttachments = lastMessage?.attachments && lastMessage.attachments.some(att => att.type?.startsWith("image/"));
              const firstImage = lastMessage?.attachments?.find(att => att.type?.startsWith("image/"));
              
              // If only images (no text), show image preview
              if (!hasText && hasImageAttachments && firstImage) {
                return (
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden border border-neutral-3">
                      <Image
                        src={firstImage.url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className={clsx(
                      "text-sm truncate",
                      isActive ? "text-neutral-8" : "text-neutral-7",
                      hasUnread && !isActive && "font-medium text-neutral-9"
                    )}>
                      📷 Ảnh
                    </span>
                  </div>
                );
              }
              
              // If has text or no message, show text
              return (
                <p className={clsx(
                  "text-sm text-left",
                  isActive ? "text-neutral-8" : "text-neutral-7",
                  hasUnread && !isActive && "font-medium text-neutral-9"
                )}>
                  {hasText ? truncateText(lastMessage.message) : "Chưa có tin nhắn"}
                </p>
              );
            })()}
          </div>
        </div>
      </div>
    );
  };

  if (status === "LOADING") {
    return (
      <div className="flex flex-col h-full min-h-[calc(100vh-65px)] bg-background-1">
        {renderHeader()}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (filteredAndSortedConversations.length === 0) {
    return (
      <div className="flex flex-col h-full min-h-[calc(100vh-65px)] bg-background-1">
        {renderHeader()}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <Empty
            variant="mail"
            title={
              searchQuery.trim()
                ? "Không tìm thấy cuộc trò chuyện nào"
                : activeTab === "unread"
                ? "Không có tin nhắn chưa đọc"
                : "Chưa có cuộc trò chuyện nào"
            }
            description={
              searchQuery.trim()
                ? "Thử tìm kiếm với từ khóa khác"
                : "Bắt đầu cuộc trò chuyện mới để nhắn tin"
            }
            size="small"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-65px)] bg-background-1">
      {renderHeader()}

      <ScrollView className="flex-1 min-h-0 overflow-y-auto">
        {filteredAndSortedConversations.map((conversation: ChatConversation) =>
          renderConversationItem(conversation)
        )}
      </ScrollView>
    </div>
  );
};

export default ConversationsList;

