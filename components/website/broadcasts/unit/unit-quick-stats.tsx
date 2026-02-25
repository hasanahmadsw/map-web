import { Package, Settings, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BroadcastUnit } from '@/types/broadcasts/broadcasts.types';

interface UnitQuickStatsProps {
  unit: BroadcastUnit;
  className?: string;
}

export function UnitQuickStats({ unit, className }: UnitQuickStatsProps) {
  const stats = [
    unit.items && unit.items.length > 0 && {
      icon: Package,
      value: unit.items.length,
      label: unit.items.length === 1 ? 'Item' : 'Items',
    },
    unit.specs && Object.keys(unit.specs).length > 0 && {
      icon: Settings,
      value: Object.keys(unit.specs).length,
      label: Object.keys(unit.specs).length === 1 ? 'Spec' : 'Specs',
    },
    unit.gallery && unit.gallery.length > 0 && {
      icon: ImageIcon,
      value: unit.gallery.length,
      label: unit.gallery.length === 1 ? 'Image' : 'Images',
    },
  ].filter(Boolean) as { icon: typeof Package; value: number; label: string }[];

  if (stats.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {stats.map(({ icon: Icon, value, label }) => (
        <span
          key={label}
          className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-4 py-2 text-sm"
        >
          <Icon className="text-primary h-4 w-4 shrink-0" />
          <span className="font-semibold tabular-nums">{value}</span>
          <span className="text-muted-foreground">{label}</span>
        </span>
      ))}
    </div>
  );
}

