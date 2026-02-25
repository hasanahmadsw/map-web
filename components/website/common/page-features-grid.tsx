import type { LucideIcon } from 'lucide-react';

export interface PageFeatureItem {
  icon: LucideIcon;
  title: string;
  description?: string;
  desc?: string; // alias used in broadcasting data
}

interface PageFeaturesGridProps {
  title: string;
  description?: string;
  items: PageFeatureItem[];
  cols?: 2 | 3 | 4;
}

export function PageFeaturesGrid({
  title,
  description,
  items,
  cols = 3,
}: PageFeaturesGridProps) {
  const gridClass =
    cols === 2
      ? 'grid grid-cols-1 gap-6 sm:grid-cols-2'
      : cols === 4
        ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'
        : 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold md:text-2xl tracking-tight">{title}</h2>
        {description && (
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed md:text-base">{description}</p>
        )}
      </div>
      <div className={gridClass}>
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="rounded-xl border border-border/60 bg-muted/20 p-6 transition-colors hover:bg-muted/30"
            >
              <Icon className="text-primary mb-4 size-8" />
              <h3 className="font-semibold tracking-tight">{item.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{item.description ?? item.desc ?? ''}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
