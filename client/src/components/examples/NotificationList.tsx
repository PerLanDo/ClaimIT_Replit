import { NotificationList } from '../NotificationList';
import type { Notification } from '@/lib/types';

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
    message: 'Your claim for "Silver MacBook Charger" has been approved.',
    itemId: '3',
    read: true,
    createdAt: new Date('2024-12-10T14:00:00'),
  },
];

export default function NotificationListExample() {
  return (
    <div className="max-w-md border rounded-lg overflow-hidden">
      <NotificationList
        notifications={mockNotifications}
        onNotificationClick={(n) => console.log('Clicked:', n)}
      />
    </div>
  );
}
