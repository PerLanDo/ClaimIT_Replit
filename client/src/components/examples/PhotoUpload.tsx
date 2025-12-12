import { useState } from 'react';
import { PhotoUpload } from '../PhotoUpload';

export default function PhotoUploadExample() {
  const [photos, setPhotos] = useState<string[]>([]);

  return (
    <div className="max-w-md">
      <PhotoUpload
        photos={photos}
        onPhotosChange={setPhotos}
        showWalletWarning={true}
      />
    </div>
  );
}
