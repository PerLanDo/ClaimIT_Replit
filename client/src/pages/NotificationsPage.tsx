import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NotificationList } from "@/components/NotificationList";
import type { Notification } from "@/lib/types";

// todo: remove mock functionality
const initialNotifications: Notification[] = [
  {
    id: "1",
    userId: "1",
    type: "claim_update",
    content:
      'Roberto Silva has submitted a claim for "Car Keys with Red Keychain"',
    relatedItemId: "4",
    isRead: false,
    timestamp: new Date("2024-12-11T10:00:00"),
  },
  {
    id: "2",
    userId: "1",
    type: "claim_update",
    content:
      'Your claim for "Silver MacBook Charger" has been approved. You can now coordinate pickup.',
    relatedItemId: "3",
    isRead: false,
    timestamp: new Date("2024-12-10T14:00:00"),
  },
  {
    id: "3",
    userId: "1",
    type: "new_message",
    content: 'Maria Santos sent you a message about "Blue iPhone 14 Pro"',
    relatedItemId: "1",
    isRead: true,
    timestamp: new Date("2024-12-10T09:30:00"),
  },
  {
    id: "4",
    userId: "1",
    type: "item_match",
    content:
      'A found item matching your lost "Black Leather Wallet" has been reported',
    relatedItemId: "2",
    isRead: true,
    timestamp: new Date("2024-12-09T16:00:00"),
  },
];

interface NotificationsPageProps {
  onBack?: () => void;
  onNotificationClick?: (notification: Notification) => void;
}

export function NotificationsPage({
  onBack,
  onNotificationClick,
}: NotificationsPageProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({
        ...notification,
        isRead: true
      }))
    );
  };

  return (
    <div className="space-y-4 pb-20 md:pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground">
                {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllRead}
            data-testid="button-mark-all-read"
          >
            Mark all as read
          </Button>
        )}
      </div>

      <Card className="overflow-hidden">
        <NotificationList
          notifications={notifications}
          onNotificationClick={(notification) => {
            // Mark this notification as read
            setNotifications(prevNotifications =>
              prevNotifications.map(n =>
                n.id === notification.id ? { ...n, isRead: true } : n
              )
            );
            console.log("Notification clicked:", notification);
            onNotificationClick?.(notification);
          }}
        />
      </Card>
    </div>
  );
}
