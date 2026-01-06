import { CheckCircle2 } from 'lucide-react';

interface FeaturesListSectionProps {
  title: string;
  description: string;
  features: string[];
  gridCols?: '2' | '3';
}

export function FeaturesListSection({
  title,
  description,
  features,
  gridCols = '3',
}: FeaturesListSectionProps) {
  const gridClass =
    gridCols === '2'
      ? 'grid grid-cols-1 gap-4 md:grid-cols-2'
      : 'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3';

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-semibold md:text-4xl">{title}</h2>
        <p className="text-muted-foreground mt-2 text-base md:text-lg">{description}</p>
      </div>

      <div className={gridClass}>
        {features.map((feature, index) => (
          <div
            key={index}
            className="group glass-card border-border/50 hover:border-primary/50 hover:bg-primary/5 flex items-center gap-3 rounded-lg border p-4 transition-all duration-200"
          >
            <CheckCircle2 className="text-primary h-5 w-5 shrink-0" />
            <span className="text-sm font-medium">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

