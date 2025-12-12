import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PhotoUpload } from './PhotoUpload';
import { Building2, Handshake } from 'lucide-react';
import type { ItemCategory } from '@/lib/types';

type ReportType = 'lost' | 'found';

interface ItemFormData {
  title: string;
  category: ItemCategory | '';
  location: string;
  description: string;
  photos: string[];
  turnoverToSID: boolean;
}

interface ItemFormProps {
  onSubmit: (data: ItemFormData, type: ReportType) => void;
  isLoading?: boolean;
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

const locations = [
  'CCS Building',
  'COE Building',
  'SET Building',
  'Library',
  'Gymnasium',
  'Cafeteria',
  'Administration Building',
  'IIT Oval',
  'Other',
];

export function ItemForm({ onSubmit, isLoading }: ItemFormProps) {
  const [reportType, setReportType] = useState<ReportType>('lost');
  const [formData, setFormData] = useState<ItemFormData>({
    title: '',
    category: '',
    location: '',
    description: '',
    photos: [],
    turnoverToSID: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const showWalletWarning = formData.category === 'wallet';
  const isHighValue = ['electronics', 'wallet', 'documents'].includes(formData.category);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData, reportType);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex rounded-lg overflow-hidden border border-border">
        <button
          type="button"
          onClick={() => setReportType('lost')}
          className={`flex-1 py-3 px-4 font-medium transition-colors ${
            reportType === 'lost'
              ? 'bg-destructive text-destructive-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
          data-testid="button-report-lost"
        >
          I LOST something
        </button>
        <button
          type="button"
          onClick={() => setReportType('found')}
          className={`flex-1 py-3 px-4 font-medium transition-colors ${
            reportType === 'found'
              ? 'bg-gold text-gold-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
          data-testid="button-report-found"
        >
          I FOUND something
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Item Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Blue iPhone 14"
            data-testid="input-title"
          />
          {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value as ItemCategory })}
          >
            <SelectTrigger data-testid="select-category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Select
            value={formData.location}
            onValueChange={(value) => setFormData({ ...formData, location: value })}
          >
            <SelectTrigger data-testid="select-location">
              <SelectValue placeholder="Where was it lost/found?" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the item in detail (color, brand, distinguishing features...)"
            rows={4}
            data-testid="textarea-description"
          />
          {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
        </div>

        <div className="space-y-2">
          <Label>Photos</Label>
          <PhotoUpload
            photos={formData.photos}
            onPhotosChange={(photos) => setFormData({ ...formData, photos })}
            showWalletWarning={showWalletWarning}
          />
        </div>

        {reportType === 'found' && (
          <div className="space-y-3">
            <Label>What would you like to do with the item?</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, turnoverToSID: true })}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  formData.turnoverToSID
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                data-testid="button-turnover-sid"
              >
                <Building2 className="h-8 w-8 text-primary mb-2" />
                <p className="font-medium">Turn over to SID</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Secure storage at Security Office
                </p>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, turnoverToSID: false })}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  !formData.turnoverToSID
                    ? 'border-gold bg-gold/5'
                    : 'border-border hover:border-gold/50'
                }`}
                data-testid="button-keep-p2p"
              >
                <Handshake className="h-8 w-8 text-gold mb-2" />
                <p className="font-medium">Keep for Peer-to-Peer</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Coordinate directly with owner
                </p>
              </button>
            </div>
            {isHighValue && formData.turnoverToSID && (
              <p className="text-sm text-amber-600 dark:text-amber-400">
                Please surrender this high-value item to SID within 24 hours.
              </p>
            )}
          </div>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full bg-gold text-gold-foreground hover:bg-gold/90"
        disabled={isLoading}
        data-testid="button-submit-report"
      >
        {isLoading ? 'Submitting...' : 'Submit Report'}
      </Button>
    </form>
  );
}
