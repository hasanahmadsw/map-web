'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Image, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MediaPickerDialog } from '@/components/dashboard/media/media-picker-dialog';

export function FeaturedImageSection() {
  const { watch, setValue } = useFormContext();
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const imageUrl = watch('featuredImage');

  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium">Featured Image</label>
        <div className="flex items-center gap-4">
          {imageUrl && (
            <div className="relative h-32 w-32 overflow-hidden rounded-lg border">
              <img src={imageUrl} alt="Featured" className="h-full w-full object-cover" />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-1 right-1 h-6 w-6 rounded-full p-0"
                onClick={() => setValue('featuredImage', '')}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          <Button type="button" variant="outline" onClick={() => setIsMediaPickerOpen(true)}>
            <Image className="mr-2 h-4 w-4" />
            {imageUrl ? 'Select Image' : 'Featured Image'}
          </Button>
        </div>
      </div>

      <MediaPickerDialog
        open={isMediaPickerOpen}
        onOpenChange={setIsMediaPickerOpen}
        onSelect={media => {
          const selectedMedia = Array.isArray(media) ? media[0] : media;
          if (selectedMedia) {
            setValue('featuredImage', selectedMedia.url);
          }
        }}
        mode="single"
        filter="image"
        initialSelected={imageUrl ? [imageUrl as string] : []}
      />
    </>
  );
}
