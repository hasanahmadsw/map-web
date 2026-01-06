import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Radio, ArrowRight, type LucideIcon } from 'lucide-react';

interface GridItem {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  slug: string;
  id: string | number;
}

interface ItemsGridSectionProps {
  title: string;
  description: string;
  items: GridItem[];
  basePath: string;
  ctaText?: (item: GridItem) => string;
  maxFeatures?: number;
}

export function ItemsGridSection({
  title,
  description,
  items,
  basePath,
  ctaText,
  maxFeatures = 2,
}: ItemsGridSectionProps) {
  const getCtaText = (item: GridItem) => {
    if (ctaText) return ctaText(item);
    return `Explore ${item.title}`;
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-semibold md:text-4xl">{title}</h2>
        <p className="text-muted-foreground mt-2 text-base md:text-lg">{description}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map(item => {
          const Icon = item.icon;
          const features = item.features.slice(0, maxFeatures);

          return (
            <Link
              key={item.id}
              href={`${basePath}/${item.slug}`}
              className={cn(
                'group glass-card relative block overflow-hidden rounded-xl p-6',
                'flex min-h-[320px] flex-col transition-all duration-300',
                'hover:scale-[1.02] hover:shadow-lg',
              )}
            >
              {/* Icon */}
              <div className="mb-4">
                <div className="bg-primary/10 group-hover:bg-primary/20 inline-flex h-14 w-14 items-center justify-center rounded-xl transition-colors">
                  <Icon className="text-primary h-7 w-7" />
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col">
                <h3 className="text-foreground group-hover:text-primary mb-3 text-xl font-semibold transition-colors">
                  {item.title}
                </h3>

                <p className="text-muted-foreground mb-4 line-clamp-3 flex-1 text-sm leading-relaxed">
                  {item.description}
                </p>

                {/* Features */}
                {features.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <Radio className="text-primary h-3 w-3 shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA */}
                <div className="text-primary border-border/50 mt-auto flex items-center border-t pt-4 text-sm font-medium">
                  <span>{getCtaText(item)}</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 will-change-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
