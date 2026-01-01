'use client';

import * as React from 'react';
import Link from 'next/link';
import { Video, ArrowRight } from 'lucide-react';
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
      <NavigationMenuTrigger>Media Production</NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-1">
          {isLoading ? (
            <div className="text-muted-foreground p-4 text-sm">Loading services...</div>
          ) : displayServices.length > 0 ? (
            <>
              {displayServices.map(service => (
                <NavigationMenuLink key={service.id} asChild>
                  <Link
                    href={`/services/${service.slug}`}
                    className="group hover:bg-accent flex items-start gap-3 rounded-lg p-3 transition-colors"
                  >
                    <div className="bg-muted group-hover:bg-primary/10 flex h-9 w-9 flex-none items-center justify-center rounded-lg transition-colors">
                      <Video className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-foreground group-hover:text-primary font-semibold transition-colors">
                        {service.name}
                      </div>
                      <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                        {service.shortDescription || service.description}
                      </p>
                    </div>
                  </Link>
                </NavigationMenuLink>
              ))}
              <NavigationMenuLink asChild>
                <Link
                  href="/solutions/media-production"
                  className="group hover:bg-accent flex items-start gap-3 rounded-lg border-t p-3 pt-3 transition-colors"
                >
                  <div className="bg-muted group-hover:bg-primary/10 flex h-9 w-9 flex-none items-center justify-center rounded-lg transition-colors">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-foreground group-hover:text-primary font-semibold transition-colors">
                      See all
                    </div>
                    <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                      Browse all production services
                    </p>
                  </div>
                </Link>
              </NavigationMenuLink>
            </>
          ) : (
            <div className="text-muted-foreground p-4 text-sm">No services available</div>
          )}
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
