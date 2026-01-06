import { CheckCircle2 } from 'lucide-react';

interface UseCasesSectionProps {
  title: string;
  description: string;
  useCases: string[];
  gridCols?: '3' | '4';
}

export function UseCasesSection({ title, description, useCases, gridCols = '4' }: UseCasesSectionProps) {
  const gridClass =
    gridCols === '3'
      ? 'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'
      : 'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4';

  return (
    <div className="glass-card rounded-3xl p-8 md:p-12">
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-semibold md:text-4xl">{title}</h2>
          <p className="text-muted-foreground mt-2 text-base md:text-lg">{description}</p>
        </div>

        <div className={gridClass}>
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="group border-border/50 bg-background/50 hover:border-primary/50 hover:bg-primary/5 flex items-center gap-3 rounded-lg border p-4 transition-all duration-200"
            >
              <CheckCircle2 className="text-primary h-5 w-5 shrink-0" />
              <span className="text-sm font-medium">{useCase}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
