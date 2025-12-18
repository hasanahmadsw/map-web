'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EquipmentGalleryProps {
  galleryPaths: string[];
  equipmentName: string;
}

function EquipmentGallery({ galleryPaths, equipmentName }: EquipmentGalleryProps) {
  if (!galleryPaths || galleryPaths.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gallery</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {galleryPaths.map((path, index) => (
            <div key={index} className="bg-muted relative aspect-square overflow-hidden rounded-lg border">
              <Image
                src={path}
                alt={`${equipmentName} - Image ${index + 1}`}
                fill
                className="object-cover"
                unoptimized={path.includes('supabase.co')}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default EquipmentGallery;
