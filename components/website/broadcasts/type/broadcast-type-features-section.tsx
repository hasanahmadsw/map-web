import { CheckCircle2 } from 'lucide-react';

interface BroadcastTypeFeaturesSectionProps {
  badgeText: string;
  features: string[];
}

export function BroadcastTypeFeaturesSection({ badgeText, features }: BroadcastTypeFeaturesSectionProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-semibold md:text-4xl">Key Features</h2>
        <p className="text-muted-foreground mt-2 text-base md:text-lg">
          What makes our {badgeText} units exceptional
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
