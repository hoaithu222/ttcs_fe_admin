import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReduxStateType } from "@/app/store/types";
import {
  ChatConversation,
  ChatMessage,
  ConversationListResponse,
  MessageListResponse,
} from "@/core/api/chat/type";
import { ChatState } from "./chat.type";

const initialState: ChatState = {
  conversations: [],
  currentConversation: null,
  messages: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  messagesPagination: {},
  lastQuery: undefined,
  status: ReduxStateType.INIT,
  error: null,
  message: null,
  getConversations: {
    status: ReduxStateType.INIT,
    error: null,
    message: null,
  },
  getMessages: {
    status: ReduxStateType.INIT,
    error: null,
    message: null,
  },
  sendMessage: {
    status: ReduxStateType.INIT,
    error: null,
    message: null,
  },
  markAsRead: {
    status: ReduxStateType.INIT,
    error: null,
    message: null,
  },
  typing: {}, // conversationId -> userIds who are typing
  onlineUsers: {}, // conversationId -> userIds who are online
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // Get Conversations
    getConversationsStart: (state, _action: PayloadAction<{ query?: any }>) => {
      state.getConversations.status = ReduxStateType.LOADING;
      state.getConversations.error = null;
      state.getConversations.message = null;
      if (_action.payload.query) {
        state.lastQuery = _action.payload.query;
      }
    },
    getConversationsSuccess: (
      state,
      action: PayloadAction<ConversationListResponse>
    ) => {
      state.getConversations.status = ReduxStateType.SUCCESS;
      
      // Update conversations while preserving unreadCount for currently viewing conversation
      const newConversations = action.payload.conversations;
      const currentlyViewingId = state.currentConversation?._id;
      
      state.conversations = newConversations.map((newConv) => {
        // If this is the currently viewing conversation, always set unreadCount to 0
        if (currentlyViewingId && newConv._id === currentlyViewingId) {
          return {
            ...newConv,
            unreadCount: 0, // Reset unread count when viewing
          };
        }
        // Otherwise, use unreadCount from backend (already calculated correctly)
        return newConv;
      });
      
      // Also update current conversation's unread count if it exists in the list
      if (currentlyViewingId) {
        const currentInList = state.conversations.find(
          (c) => c._id === currentlyViewingId
        );
        if (currentInList && state.currentConversation) {
          state.currentConversation = {
            ...currentInList,
            unreadCount: 0,
          };
        }
      }
      
      state.pagination = action.payload.pagination;
      state.getConversations.error = null;
      state.getConversations.message = null;
    },
    getConversationsFailure: (state, action: PayloadAction<string>) => {
      state.getConversations.status = ReduxStateType.ERROR;
      state.getConversations.error = action.payload;
      state.getConversations.message = action.payload;
      state.conversations = [];
    },

    // Set Current Conversation
    setCurrentConversation: (
      state,
      action: PayloadAction<ChatConversation | null>
    ) => {
      const newConversation = action.payload;
      
      // DON'T reset unread count of previous conversation when switching
      // The previous conversation's unread count should remain until user actually reads it
      
      // Set new current conversation and reset its unread count
      if (newConversation) {
        // Find conversation in list to get latest data
        const conversationIndex = state.conversations.findIndex(
          (c) => c._id === newConversation._id
        );
        
        // Use conversation from list if exists, otherwise use the one passed in
        const conversationToSet = conversationIndex !== -1 
          ? state.conversations[conversationIndex]
          : newConversation;
        
        // Set current conversation with unreadCount = 0 (user is viewing it)
        state.currentConversation = {
          ...conversationToSet,
          unreadCount: 0, // Reset unread count when viewing
        };
        
        // Also update in conversations list - set unreadCount to 0 for the one being viewed
        if (conversationIndex !== -1) {
          state.conversations[conversationIndex].unreadCount = 0;
        }
      } else {
        state.currentConversation = null;
      }
    },

    // Get Messages
    getMessagesStart: (
      state,
      _action: PayloadAction<{ conversationId: string; query?: any }>
    ) => {
      state.getMessages.status = ReduxStateType.LOADING;
      state.getMessages.error = null;
      state.getMessages.message = null;
    },
    getMessagesSuccess: (
      state,
      action: PayloadAction<{
        conversationId: string;
        response: MessageListResponse;
      }>
    ) => {
      state.getMessages.status = ReduxStateType.SUCCESS;
      const { conversationId, response } = action.payload;
      // Remove duplicates and sort messages
      const uniqueMessages = Array.from(
        new Map(response.messages.map((msg: any) => [msg._id, msg])).values()
      );
      state.messages[conversationId] = uniqueMessages.sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateA - dateB;
      });
      state.messagesPagination[conversationId] = response.pagination;
      state.getMessages.error = null;
      state.getMessages.message = null;
    },
    getMessagesFailure: (state, action: PayloadAction<string>) => {
      state.getMessages.status = ReduxStateType.ERROR;
      state.getMessages.error = action.payload;
      state.getMessages.message = action.payload;
    },

    // Update Message from Socket
    updateMessageFromSocket: (
      state,
      action: PayloadAction<{
        conversationId: string;
        message: ChatMessage;
        isSender?: boolean;
      }>
    ) => {
      const { conversationId, message, isSender = false } = action.payload;

      // Initialize messages array if needed
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }

      // Remove ALL temporary messages with same content (optimistic updates)
      // Match by message content and timestamp (within 5 seconds)
      const messageTime = new Date(message.createdAt).getTime();
      const tempMessagesToRemove: number[] = [];
      
      state.messages[conversationId].forEach((m, index) => {
        if (m._id.startsWith("temp-")) {
          const tempTime = new Date(m.createdAt).getTime();
          const timeDiff = Math.abs(messageTime - tempTime);
          // Match if same message content and within 5 seconds
          if (m.message === message.message && timeDiff < 5000) {
            tempMessagesToRemove.push(index);
          }
        }
      });
      
      // Remove temp messages in reverse order to maintain indices
      for (let i = tempMessagesToRemove.length - 1; i >= 0; i--) {
        state.messages[conversationId].splice(tempMessagesToRemove[i], 1);
      }

      // Check if message already exists by _id
      const existingIndex = state.messages[conversationId].findIndex(
        (m) => m._id === message._id
      );

      if (existingIndex === -1) {
        // Check for duplicate by content and timestamp (within 1 second)
        const duplicateIndex = state.messages[conversationId].findIndex((m) => {
          if (m._id === message._id) return true;
          const mTime = new Date(m.createdAt).getTime();
          const timeDiff = Math.abs(messageTime - mTime);
          return m.message === message.message && 
                 m.senderId === message.senderId && 
                 timeDiff < 1000;
        });
        
        if (duplicateIndex === -1) {
          // Add new message at the end (will be sorted by selector)
          state.messages[conversationId].push(message);
        } else {
          // Update existing duplicate message
          state.messages[conversationId][duplicateIndex] = message;
        }
      } else {
        // Update existing message (preserve position)
        state.messages[conversationId][existingIndex] = message;
      }

      // Update conversation's last message
      const conversationIndex = state.conversations.findIndex(
        (c) => c._id === conversationId
      );
      
      const isCurrentlyViewing = state.currentConversation?._id === conversationId;
      
      if (conversationIndex !== -1) {
        state.conversations[conversationIndex].lastMessage = message;
        state.conversations[conversationIndex].updatedAt = message.createdAt;
        
        // Don't manually update unreadCount here - wait for backend to send conversation update
        // Backend will send correct unreadCount via updateConversationFromSocket
        // Only reset to 0 if currently viewing (user is actively reading)
        if (isCurrentlyViewing) {
          state.conversations[conversationIndex].unreadCount = 0;
        }
        // If not viewing and message is from others, backend will send conversation update with correct unreadCount
      }

      // Update current conversation if it matches
      if (isCurrentlyViewing && state.currentConversation) {
        state.currentConversation.lastMessage = message;
        state.currentConversation.updatedAt = message.createdAt;
        // Always reset unread count to 0 when viewing conversation
        state.currentConversation.unreadCount = 0;
      }
    },

    // Update Conversation from Socket
    updateConversationFromSocket: (
      state,
      action: PayloadAction<{
        conversation: ChatConversation;
      }>
    ) => {
      const { conversation } = action.payload;
      const conversationIndex = state.conversations.findIndex(
        (c) => c._id === conversation._id
      );

      const isCurrentlyViewing = state.currentConversation?._id === conversation._id;
      
      if (conversationIndex !== -1) {
        // Update existing conversation
        // Backend now sends correct unreadCountMe and unreadCountTo for current user via direct room
        // Trust the backend's calculation
        let finalUnreadCountMe = conversation.unreadCountMe ?? conversation.unreadCount ?? 0;
        const finalUnreadCountTo = conversation.unreadCountTo ?? 0;
        
        // If viewing, always reset unreadCountMe to 0 (user is actively viewing, so no unread)
        if (isCurrentlyViewing) {
          finalUnreadCountMe = 0;
        }
        
        state.conversations[conversationIndex] = {
          ...conversation,
          unreadCountMe: finalUnreadCountMe,
          unreadCountTo: finalUnreadCountTo,
          unreadCount: finalUnreadCountMe, // Backward compatibility
        };
      } else {
        // Add new conversation at the beginning
        // Ensure unreadCountMe and unreadCountTo are set correctly
        const unreadCountMe = conversation.unreadCountMe ?? conversation.unreadCount ?? 0;
        const unreadCountTo = conversation.unreadCountTo ?? 0;
        
        const newConversation = isCurrentlyViewing
          ? { 
              ...conversation, 
              unreadCountMe: 0, 
              unreadCountTo: unreadCountTo, // Keep unreadCountTo even when viewing
              unreadCount: 0 
            }
          : { 
              ...conversation, 
              unreadCountMe: unreadCountMe,
              unreadCountTo: unreadCountTo,
              unreadCount: unreadCountMe 
            };
        state.conversations.unshift(newConversation);
      }

      // Sort conversations by lastMessageAt or updatedAt (newest first)
      state.conversations.sort((a, b) => {
        const dateA = new Date(a.lastMessage?.createdAt || a.updatedAt || 0).getTime();
        const dateB = new Date(b.lastMessage?.createdAt || b.updatedAt || 0).getTime();
        return dateB - dateA;
      });

      // Update current conversation if it matches
      if (isCurrentlyViewing && state.currentConversation) {
        const unreadCountTo = conversation.unreadCountTo ?? 0;
        state.currentConversation = {
          ...conversation,
          unreadCountMe: 0, // Always reset unread count when viewing
          unreadCountTo: unreadCountTo, // Keep unreadCountTo even when viewing
          unreadCount: 0, // Backward compatibility
        };
      }
    },

    // Append Messages (for pagination)
    appendMessages: (
      state,
      action: PayloadAction<{
        conversationId: string;
        messages: ChatMessage[];
        pagination: MessageListResponse["pagination"];
      }>
    ) => {
      const { conversationId, messages, pagination } = action.payload;
      
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }

      // Append messages (avoid duplicates)
      const existingIds = new Set(state.messages[conversationId].map(m => m._id));
      const newMessages = messages.filter(m => !existingIds.has(m._id));
      state.messages[conversationId] = [...newMessages, ...state.messages[conversationId]];
      
      // Update pagination
      state.messagesPagination[conversationId] = pagination;
    },

    // Send Message
    sendMessageStart: (
      state,
      _action: PayloadAction<{ conversationId: string; data: any }>
    ) => {
      state.sendMessage.status = ReduxStateType.LOADING;
      state.sendMessage.error = null;
      state.sendMessage.message = null;
    },
    sendMessageSuccess: (
      state,
      action: PayloadAction<{ conversationId: string; message: ChatMessage }>
    ) => {
      state.sendMessage.status = ReduxStateType.SUCCESS;
      const { conversationId, message } = action.payload;

      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }

      // Check if message already exists (avoid duplicates from socket)
      const existingIndex = state.messages[conversationId].findIndex(
        (m) => m._id === message._id
      );

      if (existingIndex === -1) {
        // Check for duplicate by content and timestamp
        const messageTime = new Date(message.createdAt).getTime();
        const duplicateIndex = state.messages[conversationId].findIndex((m) => {
          const mTime = new Date(m.createdAt).getTime();
          const timeDiff = Math.abs(messageTime - mTime);
          return m.message === message.message && 
                 m.senderId === message.senderId && 
                 timeDiff < 1000;
        });
        
        if (duplicateIndex === -1) {
          state.messages[conversationId].push(message);
        } else {
          // Update existing duplicate
          state.messages[conversationId][duplicateIndex] = message;
        }
      } else {
        // Update existing message
        state.messages[conversationId][existingIndex] = message;
      }

      // Update conversation's last message
      const conversationIndex = state.conversations.findIndex(
        (c) => c._id === conversationId
      );
      if (conversationIndex !== -1) {
        state.conversations[conversationIndex].lastMessage = message;
        state.conversations[conversationIndex].updatedAt = message.createdAt;
      }

      state.sendMessage.error = null;
      state.sendMessage.message = null;
    },
    sendMessageFailure: (state, action: PayloadAction<string>) => {
      state.sendMessage.status = ReduxStateType.ERROR;
      state.sendMessage.error = action.payload;
      state.sendMessage.message = action.payload;
    },

    // Send Message Via Socket (optimistic update)
    sendMessageViaSocket: (
      state,
      action: PayloadAction<{
        conversationId: string;
        message: string;
      }>
    ) => {
      const { conversationId, message } = action.payload;
      
      // Create temporary message for optimistic update
      const tempMessage: ChatMessage = {
        _id: `temp-${Date.now()}`,
        conversationId,
        senderId: "", // Will be updated from socket response
        message,
        isRead: false,
        isDelivered: false,
        createdAt: new Date().toISOString(),
      };

      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      
      state.messages[conversationId].push(tempMessage);
    },

    // Mark as Read
    markAsReadStart: (
      state,
      _action: PayloadAction<{ conversationId: string }>
    ) => {
      state.markAsRead.status = ReduxStateType.LOADING;
      state.markAsRead.error = null;
      state.markAsRead.message = null;
    },
    markAsReadSuccess: (
      state,
      action: PayloadAction<{ conversationId: string }>
    ) => {
      state.markAsRead.status = ReduxStateType.SUCCESS;
      const { conversationId } = action.payload;

      // Update conversation unread count
      const conversationIndex = state.conversations.findIndex(
        (c) => c._id === conversationId
      );
      if (conversationIndex !== -1) {
        state.conversations[conversationIndex].unreadCount = 0;
      }

      // Update current conversation
      if (state.currentConversation?._id === conversationId) {
        state.currentConversation.unreadCount = 0;
      }

      // Mark all messages as read
      if (state.messages[conversationId]) {
        state.messages[conversationId] = state.messages[conversationId].map(
          (m) => ({ ...m, isRead: true })
        );
      }

      state.markAsRead.error = null;
      state.markAsRead.message = null;
    },
    markAsReadFailure: (state, action: PayloadAction<string>) => {
      state.markAsRead.status = ReduxStateType.ERROR;
      state.markAsRead.error = action.payload;
      state.markAsRead.message = action.payload;
    },

    // Typing indicators
    setTyping: (
      state,
      action: PayloadAction<{ conversationId: string; userId: string; isTyping: boolean }>
    ) => {
      const { conversationId, userId, isTyping } = action.payload;
      if (!state.typing[conversationId]) {
        state.typing[conversationId] = [];
      }
      if (isTyping) {
        if (!state.typing[conversationId].includes(userId)) {
          state.typing[conversationId].push(userId);
        }
      } else {
        state.typing[conversationId] = state.typing[conversationId].filter(
          (id) => id !== userId
        );
      }
    },
    
    // Online users
    setOnlineUsers: (
      state,
      action: PayloadAction<{ conversationId: string; userIds: string[] }>
    ) => {
      state.onlineUsers[action.payload.conversationId] = action.payload.userIds;
    },
    
    addOnlineUser: (
      state,
      action: PayloadAction<{ conversationId: string; userId: string }>
    ) => {
      const { conversationId, userId } = action.payload;
      if (!state.onlineUsers[conversationId]) {
        state.onlineUsers[conversationId] = [];
      }
      if (!state.onlineUsers[conversationId].includes(userId)) {
        state.onlineUsers[conversationId].push(userId);
      }
    },
    
    removeOnlineUser: (
      state,
      action: PayloadAction<{ conversationId: string; userId: string }>
    ) => {
      const { conversationId, userId } = action.payload;
      if (state.onlineUsers[conversationId]) {
        state.onlineUsers[conversationId] = state.onlineUsers[conversationId].filter(
          (id) => id !== userId
        );
      }
    },

    // Reset state
    resetChatState: () => initialState,
  },
});

export const {
  getConversationsStart,
  getConversationsSuccess,
  getConversationsFailure,
  setCurrentConversation,
  getMessagesStart,
  getMessagesSuccess,
  getMessagesFailure,
  updateMessageFromSocket,
  updateConversationFromSocket,
  appendMessages,
  sendMessageStart,
  sendMessageSuccess,
  sendMessageFailure,
  sendMessageViaSocket,
  markAsReadStart,
  markAsReadSuccess,
  markAsReadFailure,
  setTyping,
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  resetChatState,
} = chatSlice.actions;

export default chatSlice.reducer;

