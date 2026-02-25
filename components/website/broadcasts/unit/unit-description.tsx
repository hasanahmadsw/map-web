import DivHtml from '@/components/shared/div-html';
import type { BroadcastUnit } from '@/types/broadcasts/broadcasts.types';

interface UnitDescriptionProps {
  description: string;
}

export function UnitDescription({ description }: UnitDescriptionProps) {
  return (
    <section className="mb-16">
      <div className="space-y-6">
        <div>
          <h2 className="mb-2 text-xl font-semibold md:text-2xl">About This Unit</h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Comprehensive overview of this professional broadcast unit
          </p>
        </div>
        <div className="rounded-xl border border-border/60 bg-muted/20 p-4 md:p-6">
          <div className="text-muted-foreground max-w-4xl leading-relaxed">
            <DivHtml html={description} />
          </div>
        </div>
      </div>
    </section>
  );
}
