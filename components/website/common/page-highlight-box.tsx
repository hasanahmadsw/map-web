import type { ReactNode } from 'react';
import { Check } from 'lucide-react';

type HighlightItem = string | { label: string; desc: string };

interface PageHighlightBoxProps {
  title: string;
  description: string;
  items: HighlightItem[];
}

function renderItem(item: HighlightItem): ReactNode {
  if (typeof item === 'string') return item;
  return (
    <>
      <span className="font-medium">{item.label}</span>
      <span className="text-muted-foreground"> — {item.desc}</span>
    </>
  );
}

export function PageHighlightBox({ title, description, items }: PageHighlightBoxProps) {
  return (
    <div className="rounded-xl border border-l-4 border-l-primary bg-muted/20 p-6 md:p-8">
      <h2 className="text-xl font-semibold md:text-2xl tracking-tight">{title}</h2>
      <p className="text-muted-foreground mt-2 text-sm leading-relaxed md:text-base">{description}</p>
      <ul className="mt-6 space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <Check className="text-primary mt-0.5 size-5 shrink-0" />
            <span className="text-sm leading-relaxed">{renderItem(item)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
