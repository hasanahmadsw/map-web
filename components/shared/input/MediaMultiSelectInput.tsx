'use client';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Trash2, Upload } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState } from 'react';
import { Control, FieldValues, Path } from 'react-hook-form';

const MediaSelectModalDynamic = dynamic(
  () => import('@/components/dashboard/media/media-select-modal').then(mod => mod.MediaSelectModal),
  { ssr: false },
);

interface MediaMultiSelectInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  className?: string;
  typeFilter?: 'image' | 'video' | 'all';
  addMoreText?: string;
  selectText?: string;
}

export function MediaMultiSelectInput<T extends FieldValues>({
  control,
  name,
  label,
  className,
  typeFilter = 'image',
  addMoreText = 'Add More Images',
  selectText = 'Select Gallery Images',
}: MediaMultiSelectInputProps<T>) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => {
        const galleryUrls = Array.isArray(value) ? value : [];

        const handleSelect = (urls: string | string[]) => {
          const selectedUrls = Array.isArray(urls) ? urls : [urls];
          onChange([...galleryUrls, ...selectedUrls]);
          setIsModalOpen(false);
        };

        const handleRemove = (index: number) => {
          const newUrls = [...galleryUrls];
          newUrls.splice(index, 1);
          onChange(newUrls);
        };

        return (
          <FormItem className={className}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <div className="space-y-3">
                {galleryUrls.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {galleryUrls.map((url, index) => (
                      <div key={index} className="group relative">
                        <div className="relative h-32 w-full overflow-hidden rounded-lg border border-gray-200">
                          <Image src={url} alt={`Gallery image ${index + 1}`} fill className="object-cover" />
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          type="button"
                          onClick={() => handleRemove(index)}
                          className="absolute end-2 top-2 cursor-pointer opacity-0 transition-opacity group-hover:opacity-100 hover:opacity-75"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(true)}>
                  <Upload className="mr-2 h-4 w-4" />
                  {galleryUrls.length > 0 ? addMoreText : selectText}
                </Button>
                <MediaSelectModalDynamic
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  onSelect={handleSelect}
                  typeFilter={typeFilter}
                  currentValue={galleryUrls}
                  multiple={true}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
