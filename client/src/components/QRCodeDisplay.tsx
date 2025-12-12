import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface QRCodeDisplayProps {
  value: string;
  title?: string;
  subtitle?: string;
  size?: number;
}

export function QRCodeDisplay({ 
  value, 
  title = "Item QR Code",
  subtitle = "Scan to view item details",
  size = 200 
}: QRCodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      ctx?.drawImage(img, 0, 0);
      const link = document.createElement('a');
      link.download = 'claimit-qr-code.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <Card className="p-6">
      <div className="text-center space-y-4">
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>

        <div className="flex justify-center p-4 bg-white rounded-lg">
          <QRCodeSVG
            id="qr-code-svg"
            value={value}
            size={size}
            level="H"
            includeMargin
            fgColor="#800000"
          />
        </div>

        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-2"
            data-testid="button-copy-qr"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="gap-2"
            data-testid="button-download-qr"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
    </Card>
  );
}
