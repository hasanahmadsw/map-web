import { Package } from 'lucide-react';
import type { BroadcastUnitItem } from '@/types/broadcasts/broadcasts.types';
import { BroadcastUnitItemGroup } from '@/types/broadcasts/broadcast.enums';
import { formatGroup } from './unit-utils';

const GROUP_COLORS: Record<string, string> = {
  VIDEO_PRODUCTION: 'border-l-4 border-l-blue-500',
  VISION_MIXING: 'border-l-4 border-l-violet-500',
  ROUTING: 'border-l-4 border-l-fuchsia-500',
  CAMERAS: 'border-l-4 border-l-amber-500',
  LENSES: 'border-l-4 border-l-orange-500',
  CAMERA_SUPPORT: 'border-l-4 border-l-yellow-600',
  PLAYOUT_GRAPHICS: 'border-l-4 border-l-cyan-500',
  RECORDING_REPLAY: 'border-l-4 border-l-teal-500',
  MONITORING: 'border-l-4 border-l-sky-500',
  AUDIO: 'border-l-4 border-l-emerald-500',
  INTERCOM: 'border-l-4 border-l-green-500',
  NETWORKING: 'border-l-4 border-l-indigo-500',
  SYNC_TIMING: 'border-l-4 border-l-purple-500',
  RF_WIRELESS: 'border-l-4 border-l-rose-500',
  POWER: 'border-l-4 border-l-red-500',
  CABLING: 'border-l-4 border-l-slate-500',
  STUDIO_TOOLS: 'border-l-4 border-l-pink-500',
  OTHER: 'border-l-4 border-l-border',
};

function getGroupColor(group: string): string {
  return GROUP_COLORS[group] ?? GROUP_COLORS.OTHER;
}

function getGroupQtyColor(group: string): string {
  const colorMap: Record<string, string> = {
    VIDEO_PRODUCTION: 'bg-blue-500/15 text-blue-700 dark:text-blue-300',
    VISION_MIXING: 'bg-violet-500/15 text-violet-700 dark:text-violet-300',
    ROUTING: 'bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300',
    CAMERAS: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
    LENSES: 'bg-orange-500/15 text-orange-700 dark:text-orange-300',
    CAMERA_SUPPORT: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-300',
    PLAYOUT_GRAPHICS: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300',
    RECORDING_REPLAY: 'bg-teal-500/15 text-teal-700 dark:text-teal-300',
    MONITORING: 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
    AUDIO: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
    INTERCOM: 'bg-green-500/15 text-green-700 dark:text-green-300',
    NETWORKING: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300',
    SYNC_TIMING: 'bg-purple-500/15 text-purple-700 dark:text-purple-300',
    RF_WIRELESS: 'bg-rose-500/15 text-rose-700 dark:text-rose-300',
    POWER: 'bg-red-500/15 text-red-700 dark:text-red-300',
    CABLING: 'bg-slate-500/15 text-slate-700 dark:text-slate-300',
    STUDIO_TOOLS: 'bg-pink-500/15 text-pink-700 dark:text-pink-300',
  };
  return colorMap[group] ?? 'bg-muted text-muted-foreground';
}

interface UnitItemsProps {
  groupedItems: Record<string, BroadcastUnitItem[]>;
}

function ItemCard({
  item,
  group,
}: {
  item: BroadcastUnitItem;
  group: string;
}) {
  const hasQty = item.qty != null && item.qty > 0;
  const cardColor = getGroupColor(group);
  const qtyColor = getGroupQtyColor(group);

  return (
    <div
      className={`flex items-start gap-4 rounded-xl border border-border/60 border-l-0 bg-card p-4 ${cardColor}`}
    >

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{item.title}</p>
        {item.notes && (
          <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{item.notes}</p>
        )}
      </div>
      {hasQty && (
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold tabular-nums ${qtyColor}`}>
          ×{item.qty}
        </span>
      )}
    </div>
  );
}

export function UnitItems({ groupedItems }: UnitItemsProps) {
  return (
    <section>
      <div className="space-y-10">
        <div>
          <h2 className="mb-2 text-xl font-semibold md:text-2xl">Equipment & Items</h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Equipment and items included in this unit
          </p>
        </div>

        <div className="space-y-4">
          {Object.entries(groupedItems).map(([group, items]) => (
            <div key={group} className="space-y-4">
              {group !== 'OTHER' && (
                <h3 className="text-muted-foreground border-border/60 border-b pb-3 text-sm font-semibold uppercase tracking-wider">
                  {formatGroup(group as BroadcastUnitItemGroup)}
                </h3>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                {items.map((item, index) => (
                  <ItemCard key={index} item={item} group={group} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
