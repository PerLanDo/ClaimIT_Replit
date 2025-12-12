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
        <p>No messages yet</p>
        <p className="text-sm mt-1">Start a conversation by claiming an item</p>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="divide-y divide-border">
      {conversations.map((conversation) => (
        <button
          key={conversation.id}
          onClick={() => onSelect(conversation)}
          className={cn(
            "w-full p-4 text-left hover-elevate transition-colors",
            selectedId === conversation.id && "bg-accent"
          )}
          data-testid={`conversation-${conversation.id}`}
        >
          <div className="flex items-start gap-3">
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(conversation.itemTitle)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium line-clamp-1">{conversation.itemTitle}</p>
                {conversation.lastMessage && (
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {format(new Date(conversation.lastMessage.timestamp), 'MMM d')}
                  </span>
                )}
              </div>

              {conversation.lastMessage && (
                <p className={cn(
                  "text-sm line-clamp-1 mt-0.5",
                  conversation.unreadCount > 0 
                    ? "text-foreground font-medium" 
                    : "text-muted-foreground"
                )}>
                  {conversation.lastMessage.senderName}: {conversation.lastMessage.content}
                </p>
              )}
            </div>

            {conversation.unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="flex-shrink-0 h-5 w-5 p-0 flex items-center justify-center"
              >
                {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
              </Badge>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
