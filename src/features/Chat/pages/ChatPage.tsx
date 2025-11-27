import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { selectCurrentConversation } from "@/app/store/slices/chat/chat.selector";
import { setCurrentConversation } from "@/app/store/slices/chat/chat.slice";
import ConversationsList from "../components/ConversationsList";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";
import { MessageSquare } from "lucide-react";

const ChatPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentConversation = useAppSelector(selectCurrentConversation);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    return () => {
      // Reset conversation state when leaving chat to avoid stale selections
      dispatch(setCurrentConversation(null));
    };
  }, [dispatch]);

  if (isMobile) {
    return (
      <div className="h-full bg-background-base overflow-hidden">
        <div className="flex bg-neutral-1 h-full overflow-hidden">
          {currentConversation ? (
            <div className="flex flex-col h-full w-full">
              <ChatWindow />
              <MessageInput />
            </div>
          ) : (
            <ConversationsList />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-background-base overflow-hidden">
      <div className="flex bg-neutral-1 h-full overflow-hidden">
        {/* Sidebar - Conversations List */}
        <div className="w-80 border-r border-neutral-3 bg-background-base flex flex-col h-full overflow-hidden flex-shrink-0">
          <ConversationsList />
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {currentConversation ? (
            <div className="flex flex-col h-full w-full">
              <ChatWindow />
              <MessageInput />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-neutral-4 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-8 mb-2">
                  Chọn cuộc trò chuyện
                </h3>
                <p className="text-sm text-neutral-6">
                  Chọn một cuộc trò chuyện từ danh sách để bắt đầu nhắn tin
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
