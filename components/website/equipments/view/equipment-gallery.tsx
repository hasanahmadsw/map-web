'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import type { CarouselApi } from '@/components/ui/carousel';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface EquipmentGalleryProps {
  images: string[];
  equipmentName: string;
  aspectRatio?: 'video' | '4/3' | 'square';
  className?: string;
}

export function EquipmentGallery({
  images,
  equipmentName,
  aspectRatio = 'video',
  className,
}: EquipmentGalleryProps) {
  const aspectClass =
    aspectRatio === '4/3' ? 'aspect-[4/3]' : aspectRatio === 'square' ? 'aspect-square' : 'aspect-video';
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    thumbRefs.current[current]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [current]);

  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <Card className={cn('overflow-hidden p-0', className)}>
        <div className={cn('relative w-full', aspectClass)}>
          <Image
            src={images[0]}
            alt={equipmentName}
            fill
            className="object-cover"
            unoptimized={images[0].includes('supabase.co') || images[0].includes('unsplash.com')}
          />
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn('overflow-hidden p-0', className)}>
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className={cn('relative w-full', aspectClass)}>
                <Image
                  src={image}
                  alt={`${equipmentName} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                  unoptimized={image.includes('supabase.co') || image.includes('unsplash.com')}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 && (
          <>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </>
        )}
      </Carousel>

      {/* Thumbnail Navigation - Max 5 visible, rest scrolls */}
      {images.length > 1 && (
        <div className="scrollbar-hide mx-auto flex max-w-108 overflow-x-auto border-t px-2 py-2">
          <div className="flex flex-nowrap gap-1.5">
            {images.map((image, index) => (
              <button
                key={index}
                ref={el => {
                  thumbRefs.current[index] = el;
                }}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  'relative h-14 w-20 shrink-0 overflow-hidden rounded-md border-2 transition-all',
                  current === index ? 'border-primary opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                )}
              >
                <Image
                  src={image}
                  alt={`${equipmentName} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  unoptimized={image.includes('supabase.co') || image.includes('unsplash.com')}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
