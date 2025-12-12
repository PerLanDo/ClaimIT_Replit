import { Package, Clock, CheckCircle, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatsCard } from '@/components/StatsCard';
import { ActivityTable } from '@/components/ActivityTable';
import { ClaimCard } from '@/components/ClaimCard';
import type { Item, Claim } from '@/lib/types';

// todo: remove mock functionality
const mockStats = {
  totalItems: 156,
  pendingClaims: 12,
  returned: 89,
  recoveryRate: 67,
};

const mockRecentItems: Item[] = [
  {
    id: '1',
    title: 'Blue iPhone 14 Pro',
    description: 'Found near CCS building entrance',
    category: 'electronics',
    status: 'pending_claim',
    type: 'found',
    location: 'CCS Building',
    date: new Date('2024-12-10'),
    photos: [],
    reporterId: '2',
    reporterName: 'Maria Santos',
    turnoverToSID: true,
    createdAt: new Date('2024-12-10'),
  },
  {
    id: '2',
    title: 'Black Leather Wallet',
    description: 'Lost somewhere in the library',
    category: 'wallet',
    status: 'lost',
    type: 'lost',
    location: 'Library',
    date: new Date('2024-12-11'),
    photos: [],
    reporterId: '3',
    reporterName: 'Pedro Reyes',
    turnoverToSID: false,
    createdAt: new Date('2024-12-11'),
  },
  {
    id: '3',
    title: 'Car Keys with Red Keychain',
    description: 'Found in the parking lot',
    category: 'keys',
    status: 'found',
    type: 'found',
    location: 'Gymnasium',
    date: new Date('2024-12-09'),
    photos: [],
    reporterId: '5',
    reporterName: 'Carlos Mendoza',
    turnoverToSID: true,
    createdAt: new Date('2024-12-09'),
  },
  {
    id: '4',
    title: 'Student ID Card',
    description: 'Lost my school ID card',
    category: 'documents',
    status: 'returned',
    type: 'lost',
    location: 'Cafeteria',
    date: new Date('2024-12-08'),
    photos: [],
    reporterId: '6',
    reporterName: 'Lisa Cruz',
    turnoverToSID: false,
    createdAt: new Date('2024-12-08'),
  },
];

const mockPendingClaims: (Claim & { itemTitle: string })[] = [
  {
    id: '1',
    itemId: '1',
    itemTitle: 'Blue iPhone 14 Pro',
    claimantId: '7',
    claimantName: 'Juan Dela Cruz',
    proofDescription: 'This is my phone. It has a crack on the bottom left corner and my name is engraved on the back.',
    status: 'pending',
    createdAt: new Date('2024-12-11T10:00:00'),
  },
  {
    id: '2',
    itemId: '3',
    itemTitle: 'Car Keys with Red Keychain',
    claimantId: '8',
    claimantName: 'Roberto Silva',
    proofDescription: 'These are my car keys. The red keychain has my initials RS on it.',
    status: 'pending',
    createdAt: new Date('2024-12-10T09:00:00'),
  },
];

export function AdminDashboard() {
  return (
    <div className="space-y-6 pb-20 md:pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">SID Lost & Found Management</p>
        </div>
        <Badge className="bg-primary text-primary-foreground">SID Admin</Badge>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Items"
          value={mockStats.totalItems}
          trend={{ value: 8, isPositive: true }}
          icon={<Package className="h-5 w-5" />}
        />
        <StatsCard
          title="Pending Claims"
          value={mockStats.pendingClaims}
          subtitle="Needs review"
          icon={<Clock className="h-5 w-5" />}
        />
        <StatsCard
          title="Returned"
          value={mockStats.returned}
          trend={{ value: 15, isPositive: true }}
          icon={<CheckCircle className="h-5 w-5" />}
        />
        <StatsCard
          title="Recovery Rate"
          value={`${mockStats.recoveryRate}%`}
          trend={{ value: 5, isPositive: true }}
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      <Tabs defaultValue="activity">
        <TabsList>
          <TabsTrigger value="activity" data-testid="tab-activity">
            Recent Activity
          </TabsTrigger>
          <TabsTrigger value="claims" data-testid="tab-pending-claims">
            Pending Claims ({mockPendingClaims.length})
          </TabsTrigger>
          <TabsTrigger value="turnover" data-testid="tab-turnover">
            Turnover Queue
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="mt-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Recent Activity</h3>
            <ActivityTable items={mockRecentItems} />
          </Card>
        </TabsContent>

        <TabsContent value="claims" className="mt-4 space-y-3">
          {mockPendingClaims.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No pending claims</p>
            </Card>
          ) : (
            mockPendingClaims.map((claim) => (
              <ClaimCard
                key={claim.id}
                claim={claim}
                itemTitle={claim.itemTitle}
                onApprove={() => console.log('Approve:', claim.id)}
                onReject={() => console.log('Reject:', claim.id)}
                onView={() => console.log('View:', claim.id)}
                showActions={true}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="turnover" className="mt-4">
          <Card className="p-8 text-center text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No items pending turnover</p>
            <p className="text-sm mt-1">Items to be surrendered to SID will appear here</p>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="p-4 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800 dark:text-amber-200">
              Items Nearing Retention Limit
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              3 items will exceed the 30-day retention period in the next 7 days. 
              Please review and take action.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3 border-amber-300 text-amber-800 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-200 dark:hover:bg-amber-900"
              data-testid="button-review-expiring"
            >
              Review Items
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
