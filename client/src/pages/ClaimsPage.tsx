import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClaimCard } from '@/components/ClaimCard';
import type { Claim } from '@/lib/types';

// todo: remove mock functionality
const mockMyClaims: (Claim & { itemTitle: string })[] = [
  {
    id: '1',
    itemId: '1',
    itemTitle: 'Blue iPhone 14 Pro',
    claimantId: '1',
    claimantName: 'Juan Dela Cruz',
    proofDescription: 'This is my phone. It has a crack on the bottom left corner and my name is engraved on the back case.',
    status: 'pending',
    createdAt: new Date('2024-12-11T10:00:00'),
  },
  {
    id: '2',
    itemId: '3',
    itemTitle: 'Silver MacBook Charger',
    claimantId: '1',
    claimantName: 'Juan Dela Cruz',
    proofDescription: 'This is my charger for my MacBook Pro. I can show you my laptop that matches.',
    status: 'approved',
    createdAt: new Date('2024-12-09T14:00:00'),
  },
];

const mockReceivedClaims: (Claim & { itemTitle: string })[] = [
  {
    id: '3',
    itemId: '4',
    itemTitle: 'Car Keys with Red Keychain',
    claimantId: '8',
    claimantName: 'Roberto Silva',
    claimantAvatar: undefined,
    proofDescription: 'These are my car keys. The red keychain has my initials RS on it. The key is for a Honda Civic 2020.',
    status: 'pending',
    createdAt: new Date('2024-12-10T09:00:00'),
  },
];

interface ClaimsPageProps {
  onClaimApprove?: (claimId: string) => void;
  onClaimReject?: (claimId: string) => void;
  onClaimView?: (claim: Claim) => void;
}

export function ClaimsPage({ onClaimApprove, onClaimReject, onClaimView }: ClaimsPageProps) {
  const [activeTab, setActiveTab] = useState('received');

  const handleApprove = (claimId: string) => {
    console.log('Approving claim:', claimId);
    onClaimApprove?.(claimId);
  };

  const handleReject = (claimId: string) => {
    console.log('Rejecting claim:', claimId);
    onClaimReject?.(claimId);
  };

  return (
    <div className="space-y-4 pb-20 md:pb-4">
      <h1 className="text-xl font-bold">Claims</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="received" data-testid="tab-received-claims">
            Received ({mockReceivedClaims.length})
          </TabsTrigger>
          <TabsTrigger value="my-claims" data-testid="tab-my-claims">
            My Claims ({mockMyClaims.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="mt-4 space-y-3">
          {mockReceivedClaims.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No claims received</p>
              <p className="text-sm mt-1">Claims for your found items will appear here</p>
            </div>
          ) : (
            mockReceivedClaims.map((claim) => (
              <ClaimCard
                key={claim.id}
                claim={claim}
                itemTitle={claim.itemTitle}
                onApprove={() => handleApprove(claim.id)}
                onReject={() => handleReject(claim.id)}
                onView={() => onClaimView?.(claim)}
                showActions={true}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="my-claims" className="mt-4 space-y-3">
          {mockMyClaims.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No claims submitted</p>
              <p className="text-sm mt-1">Your submitted claims will appear here</p>
            </div>
          ) : (
            mockMyClaims.map((claim) => (
              <ClaimCard
                key={claim.id}
                claim={claim}
                itemTitle={claim.itemTitle}
                showActions={false}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
