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
        <ul className="w-80 p-3">
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
                      className="hover:bg-muted hover:text-accent-foreground flex rounded-md p-3 leading-none no-underline transition-colors outline-none select-none"
                      href={`/services/${service.slug}`}
                    >
                      <div>
                        <div className="text-sm font-semibold">{service.name}</div>
                        {(service.shortDescription || service.description) && (
                          <p className="text-muted-foreground line-clamp-2 text-xs leading-snug">
                            {service.shortDescription || service.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    className="hover:bg-muted hover:text-accent-foreground flex rounded-md p-3 leading-none no-underline transition-colors outline-none select-none"
                    href="/solutions/media-production"
                  >
                    <div>
                      <div className="text-sm font-semibold">See all</div>
                      <p className="text-muted-foreground text-xs leading-snug">
                        Browse all production services
                      </p>
                    </div>
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
