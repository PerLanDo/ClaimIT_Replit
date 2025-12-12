import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X, Clock, Eye } from 'lucide-react';
import type { Claim } from '@/lib/types';

interface ClaimCardProps {
  claim: Claim;
  itemTitle: string;
  onApprove?: () => void;
  onReject?: () => void;
  onView?: () => void;
  showActions?: boolean;
}

export function ClaimCard({ 
  claim, 
  itemTitle, 
  onApprove, 
  onReject, 
  onView,
  showActions = true 
}: ClaimCardProps) {
  const statusColors = {
    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  };

  const statusIcons = {
    pending: Clock,
    approved: Check,
    rejected: X,
    completed: Check,
  };

  const StatusIcon = statusIcons[claim.status];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Card className="p-4" data-testid={`card-claim-${claim.id}`}>
      <div className="flex items-start gap-3">
        <Avatar>
          <AvatarFallback className="bg-primary text-primary-foreground">
            {claim.claimantId.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium">Claimant ID: {claim.claimantId.substring(0, 8)}</p>
              <p className="text-sm text-muted-foreground line-clamp-1">
                Claimed: {itemTitle}
              </p>
            </div>
            <Badge className={`flex-shrink-0 gap-1 ${statusColors[claim.status]}`}>
              <StatusIcon className="h-3 w-3" />
              {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {claim.proofDescription}
          </p>

          <p className="text-xs text-muted-foreground mt-2">
            {format(new Date(claim.dateFiled), 'MMM d, yyyy h:mm a')}
          </p>

          {showActions && claim.status === 'pending' && (
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                variant="outline"
                onClick={onView}
                className="gap-1"
                data-testid="button-view-claim"
              >
                <Eye className="h-3 w-3" />
                View Details
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onReject}
                className="gap-1 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                data-testid="button-reject-claim"
              >
                <X className="h-3 w-3" />
                Reject
              </Button>
              <Button
                size="sm"
                onClick={onApprove}
                className="gap-1 bg-green-600 hover:bg-green-700 text-white"
                data-testid="button-approve-claim"
              >
                <Check className="h-3 w-3" />
                Approve
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
