'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GalleryItem } from '@/types/common.types';

interface EquipmentGalleryProps {
  gallery: GalleryItem[];
  equipmentName: string;
}

function EquipmentGallery({ gallery, equipmentName }: EquipmentGalleryProps) {
  if (!gallery || gallery.length === 0) return null;

  // Sort by order to ensure correct display order
  const sortedGallery = [...gallery].sort((a, b) => a.order - b.order);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gallery</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {sortedGallery.map((item, index) => (
            <div
              key={`${item.path}-${item.order}`}
              className="bg-muted relative aspect-square overflow-hidden rounded-lg border"
            >
              <Image
                src={item.path}
                alt={`${equipmentName} - Image ${index + 1}`}
                fill
                className="object-cover"
                unoptimized={item.path.includes('supabase.co')}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default EquipmentGallery;
