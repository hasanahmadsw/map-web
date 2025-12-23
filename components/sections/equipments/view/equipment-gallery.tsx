'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import type { CarouselApi } from '@/components/ui/carousel';
import { Card } from '@/components/ui/card';
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
}

export function EquipmentGallery({ images, equipmentName }: EquipmentGalleryProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <Card className="overflow-hidden p-0">
        <div className="relative aspect-video w-full">
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
    <Card className="overflow-hidden p-0">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative aspect-video w-full">
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

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2 border-t p-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`relative aspect-video w-full overflow-hidden rounded-md border-2 transition-all ${
                current === index ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
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
      )}
    </Card>
  );
}
