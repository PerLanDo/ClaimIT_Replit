import { ArrowLeft, TrendingUp, Package, CheckCircle, Clock, MapPin, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatsCard } from "@/components/StatsCard";
import { useItems } from "@/lib/hooks";
import { Loader2 } from "lucide-react";
import type { ItemCategory } from "@/lib/types";

interface StatisticsPageProps {
  onBack?: () => void;
}

export function StatisticsPage({ onBack }: StatisticsPageProps) {
  const { data: items = [], isLoading } = useItems({});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Overall Statistics
  const totalItems = items.length;
  const lostCount = items.filter((i) => i.type === "lost").length;
  const foundCount = items.filter((i) => i.type === "found").length;
  const returnedCount = items.filter((i) => i.status === "returned").length;
  const pendingCount = items.filter((i) => i.status === "pending_claim").length;
  const openCount = items.filter((i) => i.status === "open").length;
  const highValueCount = items.filter((i) => i.isHighValue).length;
  const sidTurnoverCount = items.filter((i) => i.turnoverToSID).length;

  // Recovery Rate
  const recoveryRate = totalItems > 0 ? ((returnedCount / totalItems) * 100).toFixed(1) : "0";
  const matchRate = lostCount > 0 ? ((returnedCount / lostCount) * 100).toFixed(1) : "0";

  // Category Breakdown
  const categoryStats: Record<ItemCategory, number> = {
    electronics: 0,
    wallets: 0,
    keys: 0,
    ids_cards: 0,
    clothing: 0,
    bags: 0,
    books: 0,
    tumblers: 0,
    umbrellas: 0,
    other: 0,
  };

  items.forEach((item) => {
    categoryStats[item.category]++;
  });

  const topCategories = Object.entries(categoryStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Location Statistics
  const locationStats: Record<string, number> = {};
  items.forEach((item) => {
    locationStats[item.location] = (locationStats[item.location] || 0) + 1;
  });

  const topLocations = Object.entries(locationStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Time-based statistics (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentItems = items.filter((i) => new Date(i.dateReported) >= thirtyDaysAgo);
  const recentReturned = recentItems.filter((i) => i.status === "returned");

  const categoryLabels: Record<ItemCategory, string> = {
    electronics: "Electronics",
    wallets: "Wallets",
    keys: "Keys",
    ids_cards: "IDs & Cards",
    clothing: "Clothing",
    bags: "Bags",
    books: "Books",
    tumblers: "Tumblers",
    umbrellas: "Umbrellas",
    other: "Other",
  };

  return (
    <div className="space-y-6 pb-20 md:pb-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-bold">Statistics Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Comprehensive overview of lost and found items
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Key Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatsCard
            title="Total Items"
            value={totalItems}
            icon={<Package className="h-5 w-5" />}
          />
          <StatsCard
            title="Recovery Rate"
            value={`${recoveryRate}%`}
            subtitle="Items returned"
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <StatsCard
            title="Match Rate"
            value={`${matchRate}%`}
            subtitle="Lost items found"
            icon={<CheckCircle className="h-5 w-5" />}
          />
          <StatsCard
            title="Pending Claims"
            value={pendingCount}
            icon={<Clock className="h-5 w-5" />}
          />
        </div>
      </div>

      {/* Item Status Breakdown */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Item Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <StatsCard title="Lost Items" value={lostCount} />
          <StatsCard title="Found Items" value={foundCount} />
          <StatsCard title="Returned" value={returnedCount} />
          <StatsCard title="Open" value={openCount} />
          <StatsCard title="High Value" value={highValueCount} />
        </div>
      </div>

      {/* Recent Activity (Last 30 Days) */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Last 30 Days</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <StatsCard
            title="New Reports"
            value={recentItems.length}
            subtitle="Items reported"
          />
          <StatsCard
            title="Items Returned"
            value={recentReturned.length}
            subtitle="Successfully matched"
          />
          <StatsCard
            title="SID Turnovers"
            value={sidTurnoverCount}
            subtitle="High-value items"
          />
        </div>
      </div>

      {/* Category Breakdown */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Top Categories
        </h2>
        <Card className="p-4">
          <div className="space-y-4">
            {topCategories.map(([category, count]) => {
              const percentage = totalItems > 0 ? ((count / totalItems) * 100).toFixed(1) : "0";
              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">
                      {categoryLabels[category as ItemCategory]}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Location Breakdown */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Top Locations
        </h2>
        <Card className="p-4">
          <div className="space-y-4">
            {topLocations.map(([location, count]) => {
              const percentage = totalItems > 0 ? ((count / totalItems) * 100).toFixed(1) : "0";
              return (
                <div key={location}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{location}</span>
                    <span className="text-sm text-muted-foreground">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-gold h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Additional Insights */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Additional Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-2">Success Metrics</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items Returned:</span>
                <span className="font-medium">{returnedCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Recovery Rate:</span>
                <span className="font-medium">{recoveryRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Match Rate:</span>
                <span className="font-medium">{matchRate}%</span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-2">Current Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Open Cases:</span>
                <span className="font-medium">{openCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pending Claims:</span>
                <span className="font-medium">{pendingCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">High-Value Items:</span>
                <span className="font-medium">{highValueCount}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
