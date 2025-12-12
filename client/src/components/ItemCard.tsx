import { MapPin, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Item } from "@/lib/types";
import { format } from "date-fns";

interface ItemCardProps {
  item: Item;
  onClick?: () => void;
}

export function ItemCard({ item, onClick }: ItemCardProps) {
  const statusColors = {
    open: "bg-muted text-muted-foreground",
    pending_claim: "bg-amber-500 text-white",
    returned: "bg-green-500 text-white",
    surrendered_sid: "bg-blue-500 text-white",
    archived: "bg-muted text-muted-foreground",
    disposed: "bg-muted text-muted-foreground",
  };

  const typeColors = {
    lost: "bg-destructive text-destructive-foreground",
    found: "bg-gold text-gold-foreground",
  };

  const categoryLabels: Record<string, string> = {
    electronics: "Electronics",
    wallets: "Wallet",
    keys: "Keys",
    ids_cards: "IDs/Cards",
    clothing: "Clothing",
    bags: "Bags",
    books: "Books",
    tumblers: "Tumblers",
    umbrellas: "Umbrellas",
    other: "Other",
  };

  return (
    <Card
      className="overflow-hidden cursor-pointer hover-elevate active-elevate-2 transition-transform"
      onClick={onClick}
      data-testid={`card-item-${item.id}`}
    >
      <div className="relative aspect-video bg-muted">
        {item.imageUrls.length > 0 ? (
          <img
            src={item.imageUrls[0]}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}

        {/* Badges container - positioned at bottom with flex layout */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-1">
          <Badge
            className={`${
              typeColors[item.type]
            } uppercase text-xs font-semibold shrink-0`}
          >
            {item.type}
          </Badge>
          <div className="flex gap-1 flex-wrap justify-end">
            {item.isHighValue && (
              <Badge className="bg-amber-500 text-white text-xs font-semibold shrink-0">
                High Value
              </Badge>
            )}
            {item.status === "pending_claim" && (
              <Badge className="bg-amber-500 text-white text-xs shrink-0">
                Pending
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="p-3 space-y-2">
        <h3 className="font-semibold text-sm line-clamp-1">{item.title}</h3>

        <Badge variant="secondary" className="text-xs">
          {categoryLabels[item.category] || item.category}
        </Badge>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span className="line-clamp-1">{item.location}</span>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3 flex-shrink-0" />
          <span>{format(new Date(item.dateLostFound), "MMM d, yyyy")}</span>
        </div>
      </div>
    </Card>
  );
}
