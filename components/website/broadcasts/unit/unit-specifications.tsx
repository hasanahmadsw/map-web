import type { BroadCastUnitSpecs } from '@/types/broadcasts/broadcasts.types';

interface UnitSpecificationsProps {
  specs: BroadCastUnitSpecs;
}

export function UnitSpecifications({ specs }: UnitSpecificationsProps) {
  const formatSpecValue = (val: unknown): string => {
    if (Array.isArray(val)) return val.join(', ');
    if (typeof val === 'object' && val !== null) return JSON.stringify(val, null, 2);
    return String(val);
  };

  const entries = Object.entries(specs) as [keyof BroadCastUnitSpecs, unknown][];

  return (
    <section>
      <div className="space-y-6">
        <div>
          <h2 className="mb-2 text-xl font-semibold md:text-2xl">Specifications</h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Technical specifications and details of this broadcast unit
          </p>
        </div>

        <dl className="space-y-0">
          {entries.map(([key, value], index) => {
            const formattedKey = key
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase())
              .trim();
            const displayValue = formatSpecValue(value);
            const isArray = Array.isArray(value);
            const hasArrayItems = isArray && (value as unknown[]).length > 0;
            const isLast = index === entries.length - 1;

            return (
              <div
                key={key}
                className={`flex flex-col gap-2 py-4 sm:flex-row sm:items-start sm:gap-8 sm:py-4 ${!isLast ? 'border-b border-border/50' : ''
                  }`}
              >
                <dt className="text-muted-foreground min-w-[140px] shrink-0 text-sm font-medium">
                  {formattedKey}
                </dt>
                <dd className="min-w-0 flex-1">
                  {hasArrayItems ? (
                    <ul className="flex flex-wrap gap-2">
                      {(value as string[]).map((item, idx) => (
                        <li
                          key={idx}
                          className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium"
                        >
                          <span className="bg-primary/30 h-1.5 w-1.5 shrink-0 rounded-full" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : typeof value === 'object' && value !== null && !isArray ? (
                    <pre className="text-muted-foreground max-w-full overflow-x-auto rounded-lg bg-muted/40 p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                      {displayValue}
                    </pre>
                  ) : (
                    <p className="text-foreground text-xs font-medium leading-relaxed sm:text-sm">
                      {displayValue}
                    </p>
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
