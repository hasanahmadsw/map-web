import Link from 'next/link';
import { cn } from '@/lib/utils';
import { allSolutionKeys } from '@/utils/solution-key-mapping';
import { ArrowRight } from 'lucide-react';

interface StaticSolutionCardProps {
  solutionKey: (typeof allSolutionKeys)[number];
  className?: string;
}

export function StaticSolutionCard({ solutionKey, className }: StaticSolutionCardProps) {
  return (
    <Link
      href={`/solutions/${solutionKey.slug}`}
      className={cn(
        'group glass-card relative block overflow-hidden rounded-xl p-6',
        'flex min-h-[280px] flex-col',
        className,
      )}
    >
      {/* Glass Content Panel */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Icon */}
        <div className="mb-4">
          <div className="bg-primary/10 inline-flex h-12 w-12 items-center justify-center rounded-xl">
            <solutionKey.icon className="h-6 w-6" />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col">
          <h3 className="text-foreground group-hover:text-primary mb-2 line-clamp-2 text-xl font-semibold transition-colors">
            {solutionKey.title}
          </h3>

          <div className="text-muted-foreground mb-4 line-clamp-3 flex-1 text-sm">
            {solutionKey.description}
          </div>

          {/* CTA */}
          <div className="text-primary border-border/50 mt-auto flex items-center border-t pt-4 text-sm font-medium">
            <span>Explore Solution</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 will-change-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}

