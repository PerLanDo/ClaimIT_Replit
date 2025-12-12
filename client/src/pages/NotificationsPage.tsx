import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NotificationList } from '@/components/NotificationList';
import type { Notification } from '@/lib/types';

// todo: remove mock functionality
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'claim_submitted',
    title: 'New Claim Received',
    message: 'Roberto Silva has submitted a claim for "Car Keys with Red Keychain"',
    itemId: '4',
    read: false,
    createdAt: new Date('2024-12-11T10:00:00'),
  },
  {
    id: '2',
    type: 'claim_approved',
    title: 'Claim Approved!',
    message: 'Your claim for "Silver MacBook Charger" has been approved. You can now coordinate pickup.',
    itemId: '3',
    read: false,
    createdAt: new Date('2024-12-10T14:00:00'),
  },
  {
    id: '3',
    type: 'new_message',
    title: 'New Message',
    message: 'Maria Santos sent you a message about "Blue iPhone 14 Pro"',
    itemId: '1',
    read: true,
    createdAt: new Date('2024-12-10T09:30:00'),
  },
  {
    id: '4',
    type: 'item_match',
    title: 'Potential Match Found',
    message: 'A found item matching your lost "Black Leather Wallet" has been reported',
    itemId: '2',
    read: true,
    createdAt: new Date('2024-12-09T16:00:00'),
  },
];

interface NotificationsPageProps {
  onNotificationClick?: (notification: Notification) => void;
}

export function NotificationsPage({ onNotificationClick }: NotificationsPageProps) {
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    console.log('Marking all as read');
  };

  return (
    <div className="space-y-4 pb-20 md:pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
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
          notifications={mockNotifications}
          onNotificationClick={(notification) => {
            console.log('Notification clicked:', notification);
            onNotificationClick?.(notification);
          }}
        />
      </Card>
    </div>
  );
}
