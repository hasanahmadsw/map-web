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
          <h2 className="mb-2 text-3xl font-semibold md:text-4xl">About This Unit</h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Comprehensive overview of this professional broadcast unit
          </p>
        </div>
        <div className="glass-card rounded-xl border p-8 md:p-10">
          <div className="text-muted-foreground max-w-4xl leading-relaxed">
            <DivHtml html={description} />
          </div>
        </div>
      </div>
    </section>
  );
}
