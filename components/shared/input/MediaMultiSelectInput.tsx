'use client';

import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { GalleryItem } from '@/types/common.types';
import { GripVertical, ImageIcon, Trash2, Upload } from 'lucide-react';
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
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => {
        // Normalize value to GalleryItem[] format
        const normalizeToGalleryItems = (val: unknown): GalleryItem[] => {
          if (!val) return [];
          if (Array.isArray(val)) {
            return val.map((item, index) => {
              // If it's already a GalleryItem, use it
              if (typeof item === 'object' && item !== null && 'path' in item && 'order' in item) {
                return { ...item, path: String(item.path), order: Number(item.order) } as GalleryItem;
              }
              // If it's a string, convert to GalleryItem
              if (typeof item === 'string') {
                return { path: item, order: index + 1 };
              }
              // Fallback
              return { path: String(item), order: index + 1 };
            });
          }
          // Single string value
          if (typeof val === 'string') {
            return [{ path: val, order: 1 }];
          }
          return [];
        };

        const galleryItems = normalizeToGalleryItems(value);
        // Sort by order to ensure correct display order
        const sortedItems = [...galleryItems].sort((a, b) => a.order - b.order);

        const handleSelect = (urls: string | string[]) => {
          const urlsArray = Array.isArray(urls) ? urls : [urls];
          const newItems: GalleryItem[] = urlsArray.map((url, index) => ({
            path: url,
            order: galleryItems.length + index + 1,
          }));
          // Merge with existing items, avoiding duplicates
          const existingPaths = new Set(galleryItems.map(item => item.path));
          const uniqueNewItems = newItems.filter(item => !existingPaths.has(item.path));
          const updatedItems = [...galleryItems, ...uniqueNewItems];
          onChange(updatedItems);
          setIsModalOpen(false);
        };

        const handleRemove = (index: number) => {
          const newItems = sortedItems.filter((_, i) => i !== index);
          // Reorder items to maintain sequential order starting from 1
          const reorderedItems = newItems.map((item, i) => ({ ...item, order: i + 1 }));
          onChange(reorderedItems);
        };

        const handleClearAll = () => {
          onChange([]);
        };

        const handleDragStart = (e: React.DragEvent, index: number) => {
          // Prevent drag if clicking on a button
          const target = e.target as HTMLElement;
          if (target.closest('button')) {
            e.preventDefault();
            return;
          }
          setDraggedIndex(index);
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/html', index.toString());
        };

        const handleDragOver = (e: React.DragEvent, index: number) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          setDragOverIndex(index);
        };

        const handleDragLeave = () => {
          setDragOverIndex(null);
        };

        const handleDrop = (e: React.DragEvent, dropIndex: number) => {
          e.preventDefault();
          setDragOverIndex(null);

          if (draggedIndex === null || draggedIndex === dropIndex) {
            setDraggedIndex(null);
            return;
          }

          const newItems = [...sortedItems];
          const [removed] = newItems.splice(draggedIndex, 1);
          newItems.splice(dropIndex, 0, removed);

          // Update order values based on new positions starting from 1
          const reorderedItems = newItems.map((item, index) => ({
            ...item,
            order: index + 1,
          }));

          onChange(reorderedItems);
          setDraggedIndex(null);
        };

        const handleDragEnd = () => {
          setDraggedIndex(null);
          setDragOverIndex(null);
        };

        return (
          <FormItem className={className}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <div className="space-y-3">
                {sortedItems.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {sortedItems.map((item, index) => (
                      <div
                        key={`${item.path}-${item.order}`}
                        draggable
                        onDragStart={e => handleDragStart(e, index)}
                        onDragOver={e => handleDragOver(e, index)}
                        onDragLeave={handleDragLeave}
                        onDrop={e => handleDrop(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`group relative w-full cursor-move transition-all ${
                          draggedIndex === index ? 'opacity-50' : ''
                        } ${dragOverIndex === index ? 'ring-primary scale-105 ring-2' : ''}`}
                      >
                        <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-gray-200">
                          <Image
                            src={item.path}
                            alt={`Gallery image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="absolute start-2 top-2 flex gap-1">
                          <div className="rounded bg-black/50 p-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <GripVertical className="size-4 text-white" />
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            handleRemove(index);
                          }}
                          onMouseDown={e => e.stopPropagation()}
                          className="absolute end-2 top-2 z-10 cursor-pointer opacity-0 transition-opacity group-hover:opacity-100 hover:opacity-75"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-40 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                    <ImageIcon className="text-muted-foreground h-12 w-12" />
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={sortedItems.length > 0 ? 'outline' : 'default'}
                    onClick={() => setIsModalOpen(true)}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {sortedItems.length > 0 ? addMoreText : selectText}
                  </Button>
                  {sortedItems.length > 0 && (
                    <Button type="button" variant="outline" onClick={handleClearAll}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove All
                    </Button>
                  )}
                </div>
                <MediaSelectModalDynamic
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  onSelect={handleSelect}
                  typeFilter={typeFilter}
                  currentValue={sortedItems.map(item => item.path)}
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
