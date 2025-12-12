import { ClaimCard } from '../ClaimCard';
import type { Claim } from '@/lib/types';

const mockClaim: Claim = {
  id: '1',
  itemId: '1',
  claimantId: '7',
  claimantName: 'Juan Dela Cruz',
  proofDescription: 'This is my phone. It has a crack on the bottom left corner and my name is engraved on the back case.',
  status: 'pending',
  createdAt: new Date('2024-12-11T10:00:00'),
};

export default function ClaimCardExample() {
  return (
    <div className="max-w-lg">
      <ClaimCard
        claim={mockClaim}
        itemTitle="Blue iPhone 14 Pro"
        onApprove={() => console.log('Approved')}
        onReject={() => console.log('Rejected')}
        onView={() => console.log('View details')}
        showActions={true}
      />
    </div>
  );
}
