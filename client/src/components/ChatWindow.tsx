import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { Send, ArrowLeft, Check, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Message, Conversation } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";

interface ChatWindowProps {
  conversation: Conversation;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

export function ChatWindow({
  conversation,
  messages,
  onSendMessage,
  onBack,
  showBackButton = false,
}: ChatWindowProps) {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getInitials = (userId: string) => {
    return `U${userId.substring(0, 1).toUpperCase()}`;
  };

  const getUserColor = (userId: string) => {
    // Generate consistent colors for different users
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-green-500",
      "bg-orange-500",
      "bg-pink-500",
      "bg-teal-500",
    ];
    const index = parseInt(userId.substring(0, 1)) % colors.length;
    return colors[index];
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border bg-card">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <Avatar className="h-10 w-10">
          <AvatarFallback className={cn("text-white", getUserColor(conversation.otherUserId))}>
            {getInitials(conversation.otherUserId)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold line-clamp-1">
            Item #{conversation.itemId.substring(0, 8)}
          </h3>
          <p className="text-xs text-muted-foreground">Item Discussion</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
        {messages.map((message, index) => {
          const isOwn = message.senderId === user?.id;
          const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;
          const isLastInGroup = index === messages.length - 1 || messages[index + 1].senderId !== message.senderId;

          return (
            <div
              key={message.id}
              className={cn(
                "flex gap-2 items-end",
                isOwn ? "flex-row-reverse" : "flex-row"
              )}
              data-testid={`message-${message.id}`}
            >
              {/* Avatar */}
              <div className="flex-shrink-0 w-8">
                {!isOwn && showAvatar ? (
                  <Avatar className="h-8 w-8 ring-2 ring-background">
                    <AvatarFallback className={cn("text-white text-xs font-semibold", getUserColor(message.senderId))}>
                      {getInitials(message.senderId)}
                    </AvatarFallback>
                  </Avatar>
                ) : !isOwn ? (
                  <div className="w-8" />
                ) : null}
              </div>

              {/* Message Content */}
              <div
                className={cn(
                  "flex flex-col max-w-[75%] md:max-w-[60%]",
                  isOwn ? "items-end" : "items-start"
                )}
              >
                {/* Sender Name (only for other users and first message in group) */}
                {!isOwn && showAvatar && (
                  <p className="text-xs font-semibold text-muted-foreground mb-1 px-1">
                    User {message.senderId}
                  </p>
                )}

                {/* Message Bubble */}
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2.5 shadow-md transition-all",
                    isOwn
                      ? "bg-primary text-primary-foreground rounded-br-md shadow-primary/20"
                      : "bg-card border-2 border-border rounded-bl-md",
                    !isLastInGroup && (isOwn ? "rounded-br-2xl" : "rounded-bl-2xl")
                  )}
                >
                  <p className="text-sm leading-relaxed break-words">{message.content}</p>
                </div>

                {/* Timestamp and Status */}
                {isLastInGroup && (
                  <div className={cn(
                    "flex items-center gap-1 mt-1 px-1",
                    isOwn ? "flex-row-reverse" : "flex-row"
                  )}>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(message.timestamp), "h:mm a")}
                    </p>
                    {isOwn && (
                      <div className="text-muted-foreground">
                        {message.isRead ? (
                          <CheckCheck className="h-3 w-3" />
                        ) : (
                          <Check className="h-3 w-3" />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Spacer for own messages */}
              {isOwn && <div className="flex-shrink-0 w-8" />}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="min-h-[48px] pr-4 rounded-full border-2 focus-visible:ring-2 focus-visible:ring-primary/20"
              data-testid="input-message"
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            size="icon"
            className={cn(
              "h-12 w-12 rounded-full flex-shrink-0 shadow-lg transition-all",
              newMessage.trim() 
                ? "bg-primary hover:bg-primary/90 scale-100" 
                : "bg-muted scale-95"
            )}
            data-testid="button-send-message"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
