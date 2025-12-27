import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { ServiceResponse } from '@/types/services.types';
import DivHtml from '@/components/shared/div-html';
import { ArrowRight } from 'lucide-react';
import { renderIcon } from '@/utils/icon-resolver';

interface ServiceCardProps {
  service: ServiceResponse;
  className?: string;
}

export function ServiceCard({ service, className }: ServiceCardProps) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className={cn('group glass-card relative block overflow-hidden rounded-xl', 'flex flex-col', className)}
    >
      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        {/* Icon */}
        <div className="mb-4">
          <div className="bg-primary/10 inline-flex h-12 w-12 items-center justify-center rounded-xl">
            {renderIcon(service.icon, { size: 24, fallback: 'Video' })}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col">
          <h3 className="text-foreground group-hover:text-primary mb-2 line-clamp-2 text-xl font-semibold transition-colors">
            {service.name}
          </h3>

          {service.shortDescription && (
            <div className="text-muted-foreground mb-4 line-clamp-3 flex-1 text-sm">
              <DivHtml html={service.shortDescription} />
            </div>
          )}

          {/* CTA */}
          <div className="text-primary border-border/50 mt-auto flex items-center border-t pt-4 text-sm font-medium">
            <span>Learn More</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 will-change-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
