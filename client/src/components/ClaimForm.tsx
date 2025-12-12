import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Camera, Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface ClaimFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { proofDescription: string; proofImage?: string }) => void;
  itemTitle: string;
  isLoading?: boolean;
}

export function ClaimForm({ isOpen, onClose, onSubmit, itemTitle, isLoading }: ClaimFormProps) {
  const [proofDescription, setProofDescription] = useState('');
  const [proofImage, setProofImage] = useState<string | undefined>();
  const [acknowledged, setAcknowledged] = useState(false);
  const [error, setError] = useState('');

  const charCount = proofDescription.length;
  const minChars = 50;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProofImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (charCount < minChars) {
      setError(`Proof description must be at least ${minChars} characters`);
      return;
    }
    
    if (!acknowledged) {
      setError('Please acknowledge that you are the rightful owner');
      return;
    }

    setError('');
    onSubmit({ proofDescription, proofImage });
  };

  const handleClose = () => {
    setProofDescription('');
    setProofImage(undefined);
    setAcknowledged(false);
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Claim Item</DialogTitle>
          <DialogDescription>
            Claiming: <span className="font-medium">{itemTitle}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="proof">Proof of Ownership *</Label>
            <Textarea
              id="proof"
              value={proofDescription}
              onChange={(e) => setProofDescription(e.target.value)}
              placeholder="Describe specific details that only the owner would know (e.g., unique markings, contents, when/where you lost it...)"
              rows={4}
              data-testid="textarea-proof"
            />
            <p className={`text-xs ${charCount < minChars ? 'text-destructive' : 'text-muted-foreground'}`}>
              {charCount} / {minChars} minimum characters
            </p>
          </div>

          <div className="space-y-2">
            <Label>Supporting Evidence (optional)</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              {proofImage ? (
                <div className="relative">
                  <img
                    src={proofImage}
                    alt="Proof"
                    className="max-h-32 mx-auto rounded-md"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="mt-2"
                    onClick={() => setProofImage(undefined)}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Upload proof (photo of receipt, box, etc.)
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    data-testid="input-proof-image"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Checkbox
              id="acknowledge"
              checked={acknowledged}
              onCheckedChange={(checked) => setAcknowledged(checked === true)}
              data-testid="checkbox-acknowledge"
            />
            <label htmlFor="acknowledge" className="text-sm text-muted-foreground">
              I confirm that I am the rightful owner of this item and the information provided is accurate.
            </label>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gold text-gold-foreground hover:bg-gold/90"
              disabled={isLoading}
              data-testid="button-submit-claim"
            >
              {isLoading ? 'Submitting...' : 'Submit Claim'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
