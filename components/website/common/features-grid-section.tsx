interface FeatureItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color?: string;
}

interface FeaturesGridSectionProps {
  title: string;
  description: string;
  items: FeatureItem[];
  gridCols?: '2' | '3';
  hoverScale?: '1.01' | '1.02';
  iconColor?: 'primary' | 'custom';
}

export function FeaturesGridSection({
  title,
  description,
  items,
  gridCols = '3',
  hoverScale = '1.02',
  iconColor = 'primary',
}: FeaturesGridSectionProps) {
  const gridClass =
    gridCols === '2'
      ? 'grid grid-cols-1 gap-6 md:grid-cols-2'
      : 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3';
  const scaleClass = hoverScale === '1.01' ? 'hover:scale-[1.01]' : 'hover:scale-[1.02]';

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-semibold md:text-4xl">{title}</h2>
        <p className="text-muted-foreground mt-2 text-base md:text-lg">{description}</p>
      </div>

      <div className={gridClass}>
        {items.map((item, index) => {
          const Icon = item.icon;
          const iconClassName =
            iconColor === 'custom' && item.color ? `${item.color} h-6 w-6` : 'text-primary h-6 w-6';

          return (
            <div
              key={index}
              className={`group glass-card relative overflow-hidden rounded-xl p-6 transition-all duration-300 ${scaleClass} hover:shadow-lg`}
            >
              <div className="space-y-4">
                <div className="bg-primary/10 group-hover:bg-primary/20 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-colors">
                  <Icon className={iconClassName} />
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
