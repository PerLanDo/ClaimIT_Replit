import { MapPin, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Item } from '@/lib/types';
import { format } from 'date-fns';

interface ItemCardProps {
  item: Item;
  onClick?: () => void;
}

export function ItemCard({ item, onClick }: ItemCardProps) {
  const statusColors = {
    lost: 'bg-destructive text-destructive-foreground',
    found: 'bg-gold text-gold-foreground',
    pending_claim: 'bg-amber-500 text-white',
    claimed: 'bg-blue-500 text-white',
    returned: 'bg-green-500 text-white',
    expired: 'bg-muted text-muted-foreground',
  };

  const categoryLabels: Record<string, string> = {
    electronics: 'Electronics',
    wallet: 'Wallet',
    keys: 'Keys',
    documents: 'Documents',
    clothing: 'Clothing',
    accessories: 'Accessories',
    bags: 'Bags',
    books: 'Books',
    other: 'Other',
  };

  return (
    <Card 
      className="overflow-hidden cursor-pointer hover-elevate active-elevate-2 transition-transform"
      onClick={onClick}
      data-testid={`card-item-${item.id}`}
    >
      <div className="relative aspect-video bg-muted">
        {item.photos.length > 0 ? (
          <img
            src={item.photos[0]}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
        <Badge 
          className={`absolute top-2 left-2 ${statusColors[item.type]} uppercase text-xs font-semibold`}
        >
          {item.type}
        </Badge>
        {item.status === 'pending_claim' && (
          <Badge 
            className="absolute top-2 right-2 bg-amber-500 text-white text-xs"
          >
            Pending
          </Badge>
        )}
      </div>
      
      <div className="p-3 space-y-2">
        <h3 className="font-semibold text-sm line-clamp-1">{item.title}</h3>
        
        <Badge variant="secondary" className="text-xs">
          {categoryLabels[item.category]}
        </Badge>
        
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span className="line-clamp-1">{item.location}</span>
        </div>
        
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3 flex-shrink-0" />
          <span>{format(new Date(item.date), 'MMM d, yyyy')}</span>
        </div>
      </div>
    </Card>
  );
}
