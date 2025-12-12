import { formatDistanceToNow } from 'date-fns';
import { Bell, MessageCircle, Check, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Notification, NotificationType } from '@/lib/types';

interface NotificationListProps {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
  onMarkAsRead?: (id: string) => void;
}

const notificationIcons: Record<NotificationType, typeof Bell> = {
  claim_update: Bell,
  new_message: MessageCircle,
  item_match: Search,
  turnover_reminder: Bell,
  system: Bell,
};

const notificationColors: Record<NotificationType, string> = {
  claim_update: 'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400',
  new_message: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400',
  item_match: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400',
  turnover_reminder: 'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400',
  system: 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400',
};

export function NotificationList({ 
  notifications, 
  onNotificationClick,
  onMarkAsRead 
}: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No notifications yet</p>
        <p className="text-sm mt-1">You'll see updates about your items here</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {notifications.map((notification) => {
        const Icon = notificationIcons[notification.type];
        
        return (
          <button
            key={notification.id}
            onClick={() => onNotificationClick(notification)}
            className={cn(
              "w-full p-4 text-left hover-elevate transition-colors",
              !notification.isRead && "bg-accent/50"
            )}
            data-testid={`notification-${notification.id}`}
          >
            <div className="flex items-start gap-3">
              <div className={cn(
                "p-2 rounded-full flex-shrink-0",
                notificationColors[notification.type]
              )}>
                <Icon className="h-4 w-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={cn(
                    "font-medium line-clamp-1",
                    !notification.isRead && "text-foreground"
                  )}>
                    Notification
                  </p>
                  {!notification.isRead && (
                    <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                  )}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                  {notification.content}
                </p>

                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
