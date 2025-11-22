import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Smile } from "lucide-react";
import * as Form from "@radix-ui/react-form";
import { useAppSelector } from "@/app/store";
import { selectCurrentConversation } from "@/app/store/slices/chat/chat.selector";
import { socketClients, SOCKET_EVENTS } from "@/core/socket";
import Button from "@/foundation/components/buttons/Button";
import TextArea from "@/foundation/components/input/TextArea";

interface MessageInputProps {
  onSend?: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const currentConversation = useAppSelector(selectCurrentConversation);
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!message.trim() || !currentConversation) return;

    const messageText = message.trim();
    setMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Determine channel and socket client
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

    if (!socketClient) {
      console.error("Socket client not available");
      return;
    }

    // Connect and get socket instance
    const socket = socketClient.connect();
    if (!socket || !socket.connected) {
      console.error("Socket not connected");
      return;
    }

    // Send message via socket
    // Socket will emit the message back immediately, so no need for optimistic update
    socket.emit(SOCKET_EVENTS.CHAT_MESSAGE_SEND, {
      conversationId: currentConversation._id,
      message: messageText,
    });

    onSend?.();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  if (!currentConversation) {
    return null;
  }

  return (
    <div className="p-4 bg-background-2 border-t border-neutral-3 flex-shrink-0">
      <Form.Root onSubmit={(e) => e.preventDefault()}>
        <div className="flex items-end gap-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="p-2 text-neutral-6 hover:text-neutral-10 hover:bg-neutral-2 rounded-lg transition-colors"
              title="Đính kèm file"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="p-2 text-neutral-6 hover:text-neutral-10 hover:bg-neutral-2 rounded-lg transition-colors"
              title="Emoji"
            >
              <Smile className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 relative">
            <TextArea
              name="message"
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Nhập tin nhắn..."
              rows={1}
              className="resize-none min-h-[44px] max-h-[120px] pr-12"
              textSize="large"
            />
          </div>

          <Button
            onClick={handleSend}
            disabled={!message.trim()}
            size="md"
            rounded="full"
            icon={<Send className="w-4 h-4" />}
            className="flex-shrink-0"
          >
            Gửi
          </Button>
        </div>
      </Form.Root>
    </div>
  );
};

export default MessageInput;

