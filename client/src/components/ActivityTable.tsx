import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Item } from '@/lib/types';

interface ActivityTableProps {
  items: Item[];
  onItemClick?: (item: Item) => void;
}

export function ActivityTable({ items, onItemClick }: ActivityTableProps) {
  const statusColors = {
    lost: 'bg-destructive text-destructive-foreground',
    found: 'bg-gold text-gold-foreground',
    pending_claim: 'bg-amber-500 text-white',
    claimed: 'bg-blue-500 text-white',
    returned: 'bg-green-500 text-white',
    expired: 'bg-muted text-muted-foreground',
  };

  const statusLabels = {
    lost: 'Lost',
    found: 'Found',
    pending_claim: 'Pending',
    claimed: 'Claimed',
    returned: 'Returned',
    expired: 'Expired',
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Date</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow 
              key={item.id}
              onClick={() => onItemClick?.(item)}
              className="cursor-pointer hover-elevate"
              data-testid={`activity-row-${item.id}`}
            >
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(item.createdAt), 'MMM d, yyyy')}
              </TableCell>
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {item.location}
              </TableCell>
              <TableCell>
                <Badge className={statusColors[item.status]}>
                  {statusLabels[item.status]}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
