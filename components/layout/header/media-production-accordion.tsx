'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronDown, Film } from 'lucide-react';
import { cn } from '@/lib/utils';
import { servicesService } from '@/services/services.service';
import { SolutionKey } from '@/types/solution-key.enum';
import type { ServiceResponse } from '@/types/services.types';
import { SheetClose } from '@/components/ui/sheet';

interface MobileMediaProductionAccordionProps {
  onLinkClick?: () => void;
}

export function MobileMediaProductionAccordion({ onLinkClick }: MobileMediaProductionAccordionProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [services, setServices] = React.useState<ServiceResponse[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchServices() {
      try {
        const response = await servicesService.getAll({
          solutionKey: SolutionKey.PRODUCTION,
          isPublished: true,
          limit: 100,
        });
        setServices(response.data || []);
      } catch (error) {
        console.error('Failed to fetch production services:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchServices();
  }, []);

  const handleLinkClick = () => {
    onLinkClick?.();
    setIsOpen(false);
  };

  return (
    <div className="space-y-1.5">
      <button
        className={cn(
          'group flex w-full cursor-pointer items-center justify-between rounded-lg px-4 py-3.5',
          'bg-accent/30 hover:bg-accent hover:text-primary',
          'border border-transparent hover:border-accent-foreground/10',
          'text-sm font-semibold transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20',
          isOpen && 'bg-accent text-primary border-accent-foreground/10',
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="media-production-accordion-content"
      >
        <div className="flex items-center gap-2.5">
          <Film className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          <span>Media Production</span>
        </div>
        <ChevronDown
          className={cn(
            'h-4 w-4 flex-none text-muted-foreground transition-all duration-300 ease-in-out',
            isOpen ? 'rotate-180 text-primary' : 'group-hover:text-primary',
          )}
          aria-hidden="true"
        />
      </button>
      <div
        id="media-production-accordion-content"
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="space-y-0.5 pl-4 pr-2 pt-1">
          {isLoading ? (
            <div className="text-muted-foreground px-3 py-3 text-sm flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-pulse" />
              <span>Loading...</span>
            </div>
          ) : services.length > 0 ? (
            <>
              {services.map(service => (
                <SheetClose key={service.id} asChild>
                  <Link
                    href={`/services/${service.slug}`}
                    onClick={handleLinkClick}
                    className={cn(
                      'group flex items-center gap-3 rounded-md px-3 py-2.5',
                      'text-sm font-medium leading-6',
                      'hover:bg-accent hover:text-primary',
                      'border border-transparent hover:border-accent-foreground/10',
                      'transition-all duration-150',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20',
                    )}
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 group-hover:bg-primary transition-colors" />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium">{service.name}</div>
                    </div>
                  </Link>
                </SheetClose>
              ))}
              <div className="pt-1.5 mt-1.5 border-t border-border/50">
                <SheetClose asChild>
                  <Link
                    href="/solutions/media-production"
                    onClick={handleLinkClick}
                    className={cn(
                      'group flex items-center gap-3 rounded-md px-3 py-2.5',
                      'text-sm font-semibold leading-6',
                      'hover:bg-accent hover:text-primary',
                      'border border-transparent hover:border-accent-foreground/10',
                      'transition-all duration-150',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20',
                    )}
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-primary/60 group-hover:bg-primary transition-colors" />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold">See all</div>
                      <p className="text-muted-foreground line-clamp-2 mt-0.5 text-xs leading-snug font-normal">
                        Browse all production services
                      </p>
                    </div>
                  </Link>
                </SheetClose>
              </div>
            </>
          ) : (
            <div className="text-muted-foreground px-3 py-3 text-sm flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
              <span>No services available</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
