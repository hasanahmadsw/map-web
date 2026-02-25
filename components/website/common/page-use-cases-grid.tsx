interface PageUseCasesGridProps {
  title: string;
  description?: string;
  items: string[];
  cols?: 3 | 4 | 5;
}

export function PageUseCasesGrid({ title, description, items, cols = 4 }: PageUseCasesGridProps) {
  const gridClass =
    cols === 3
      ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
      : cols === 5
        ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5'
        : 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4';

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold md:text-3xl">{title}</h2>
        {description && (
          <p className="text-muted-foreground mt-2 text-base leading-relaxed">{description}</p>
        )}
      </div>
      <div className={gridClass}>
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-center rounded-xl border border-border/60 bg-muted/20 p-4 text-center text-sm font-medium transition-colors hover:bg-muted/30"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
