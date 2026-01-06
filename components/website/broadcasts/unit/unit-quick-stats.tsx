import { Package, Settings, Info, Radio } from 'lucide-react';
import type { BroadcastUnit } from '@/types/broadcasts/broadcasts.types';
import { formatBroadcastType } from './unit-utils';

interface UnitQuickStatsProps {
  unit: BroadcastUnit;
}

export function UnitQuickStats({ unit }: UnitQuickStatsProps) {
  return (
    <section className="mt-8 mb-12">
      <div className="glass-card grid grid-cols-2 gap-4 rounded-xl border p-6 md:grid-cols-4">
        {unit.items && unit.items.length > 0 && (
          <div className="text-center">
            <div className="bg-primary/10 mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full">
              <Package className="text-primary h-6 w-6" />
            </div>
            <div className="text-foreground mb-1 text-2xl font-bold">{unit.items.length}</div>
            <div className="text-muted-foreground text-xs font-medium">
              {unit.items.length === 1 ? 'Item' : 'Items'} Included
            </div>
          </div>
        )}
        {unit.specs && Object.keys(unit.specs).length > 0 && (
          <div className="text-center">
            <div className="bg-primary/10 mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full">
              <Settings className="text-primary h-6 w-6" />
            </div>
            <div className="text-foreground mb-1 text-2xl font-bold">
              {Object.keys(unit.specs).length}
            </div>
            <div className="text-muted-foreground text-xs font-medium">
              {Object.keys(unit.specs).length === 1 ? 'Specification' : 'Specifications'}
            </div>
          </div>
        )}
        {unit.gallery && unit.gallery.length > 0 && (
          <div className="text-center">
            <div className="bg-primary/10 mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full">
              <Info className="text-primary h-6 w-6" />
            </div>
            <div className="text-foreground mb-1 text-2xl font-bold">{unit.gallery.length}</div>
            <div className="text-muted-foreground text-xs font-medium">
              {unit.gallery.length === 1 ? 'Image' : 'Images'} Available
            </div>
          </div>
        )}
        <div className="text-center">
          <div className="bg-primary/10 mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full">
            <Radio className="text-primary h-6 w-6" />
          </div>
          <div className="text-foreground mb-1 text-2xl font-bold">
            {formatBroadcastType(unit.type)}
          </div>
          <div className="text-muted-foreground text-xs font-medium">Broadcast Type</div>
        </div>
      </div>
    </section>
  );
}

