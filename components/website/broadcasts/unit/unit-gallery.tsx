import Image from 'next/image';
import type { GalleryItem } from '@/types/common.types';

interface UnitGalleryProps {
  gallery: GalleryItem[];
  unitTitle: string;
  unitSlug: string;
}

export function UnitGallery({ gallery, unitTitle, unitSlug }: UnitGalleryProps) {
  return (
    <section className="mb-16">
      <div className="space-y-6">
        <div>
          <h2 className="mb-2 text-3xl font-semibold md:text-4xl">Gallery</h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Visual showcase of this broadcast unit
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {gallery
            .sort((a, b) => a.order - b.order)
            .map((item: GalleryItem, index) => (
              <div
                key={`${item.path}-${item.order}`}
                className="group relative aspect-video overflow-hidden rounded-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              >
                <Image
                  src={item.path}
                  alt={`${unitTitle || unitSlug} - Image ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  unoptimized={item.path.includes('supabase.co')}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

