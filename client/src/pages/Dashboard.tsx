import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ItemCard } from '@/components/ItemCard';
import { SearchBar } from '@/components/SearchBar';
import { FilterPanel } from '@/components/FilterPanel';
import { StatsCard } from '@/components/StatsCard';
import type { Item, ItemCategory, ItemStatus } from '@/lib/types';

// todo: remove mock functionality
const mockItems: Item[] = [
  {
    id: '1',
    title: 'Blue iPhone 14 Pro',
    description: 'Found near CCS building entrance',
    category: 'electronics',
    status: 'found',
    type: 'found',
    location: 'CCS Building',
    date: new Date('2024-12-10'),
    photos: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400'],
    reporterId: '2',
    reporterName: 'Maria Santos',
    turnoverToSID: true,
    createdAt: new Date('2024-12-10'),
  },
  {
    id: '2',
    title: 'Black Leather Wallet',
    description: 'Lost my wallet somewhere in the library',
    category: 'wallet',
    status: 'lost',
    type: 'lost',
    location: 'Library',
    date: new Date('2024-12-11'),
    photos: ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=400'],
    reporterId: '3',
    reporterName: 'Pedro Reyes',
    turnoverToSID: false,
    createdAt: new Date('2024-12-11'),
  },
  {
    id: '3',
    title: 'Silver MacBook Charger',
    description: 'Left in room 301 after class',
    category: 'electronics',
    status: 'found',
    type: 'found',
    location: 'COE Building',
    date: new Date('2024-12-09'),
    photos: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400'],
    reporterId: '4',
    reporterName: 'Ana Garcia',
    turnoverToSID: false,
    createdAt: new Date('2024-12-09'),
  },
  {
    id: '4',
    title: 'Car Keys with Red Keychain',
    description: 'Found in the parking lot near gymnasium',
    category: 'keys',
    status: 'pending_claim',
    type: 'found',
    location: 'Gymnasium',
    date: new Date('2024-12-08'),
    photos: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'],
    reporterId: '5',
    reporterName: 'Carlos Mendoza',
    turnoverToSID: true,
    createdAt: new Date('2024-12-08'),
  },
  {
    id: '5',
    title: 'Student ID Card',
    description: 'Lost my school ID card',
    category: 'documents',
    status: 'lost',
    type: 'lost',
    location: 'Cafeteria',
    date: new Date('2024-12-12'),
    photos: [],
    reporterId: '6',
    reporterName: 'Lisa Cruz',
    turnoverToSID: false,
    createdAt: new Date('2024-12-12'),
  },
  {
    id: '6',
    title: 'Blue Umbrella',
    description: 'Found in SET building lobby',
    category: 'accessories',
    status: 'found',
    type: 'found',
    location: 'SET Building',
    date: new Date('2024-12-11'),
    photos: ['https://images.unsplash.com/photo-1534309466160-70b22cc6252c?w=400'],
    reporterId: '7',
    reporterName: 'Mark Tan',
    turnoverToSID: false,
    createdAt: new Date('2024-12-11'),
  },
];

interface DashboardProps {
  onItemClick?: (item: Item) => void;
  onReportClick?: () => void;
}

export function Dashboard({ onItemClick, onReportClick }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'lost' | 'found'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<{
    category?: ItemCategory;
    status?: ItemStatus;
    dateRange?: 'today' | 'week' | 'month' | 'all';
    location?: string;
  }>({});

  const filteredItems = mockItems.filter((item) => {
    if (activeTab !== 'all' && item.type !== activeTab) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!item.title.toLowerCase().includes(query) && 
          !item.description.toLowerCase().includes(query)) {
        return false;
      }
    }
    if (filters.category && item.category !== filters.category) return false;
    if (filters.location && item.location !== filters.location) return false;
    return true;
  });

  const lostCount = mockItems.filter(i => i.type === 'lost').length;
  const foundCount = mockItems.filter(i => i.type === 'found').length;
  const returnedCount = mockItems.filter(i => i.status === 'returned').length;

  return (
    <div className="space-y-4 pb-20 md:pb-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatsCard title="Lost Items" value={lostCount} />
        <StatsCard title="Found Items" value={foundCount} />
        <StatsCard title="Returned" value={returnedCount} />
        <StatsCard 
          title="Recovery Rate" 
          value="67%" 
          trend={{ value: 12, isPositive: true }}
        />
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
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
            <TabsList className="grid w-full sm:w-auto grid-cols-3">
              <TabsTrigger 
                value="all" 
                data-testid="tab-all"
                className="data-[state=active]:border-b-2 data-[state=active]:border-gold"
              >
                ALL
              </TabsTrigger>
              <TabsTrigger 
                value="lost" 
                data-testid="tab-lost"
                className="data-[state=active]:border-b-2 data-[state=active]:border-destructive"
              >
                LOST
              </TabsTrigger>
              <TabsTrigger 
                value="found" 
                data-testid="tab-found"
                className="data-[state=active]:border-b-2 data-[state=active]:border-gold"
              >
                FOUND
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex-1" />

          <FilterPanel
            filters={filters}
            onFiltersChange={setFilters}
            locations={['CCS Building', 'COE Building', 'SET Building', 'Library', 'Gymnasium', 'Cafeteria']}
          />
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No items found</p>
          <p className="text-sm mt-1">Try adjusting your filters or search query</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onClick={() => onItemClick?.(item)}
            />
          ))}
        </div>
      )}

      <Button
        onClick={onReportClick}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
        data-testid="button-fab-report"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}
