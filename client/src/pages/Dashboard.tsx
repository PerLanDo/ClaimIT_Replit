import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ItemCard } from "@/components/ItemCard";
import { SearchBar } from "@/components/SearchBar";
import { FilterPanel } from "@/components/FilterPanel";
import { StatsCard } from "@/components/StatsCard";
import { useItems } from "@/lib/hooks";
import { useAuth } from "@/contexts/AuthContext";
import type { Item, ItemCategory, ItemStatus } from "@/lib/types";

interface DashboardProps {
  onItemClick?: (item: Item) => void;
  onReportClick?: () => void;
}

export function Dashboard({ onItemClick, onReportClick }: DashboardProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "all" | "lost" | "found" | "returned"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<{
    category?: ItemCategory;
    status?: ItemStatus;
    dateRange?: "today" | "week" | "month" | "all";
    location?: string;
  }>({});

  // Fetch items with filters
  const {
    data: items = [],
    isLoading,
    error,
  } = useItems({
    type:
      activeTab === "all" || activeTab === "returned" ? undefined : activeTab,
    search: searchQuery || undefined,
    category: filters.category,
    status: activeTab === "returned" ? "returned" : filters.status,
  });

  // Calculate stats
  const lostCount = items.filter((i) => i.type === "lost").length;
  const foundCount = items.filter((i) => i.type === "found").length;
  const returnedCount = items.filter((i) => i.status === "returned").length;

  return (
    <div className="space-y-4 pb-20 md:pb-4">
      <div className="grid grid-cols-3 gap-3">
        <StatsCard title="Lost Items" value={lostCount} />
        <StatsCard title="Found Items" value={foundCount} />
        <StatsCard title="Returned" value={returnedCount} />
      </div>

      <div className="space-y-3">
        <div className="block sm:hidden">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search items..."
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as typeof activeTab)}
          >
            <TabsList className="grid w-full sm:w-auto grid-cols-4">
              <TabsTrigger
                value="all"
                data-testid="tab-all"
                className="data-[state=active]:bg-gray-200 data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100"
              >
                ALL
              </TabsTrigger>
              <TabsTrigger
                value="lost"
                data-testid="tab-lost"
                className="data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground"
              >
                LOST
              </TabsTrigger>
              <TabsTrigger
                value="found"
                data-testid="tab-found"
                className="data-[state=active]:bg-gold data-[state=active]:text-gold-foreground"
              >
                FOUND
              </TabsTrigger>
              <TabsTrigger
                value="returned"
                data-testid="tab-returned"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                RETURNED
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex-1" />

          <FilterPanel
            filters={filters}
            onFiltersChange={setFilters}
            locations={[
              "CCS Building",
              "COE Building",
              "SET Building",
              "Library",
              "Gymnasium",
              "Cafeteria",
            ]}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-destructive">
          <p>Failed to load items</p>
          <p className="text-sm mt-1">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No items found</p>
          <p className="text-sm mt-1">
            Try adjusting your filters or search query
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onClick={() => onItemClick?.(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
