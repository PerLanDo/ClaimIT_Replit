import { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ItemForm } from '@/components/ItemForm';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';

interface ReportItemPageProps {
  onBack?: () => void;
  onSuccess?: () => void;
}

export function ReportItemPage({ onBack, onSuccess }: ReportItemPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedItem, setSubmittedItem] = useState<{ id: string; title: string } | null>(null);

  const handleSubmit = async (data: any, type: 'lost' | 'found') => {
    setIsSubmitting(true);
    // todo: remove mock functionality - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockItemId = `ITEM-${Date.now()}`;
    setSubmittedItem({ id: mockItemId, title: data.title });
    setIsSubmitting(false);
    console.log('Report submitted:', { ...data, type });
  };

  if (submittedItem) {
    return (
      <div className="max-w-md mx-auto space-y-6">
        <Card className="p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>

          <div>
            <h2 className="text-xl font-bold">Report Submitted!</h2>
            <p className="text-muted-foreground mt-1">
              Your item has been reported successfully
            </p>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Item ID</p>
            <p className="font-mono font-medium">{submittedItem.id}</p>
          </div>
        </Card>

        <QRCodeDisplay
          value={`https://claimit.msuiit.edu.ph/item/${submittedItem.id}`}
          title="Item QR Code"
          subtitle="Share this code to help identify your item"
        />

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex-1"
            data-testid="button-back-to-dashboard"
          >
            Back to Dashboard
          </Button>
          <Button 
            onClick={() => {
              setSubmittedItem(null);
            }}
            className="flex-1 bg-primary"
            data-testid="button-report-another"
          >
            Report Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack}
          data-testid="button-back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Report an Item</h1>
      </div>

      <Card className="p-6">
        <ItemForm onSubmit={handleSubmit} isLoading={isSubmitting} />
      </Card>
    </div>
  );
}
