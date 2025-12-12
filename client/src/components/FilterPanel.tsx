import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useState } from 'react';
import type { ItemCategory, ItemStatus } from '@/lib/types';

interface FilterState {
  category?: ItemCategory;
  status?: ItemStatus;
  dateRange?: 'today' | 'week' | 'month' | 'all';
  location?: string;
}

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  locations?: string[];
}

const categories: { value: ItemCategory; label: string }[] = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'wallet', label: 'Wallet' },
  { value: 'keys', label: 'Keys' },
  { value: 'documents', label: 'Documents' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'bags', label: 'Bags' },
  { value: 'books', label: 'Books' },
  { value: 'other', label: 'Other' },
];

const dateRanges = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'all', label: 'All Time' },
];

export function FilterPanel({ filters, onFiltersChange, locations = [] }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const handleClearAll = () => {
    onFiltersChange({});
  };

  const removeFilter = (key: keyof FilterState) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFiltersChange(newFilters);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2" data-testid="button-filter">
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetHeader>
              <SheetTitle>Filter Items</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={filters.category || ''}
                  onValueChange={(value) => onFiltersChange({ ...filters, category: value as ItemCategory })}
                >
                  <SelectTrigger data-testid="select-category">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <Select
                  value={filters.dateRange || ''}
                  onValueChange={(value) => onFiltersChange({ ...filters, dateRange: value as FilterState['dateRange'] })}
                >
                  <SelectTrigger data-testid="select-date-range">
                    <SelectValue placeholder="All time" />
                  </SelectTrigger>
                  <SelectContent>
                    {dateRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {locations.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Select
                    value={filters.location || ''}
                    onValueChange={(value) => onFiltersChange({ ...filters, location: value })}
                  >
                    <SelectTrigger data-testid="select-location">
                      <SelectValue placeholder="All locations" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={handleClearAll} className="flex-1">
                  Clear All
                </Button>
                <Button onClick={() => setIsOpen(false)} className="flex-1 bg-primary">
                  Apply
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleClearAll} data-testid="button-clear-filters">
            Clear all
          </Button>
        )}
      </div>

      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.category && (
            <Badge variant="secondary" className="gap-1">
              {categories.find(c => c.value === filters.category)?.label}
              <button onClick={() => removeFilter('category')}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.dateRange && (
            <Badge variant="secondary" className="gap-1">
              {dateRanges.find(d => d.value === filters.dateRange)?.label}
              <button onClick={() => removeFilter('dateRange')}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.location && (
            <Badge variant="secondary" className="gap-1">
              {filters.location}
              <button onClick={() => removeFilter('location')}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
