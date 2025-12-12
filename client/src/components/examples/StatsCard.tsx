import { Package } from 'lucide-react';
import { StatsCard } from '../StatsCard';

export default function StatsCardExample() {
  return (
    <div className="grid grid-cols-2 gap-4 max-w-lg">
      <StatsCard
        title="Total Items"
        value={156}
        trend={{ value: 8, isPositive: true }}
        icon={<Package className="h-5 w-5" />}
      />
      <StatsCard
        title="Recovery Rate"
        value="67%"
        subtitle="Last 30 days"
      />
    </div>
  );
}
