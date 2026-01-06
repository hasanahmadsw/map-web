import { Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { BroadCastUnitSpecs } from '@/types/broadcasts/broadcasts.types';

interface UnitSpecificationsProps {
  specs: BroadCastUnitSpecs;
}

export function UnitSpecifications({ specs }: UnitSpecificationsProps) {
  const formatSpecValue = (val: unknown): string => {
    if (Array.isArray(val)) {
      return val.join(', ');
    }
    if (typeof val === 'object' && val !== null) {
      return JSON.stringify(val, null, 2);
    }
    return String(val);
  };

  return (
    <section className="mb-16">
      <div className="space-y-6">
        <div>
          <h2 className="mb-2 text-3xl font-semibold md:text-4xl">Specifications</h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Technical specifications and details of this broadcast unit
          </p>
        </div>
        <div className="glass-card overflow-hidden rounded-xl border">
          <div className="divide-y">
            {(Object.entries(specs) as [keyof BroadCastUnitSpecs, unknown][]).map(
              ([key, value]) => {
                const formattedKey = key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, str => str.toUpperCase())
                  .trim();

                const displayValue = formatSpecValue(value);
                const isArrayValue = Array.isArray(value);

                return (
                  <div key={key} className="hover:bg-muted/30 p-6 transition-colors md:p-8">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="md:col-span-1">
                        <div className="flex items-center gap-2">
                          <div className="bg-primary/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                            <Info className="text-primary h-4 w-4" />
                          </div>
                          <p className="text-foreground font-semibold">{formattedKey}</p>
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        {isArrayValue && value.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {(value as string[]).map((item, idx) => (
                              <Badge key={idx} variant="secondary" className="font-normal">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        ) : typeof value === 'object' && value !== null && !isArrayValue ? (
                          <pre className="text-muted-foreground bg-muted/50 rounded-lg p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                            {displayValue}
                          </pre>
                        ) : (
                          <p className="text-foreground text-sm leading-relaxed md:text-base">
                            {displayValue}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

