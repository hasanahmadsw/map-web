import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { FacilityUnit } from '@/types/facilities/facilities.types';
import DivHtml from '@/components/shared/div-html';
import { ArrowRight, Package } from 'lucide-react';
import Image from 'next/image';

interface FacilityUnitCardProps {
  unit: FacilityUnit;
  facilitySlug: string;
  className?: string;
}

export function FacilityUnitCard({ unit, facilitySlug, className }: FacilityUnitCardProps) {
  return (
    <Link
      href={`/facilities/${facilitySlug}/units/${unit.slug}`}
      className={cn(
        'group glass-card relative block overflow-hidden rounded-xl',
        'flex flex-col',
        className,
      )}
    >
      {/* Cover Image */}
      {unit.coverImage && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={unit.coverImage}
            alt={unit.title || unit.slug}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized={unit.coverImage.includes('supabase.co')}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        {/* Icon */}
        <div className="mb-4">
          <div className="bg-primary/10 inline-flex h-12 w-12 items-center justify-center rounded-xl">
            <Package className="text-primary h-6 w-6" />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col">
          <h3 className="text-foreground group-hover:text-primary mb-2 line-clamp-2 text-xl font-semibold transition-colors">
            {unit.title || unit.slug}
          </h3>

          {unit.summary && (
            <div className="text-muted-foreground mb-4 line-clamp-3 flex-1 text-sm">
              <DivHtml html={unit.summary} />
            </div>
          )}

          {unit.items && unit.items.length > 0 && (
            <div className="text-muted-foreground mb-4 text-xs">
              {unit.items.length} {unit.items.length === 1 ? 'item' : 'items'} included
            </div>
          )}

          {/* CTA */}
          <div className="text-primary border-border/50 mt-auto flex items-center border-t pt-4 text-sm font-medium">
            <span>View Details</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 will-change-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}

