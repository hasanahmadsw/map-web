'use client';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ImageIcon, Trash2, Upload } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState } from 'react';
import { Control, FieldValues, Path } from 'react-hook-form';

const MediaSelectModalDynamic = dynamic(
  () => import('@/components/dashboard/media/media-select-modal').then(mod => mod.MediaSelectModal),
  { ssr: false },
);

interface MediaSelectInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  className?: string;
  typeFilter?: 'image' | 'video' | 'all';
}

export function MediaSelectInput<T extends FieldValues>({
  control,
  name,
  label,
  className,
  typeFilter = 'image',
}: MediaSelectInputProps<T>) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => {
        const imageUrl = typeof value === 'string' ? value : '';

        const handleSelect = (url: string | string[]) => {
          // For single selection, extract the first string value
          const selectedUrl = Array.isArray(url) ? url[0] || '' : url;
          onChange(selectedUrl);
          setIsModalOpen(false);
        };

        const handleRemove = () => {
          onChange('');
        };

        return (
          <FormItem className={className}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <div className="space-y-3">
                {imageUrl ? (
                  <div className="group relative w-fit">
                    <div className="relative h-40 w-40 overflow-hidden rounded-lg border border-gray-200">
                      <Image src={imageUrl} alt="Selected media" fill className="object-cover" />
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      type="button"
                      onClick={handleRemove}
                      className="absolute end-2 top-2 cursor-pointer opacity-0 transition-opacity group-hover:opacity-100 hover:opacity-75"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex h-40 w-40 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                    <ImageIcon className="text-muted-foreground h-12 w-12" />
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={imageUrl ? 'outline' : 'default'}
                    onClick={() => setIsModalOpen(true)}
                  >
                    {imageUrl ? (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Select
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Select File
                      </>
                    )}
                  </Button>
                  {imageUrl && (
                    <Button type="button" variant="outline" onClick={handleRemove}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  )}
                </div>
                <MediaSelectModalDynamic
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  onSelect={handleSelect}
                  typeFilter={typeFilter}
                  currentValue={imageUrl}
                  multiple={false}
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
