import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Radio, ArrowRight } from 'lucide-react';
import { broadcastTypes } from './data';

export function BroadcastsTypesGrid() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-semibold md:text-4xl">Our Broadcast Solutions</h2>
        <p className="text-muted-foreground mt-2 text-base md:text-lg">
          Choose the perfect broadcast system for your production needs
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {broadcastTypes.map(broadcast => {
          const Icon = broadcast.icon;
          return (
            <Link
              key={broadcast.type}
              href={`/broadcasts/${broadcast.slug}`}
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
                  {broadcast.label}
                </h3>

                <p className="text-muted-foreground mb-4 line-clamp-3 flex-1 text-sm leading-relaxed">
                  {broadcast.description}
                </p>

                {/* Features */}
                <div className="mb-4 space-y-2">
                  {broadcast.features.slice(0, 2).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <Radio className="text-primary h-3 w-3 shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="text-primary border-border/50 mt-auto flex items-center border-t pt-4 text-sm font-medium">
                  <span>Explore {broadcast.label}</span>
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
