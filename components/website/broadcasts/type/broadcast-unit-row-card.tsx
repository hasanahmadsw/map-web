import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { BroadcastUnit } from '@/types/broadcasts/broadcasts.types';
import DivHtml from '@/components/shared/div-html';
import { ArrowRight, Package, CheckCircle2, Info } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
function formatBroadcastType(type: string): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

interface BroadcastUnitRowCardProps {
  unit: BroadcastUnit;
  className?: string;
}

export function BroadcastUnitRowCard({ unit, className }: BroadcastUnitRowCardProps) {
  const unitType = unit.type.toLowerCase().replace(/_/g, '-');
  const href = `/broadcasts/${unitType}/${unit.slug}`;

  // Get first few items to display
  const previewItems = unit.items?.slice(0, 3) || [];
  const remainingItemsCount = unit.items && unit.items.length > 3 ? unit.items.length - 3 : 0;

  // Get specs preview (first 2-3 specs)
  const specsEntries = unit.specs ? Object.entries(unit.specs).slice(0, 3) : [];

  return (
    <Link
      href={href}
      className={cn(
        'group glass-card relative block overflow-hidden rounded-xl',
        'flex flex-col transition-all duration-500 md:flex-row',
        'hover:scale-[1.01] hover:shadow-lg',
        className,
      )}
    >
      {/* Cover Image - Left Side */}
      {unit.coverImage && (
        <div className="relative h-64 w-full overflow-hidden md:h-auto md:w-80 md:shrink-0">
          <Image
            src={unit.coverImage}
            alt={unit.title || unit.slug}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized={unit.coverImage.includes('supabase.co')}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent md:hidden" />
        </div>
      )}

      {/* Content - Right Side */}
      <div className="flex flex-1 flex-col p-6 md:p-8">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {formatBroadcastType(unit.type)}
              </Badge>
              {unit.isPublished && (
                <Badge variant="default" className="text-xs">
                  Available
                </Badge>
              )}
            </div>
            <h3 className="text-foreground group-hover:text-primary mb-2 text-2xl font-semibold transition-colors md:text-3xl">
              {unit.title || unit.slug}
            </h3>
          </div>
          <div className="bg-primary/10 group-hover:bg-primary/20 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors">
            <Package className="text-primary h-6 w-6" />
          </div>
        </div>

        {/* Summary */}
        {unit.summary && (
          <div className="text-muted-foreground mb-4 line-clamp-2 text-sm leading-relaxed md:text-base">
            <DivHtml html={unit.summary} />
          </div>
        )}

        {/* Details Grid */}
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Items Preview */}
          {unit.items && unit.items.length > 0 && (
            <div className="space-y-2">
              <div className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wide uppercase">
                <CheckCircle2 className="h-3 w-3" />
                <span>Equipment Included</span>
              </div>
              <div className="space-y-1">
                {previewItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="bg-primary/10 h-1.5 w-1.5 shrink-0 rounded-full" />
                    <span className="text-muted-foreground">
                      {item.title}
                      {item.qty && <span className="ml-1 text-xs">({item.qty}x)</span>}
                    </span>
                  </div>
                ))}
                {remainingItemsCount > 0 && (
                  <div className="text-muted-foreground text-xs">
                    +{remainingItemsCount} more {remainingItemsCount === 1 ? 'item' : 'items'}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Specs Preview */}
          {specsEntries.length > 0 && (
            <div className="space-y-2">
              <div className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-wide uppercase">
                <Info className="h-3 w-3" />
                <span>Key Specifications</span>
              </div>
              <div className="space-y-1">
                {specsEntries.map(([key, value], index) => {
                  const formattedKey = key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, str => str.toUpperCase())
                    .trim();
                  const displayValue =
                    typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value);

                  return (
                    <div key={index} className="text-sm">
                      <span className="text-muted-foreground font-medium">{formattedKey}:</span>{' '}
                      <span className="text-foreground">
                        {displayValue.length > 50 ? `${displayValue.substring(0, 50)}...` : displayValue}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-primary border-border/50 mt-auto flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-4 text-sm">
            {unit.items && unit.items.length > 0 && (
              <span className="text-muted-foreground">
                {unit.items.length} {unit.items.length === 1 ? 'item' : 'items'}
              </span>
            )}
            {specsEntries.length > 0 && (
              <span className="text-muted-foreground">
                {Object.keys(unit.specs || {}).length}{' '}
                {Object.keys(unit.specs || {}).length === 1 ? 'spec' : 'specs'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 font-medium">
            <span>View Full Details</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 will-change-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
