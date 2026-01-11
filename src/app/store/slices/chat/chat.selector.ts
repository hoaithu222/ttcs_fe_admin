import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/app/store";

const selectChatState = (state: RootState) => (state as any).chat;

export const selectConversations = createSelector(
  [selectChatState],
  (chatState) => chatState?.conversations || []
);

export const selectCurrentConversation = createSelector(
  [selectChatState],
  (chatState) => chatState?.currentConversation || null
);

export const selectChatMessages = (conversationId: string) =>
  createSelector([selectChatState], (chatState) => {
    // Normalize conversationId to string for consistent lookup
    const normalizedConversationId = String(conversationId);
    
    console.log("[Chat Selector] selectChatMessages called:", {
      originalConversationId: conversationId,
      normalizedConversationId,
      availableKeys: chatState?.messages ? Object.keys(chatState.messages) : [],
    });
    
    // Get messages directly - should work since we normalize everywhere
    let messages = chatState?.messages?.[normalizedConversationId] || [];
    
    console.log("[Chat Selector] Direct lookup result:", {
      normalizedConversationId,
      messagesCount: messages.length,
      messages: messages.map((m: any) => ({ id: m._id, text: m.message?.substring(0, 20) })),
    });
    
    // Fallback: search all message keys if direct lookup fails (handles ObjectId vs string mismatch)
    // This ensures we find messages even if stored with different key format
    if (messages.length === 0 && chatState?.messages) {
      const allKeys = Object.keys(chatState.messages);
      console.log("[Chat Selector] Direct lookup failed, trying fallback:", {
        normalizedConversationId,
        allKeys,
      });
      for (const key of allKeys) {
        if (String(key) === normalizedConversationId) {
          messages = chatState.messages[key] || [];
          console.log("[Chat Selector] Found messages with fallback:", {
            matchedKey: key,
            messagesCount: messages.length,
          });
          break;
        }
      }
    }
    
    // Remove duplicates by _id first
    const uniqueById = Array.from(
      new Map(messages.map((msg: any) => [msg._id, msg])).values()
    );
    
    // Remove duplicates by content, senderId, and timestamp (within 1 second)
    const uniqueMessages: any[] = [];
    const seen = new Set<string>();
    
    uniqueById.forEach((msg: any) => {
      const key = `${msg.message}|${msg.senderId}|${new Date(msg.createdAt).getTime()}`;
      const timestamp = new Date(msg.createdAt).getTime();
      
      // Check if we've seen a similar message
      let isDuplicate = false;
      for (const seenKey of seen) {
        const [seenMsg, seenSender, seenTime] = seenKey.split('|');
        const timeDiff = Math.abs(timestamp - parseInt(seenTime));
        if (seenMsg === msg.message && seenSender === msg.senderId && timeDiff < 1000) {
          isDuplicate = true;
          break;
        }
      }
      
      if (!isDuplicate) {
        seen.add(key);
        uniqueMessages.push(msg);
      }
    });
    
    // Sort messages by createdAt (oldest first)
    return uniqueMessages.sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateA - dateB;
    });
  });

export const selectChatPagination = createSelector(
  [selectChatState],
  (chatState) => chatState?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  }
);

export const selectChatStatus = createSelector(
  [selectChatState],
  (chatState) => chatState?.status || "INIT"
);

export const selectChatError = createSelector(
  [selectChatState],
  (chatState) => chatState?.error || null
);

export const selectUnreadConversations = createSelector(
  [selectConversations],
  (conversations) => conversations.filter((c: any) => (c.unreadCount || 0) > 0)
);

export const selectTotalUnreadCount = createSelector(
  [selectConversations],
  (conversations) =>
    conversations.reduce((sum: number, c: any) => sum + (c.unreadCount || 0), 0)
);

export const selectTypingUsers = (conversationId: string) =>
  createSelector([selectChatState], (chatState) => {
    return chatState?.typing?.[conversationId] || [];
  });

export const selectOnlineUsers = (conversationId: string) =>
  createSelector([selectChatState], (chatState) => {
    return chatState?.onlineUsers?.[conversationId] || [];
  });

