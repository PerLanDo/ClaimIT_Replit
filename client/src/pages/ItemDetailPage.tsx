import { useState } from 'react';
import { ArrowLeft, MapPin, Clock, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { PhotoGallery } from '@/components/PhotoGallery';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { ClaimForm } from '@/components/ClaimForm';
import type { Item } from '@/lib/types';

interface ItemDetailPageProps {
  item: Item;
  onBack?: () => void;
  onMessage?: () => void;
  onClaimSuccess?: () => void;
}

export function ItemDetailPage({ item, onBack, onMessage, onClaimSuccess }: ItemDetailPageProps) {
  const [showQR, setShowQR] = useState(false);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [isClaimSubmitting, setIsClaimSubmitting] = useState(false);

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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleClaimSubmit = async (data: { proofDescription: string; proofImage?: string }) => {
    setIsClaimSubmitting(true);
    // todo: remove mock functionality
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Claim submitted:', data);
    setIsClaimSubmitting(false);
    setShowClaimForm(false);
    onClaimSuccess?.();
  };

  const canClaim = item.type === 'found' && item.status === 'open';

  return (
    <div className="max-w-2xl mx-auto space-y-4 pb-24">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onBack}
        className="mb-2"
        data-testid="button-back"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <PhotoGallery photos={item.imageUrls} alt={item.title} />

      <Card className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">{item.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={`${statusColors[item.type]} uppercase text-xs`}>
                {item.type}
              </Badge>
              <Badge variant="secondary">
                {categoryLabels[item.category]}
              </Badge>
              {item.status === 'pending_claim' && (
                <Badge className="bg-amber-500 text-white">Pending Claim</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 py-3 border-y border-border">
          <Avatar>
            <AvatarFallback className="bg-primary text-primary-foreground">
              {item.reporterId.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">Reporter ID: {item.reporterId.substring(0, 8)}</p>
            <p className="text-sm text-muted-foreground">
              {item.type === 'lost' ? 'Lost by' : 'Found by'}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{item.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{format(new Date(item.dateLostFound), 'MMMM d, yyyy')}</span>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Description</h3>
          <p className="text-sm text-muted-foreground">{item.description}</p>
        </div>

        {item.turnoverToSID && (
          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              This item has been turned over to the Security Intelligence Division (SID) for safekeeping.
            </p>
          </div>
        )}
      </Card>

      <Collapsible open={showQR} onOpenChange={setShowQR}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between"
            data-testid="button-toggle-qr"
          >
            Show Item QR Code
            {showQR ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <QRCodeDisplay
            value={`https://claimit.msuiit.edu.ph/item/${item.id}`}
            title="Item QR Code"
            subtitle="Scan to view item details"
          />
        </CollapsibleContent>
      </Collapsible>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border md:relative md:border-0 md:p-0">
        <div className="flex gap-3 max-w-2xl mx-auto">
          {canClaim && (
            <Button
              onClick={() => setShowClaimForm(true)}
              className="flex-1 bg-gold text-gold-foreground hover:bg-gold/90"
              data-testid="button-claim-item"
            >
              Claim This Item
            </Button>
          )}
          <Button
            variant="outline"
            onClick={onMessage}
            className="flex-1 gap-2"
            data-testid="button-message"
          >
            <MessageCircle className="h-4 w-4" />
            Message {item.type === 'lost' ? 'Owner' : 'Finder'}
          </Button>
        </div>
      </div>

      <ClaimForm
        isOpen={showClaimForm}
        onClose={() => setShowClaimForm(false)}
        onSubmit={handleClaimSubmit}
        itemTitle={item.title}
        isLoading={isClaimSubmitting}
      />
    </div>
  );
}
