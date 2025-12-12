import { ItemCard } from '../ItemCard';
import type { Item } from '@/lib/types';

const mockItem: Item = {
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
};

export default function ItemCardExample() {
  return (
    <div className="max-w-xs">
      <ItemCard item={mockItem} onClick={() => console.log('Item clicked')} />
    </div>
  );
}
