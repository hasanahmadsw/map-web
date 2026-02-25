import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { broadcastingInfrastructure } from './home-page.data';

export function BroadcastingInfrastructureSection() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold md:text-2xl tracking-tight">
          Broadcasting Infrastructure
        </h2>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed md:text-base">
          Professional OB vans, portable broadcast units, and multi-camera live production for events and broadcasts.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {broadcastingInfrastructure.map((item, i) => {
          const Icon = item.icon;
          return (
            <Link
              key={i}
              href={item.href}
              className="group rounded-xl border border-border/60 bg-muted/20 p-6 transition-colors hover:bg-muted/30"
            >
              <Icon className="text-primary mb-4 size-8" />
              <h3 className="font-semibold tracking-tight group-hover:text-primary">{item.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{item.description}</p>
              <span className="text-primary mt-4 inline-flex items-center gap-2 text-sm font-medium">
                Learn more
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
