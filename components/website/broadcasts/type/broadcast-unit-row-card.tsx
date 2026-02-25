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
  const href = `/broadcasting/units/${unit.slug}`;

  // Get first few items to display
  const previewItems = unit.items?.slice(0, 3) || [];
  const remainingItemsCount = unit.items && unit.items.length > 3 ? unit.items.length - 3 : 0;

  // Get specs preview (first 2-3 specs)
  const specsEntries = unit.specs ? Object.entries(unit.specs).slice(0, 3) : [];

  return (
    <Link
      href={href}
      className={cn(
        'group relative block overflow-hidden rounded-xl border border-border/60 bg-muted/20',
        'flex flex-col transition-colors md:flex-row',
        'hover:bg-muted/30 hover:border-primary/30',
        className,
      )}
    >
      {/* Cover Image - Left Side */}
      {unit.gallery?.[0]?.path && (
        <div className="relative h-56 w-full shrink-0 overflow-hidden md:h-auto md:w-72 md:shrink-0">
          <Image
            src={unit.gallery[0].path}
            alt={unit.title || unit.slug}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            unoptimized={unit.gallery[0].path.includes('supabase.co')}
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
              <Badge variant="outline" className="text-xs font-medium">
                {formatBroadcastType(unit.type)}
              </Badge>
              {unit.isPublished && (
                <Badge variant="default" className="text-xs">
                  Available
                </Badge>
              )}
            </div>
            <h3 className="text-foreground group-hover:text-primary mb-2 text-lg font-semibold transition-colors md:text-xl">
              {unit.title || unit.slug}
            </h3>
          </div>
          <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors group-hover:bg-primary/15">
            <Package className="text-primary h-5 w-5" />
          </div>
        </div>

        {/* Summary */}
        {unit.summary && (
          <div className="text-muted-foreground mb-4 line-clamp-2 text-sm leading-relaxed">
            <DivHtml html={unit.summary} />
          </div>
        )}

        {/* Details Grid */}
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Items Preview */}
          {unit.items && unit.items.length > 0 && (
            <div className="space-y-2">
              <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
                <CheckCircle2 className="h-3 w-3 text-primary" />
                <span>Equipment Included</span>
              </div>
              <div className="space-y-1">
                {previewItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="bg-primary/60 h-1.5 w-1.5 shrink-0 rounded-full" />
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
              <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
                <Info className="h-3 w-3 text-primary" />
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
        <div className="text-primary mt-auto flex items-center justify-between border-t border-border/60 pt-4">
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
          <div className="flex items-center gap-2 text-sm font-medium">
            <span>View Details</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
