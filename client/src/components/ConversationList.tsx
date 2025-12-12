import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Conversation } from '@/lib/types';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId?: string;
  onSelect: (conversation: Conversation) => void;
}

export function ConversationList({ conversations, selectedId, onSelect }: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p className="font-medium">No messages yet</p>
        <p className="text-sm mt-1">Start a conversation by claiming an item</p>
      </div>
    );
  }

  const getInitials = (itemId: string) => {
    return itemId.substring(0, 2).toUpperCase();
  };

  const getUserColor = (itemId: string) => {
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-green-500",
      "bg-orange-500",
      "bg-pink-500",
      "bg-teal-500",
    ];
    const index = parseInt(itemId.substring(0, 1)) % colors.length;
    return colors[index];
  };

  return (
    <div className="divide-y divide-border">
      {conversations.map((conversation) => {
        const conversationKey = `${conversation.itemId}-${conversation.otherUserId}`;
        const isUnread = conversation.lastMessage && !conversation.lastMessage.isRead;
        
        return (
        <button
          key={conversationKey}
          onClick={() => onSelect(conversation)}
          className={cn(
            "w-full p-4 text-left transition-all duration-200",
            "hover:bg-accent/50 active:bg-accent",
            selectedId === conversationKey && "bg-accent border-l-4 border-primary"
          )}
          data-testid={`conversation-${conversationKey}`}
        >
          <div className="flex items-start gap-3">
            {/* Avatar with colored background */}
            <div className="relative">
              <Avatar className="h-12 w-12 ring-2 ring-background">
                <AvatarFallback className={cn("text-white font-semibold", getUserColor(conversation.itemId))}>
                  {getInitials(conversation.itemId)}
                </AvatarFallback>
              </Avatar>
              {isUnread && (
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full ring-2 ring-background" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className={cn(
                  "font-semibold line-clamp-1",
                  isUnread && "text-primary"
                )}>
                  Item #{conversation.itemId.substring(0, 8)}
                </p>
                {conversation.lastMessage && (
                  <span className={cn(
                    "text-xs flex-shrink-0",
                    isUnread ? "text-primary font-medium" : "text-muted-foreground"
                  )}>
                    {format(new Date(conversation.lastMessage.timestamp), 'MMM d')}
                  </span>
                )}
              </div>

              {conversation.lastMessage && (
                <div className="flex items-center gap-2">
                  <p className={cn(
                    "text-sm line-clamp-2 flex-1",
                    isUnread
                      ? "text-foreground font-medium" 
                      : "text-muted-foreground"
                  )}>
                    {conversation.lastMessage.content}
                  </p>
                  {isUnread && (
                    <Badge 
                      variant="default" 
                      className="h-5 min-w-[20px] px-1.5 text-xs font-bold rounded-full"
                    >
                      1
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </button>
        );
      })}
    </div>
  );
}
