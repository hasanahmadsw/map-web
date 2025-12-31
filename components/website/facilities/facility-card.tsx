import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Facility } from '@/types/facilities/facilities.types';
import DivHtml from '@/components/shared/div-html';
import { ArrowRight, Building2 } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { FacilityType } from '@/types/facilities/facility.enums';

interface FacilityCardProps {
  facility: Facility;
  className?: string;
}

function formatFacilityType(type: FacilityType): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

export function FacilityCard({ facility, className }: FacilityCardProps) {
  return (
    <Link
      href={`/facilities/${facility.slug}`}
      className={cn(
        'group glass-card relative block overflow-hidden rounded-xl',
        'flex flex-col',
        className,
      )}
    >
      {/* Cover Image */}
      {facility.coverImage && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={facility.coverImage}
            alt={facility.title || facility.slug}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized={facility.coverImage.includes('supabase.co')}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        {/* Icon/Badge */}
        <div className="mb-4 flex items-center justify-between">
          <div className="bg-primary/10 inline-flex h-12 w-12 items-center justify-center rounded-xl">
            <Building2 className="text-primary h-6 w-6" />
          </div>
          <Badge variant="outline" className="text-xs">
            {formatFacilityType(facility.type)}
          </Badge>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col">
          <h3 className="text-foreground group-hover:text-primary mb-2 line-clamp-2 text-xl font-semibold transition-colors">
            {facility.title || facility.slug}
          </h3>

          {facility.summary && (
            <div className="text-muted-foreground mb-4 line-clamp-3 flex-1 text-sm">
              <DivHtml html={facility.summary} />
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

