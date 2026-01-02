'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import { servicesService } from '@/services/services.service';
import { SolutionKey } from '@/types/solution-key.enum';
import type { ServiceResponse } from '@/types/services.types';
import { renderIcon } from '@/utils/icon-resolver';
import { ArrowRight, Video } from 'lucide-react';

export function MediaProductionDropdown() {
  const [services, setServices] = React.useState<ServiceResponse[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchServices() {
      try {
        const response = await servicesService.getAll({
          solutionKey: SolutionKey.PRODUCTION,
          isPublished: true,
          limit: 6,
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

  const displayServices = services.slice(0, 5);

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="hover:text-primary cursor-pointer bg-transparent py-1.5 text-sm whitespace-nowrap min-[1100px]:text-[15px]">
        Media Production
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="max-h-[calc(100dvh-var(--spacing-navbar-height))] w-80 overflow-y-auto p-2">
          {isLoading ? (
            <li>
              <div className="text-muted-foreground p-3 text-sm">Loading services...</div>
            </li>
          ) : displayServices.length > 0 ? (
            <>
              {displayServices.map(service => (
                <li key={service.id}>
                  <NavigationMenuLink asChild>
                    <Link
                      className="group hover:bg-primary/10 hover:text-foreground focus:bg-primary/10 focus:text-foreground dark:hover:bg-primary/20 dark:focus:bg-primary/20 flex flex-col rounded-md p-3 leading-none no-underline transition-colors outline-none select-none"
                      href={`/services/${service.slug}`}
                    >
                      <div className="text-foreground mb-1 flex items-center gap-2 text-xs font-semibold">
                        <span className="text-primary">
                          {renderIcon(service.icon, { size: 15, fallback: 'Video' })}
                        </span>
                        {service.name}
                      </div>
                      {(service.shortDescription || service.description) && (
                        <p className="text-muted-foreground line-clamp-2 text-[12px] leading-snug">
                          {service.shortDescription || service.description}
                        </p>
                      )}
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
              <li className="border-border/50 mt-1 border-t pt-1">
                <NavigationMenuLink asChild>
                  <Link
                    className="group hover:bg-primary/10 hover:text-foreground focus:bg-primary/10 focus:text-foreground dark:hover:bg-primary/20 dark:focus:bg-primary/20 flex flex-col rounded-md p-3 leading-none no-underline transition-colors outline-none select-none"
                    href="/solutions/media-production"
                  >
                    <div className="text-foreground mb-1 flex items-center gap-2 text-xs font-semibold">
                      <span className="text-primary">
                        <Video className="h-3.5 w-3.5" />
                      </span>
                      See all
                      <ArrowRight className="ml-auto h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <p className="text-muted-foreground text-[11px] leading-snug">
                      Browse all production services
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
            </>
          ) : (
            <li>
              <div className="text-muted-foreground p-3 text-sm">No services available</div>
            </li>
          )}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
