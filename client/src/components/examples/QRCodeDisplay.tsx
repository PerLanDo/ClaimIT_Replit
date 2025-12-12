import { QRCodeDisplay } from '../QRCodeDisplay';

export default function QRCodeDisplayExample() {
  return (
    <div className="max-w-sm">
      <QRCodeDisplay
        value="https://claimit.msuiit.edu.ph/item/ITEM-123456"
        title="Item QR Code"
        subtitle="Scan to view item details"
      />
    </div>
  );
}
