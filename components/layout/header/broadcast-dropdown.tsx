'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import { BroadcastType } from '@/types/broadcasts/broadcast.enums';
import { renderIcon } from '@/utils/icon-resolver';
import { ArrowRight, Truck, PcCase, RadioTower, TvMinimal, Video } from 'lucide-react';

const broadcastTypes = [
  {
    type: BroadcastType.OBVAN,
    label: 'OBVAN',
    description: 'Outside Broadcast Vans for live events',
    icon: 'Truck',
  },
  {
    type: BroadcastType.FLIGHT_CASE,
    label: 'Flight Cases',
    description: 'Portable broadcast equipment cases',
    icon: 'PcCase',
  },
  {
    type: BroadcastType.SNG,
    label: 'SNG',
    description: 'Satellite News Gathering units',
    icon: 'RadioTower',
  },
  // {
  //   type: BroadcastType.INTERNET_BROADCAST,
  //   label: 'Internet Broadcast',
  //   description: 'Online streaming and broadcasting solutions',
  //   icon: 'TvMinimal',
  // },
  // { type: BroadcastType.OTHER, label: 'Other', description: 'Additional broadcast solutions', icon: 'Video' },
];

export function BroadcastDropdown() {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="hover:text-primary cursor-pointer bg-transparent py-1.5 text-sm whitespace-nowrap min-[1100px]:text-[15px]">
        Broadcast
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="max-h-[calc(100dvh-var(--spacing-navbar-height))] w-80 overflow-y-auto p-2">
          {broadcastTypes.map(broadcast => {
            const typeSlug = broadcast.type.toLowerCase().replace(/_/g, '-');
            return (
              <li key={broadcast.type}>
                <NavigationMenuLink asChild>
                  <Link
                    className="group hover:bg-primary/10 hover:text-foreground focus:bg-primary/10 focus:text-foreground dark:hover:bg-primary/20 dark:focus:bg-primary/20 flex flex-col rounded-md p-3 leading-none no-underline transition-colors outline-none select-none"
                    href={`/broadcasts/${typeSlug}`}
                  >
                    <div className="text-foreground mb-1 flex items-center gap-2 text-xs font-semibold">
                      <span className="text-primary">
                        {renderIcon(broadcast.icon, { size: 15, fallback: 'Video' })}
                      </span>
                      {broadcast.label}
                    </div>
                    {broadcast.description && (
                      <p className="text-muted-foreground line-clamp-2 text-[12px] leading-snug">
                        {broadcast.description}
                      </p>
                    )}
                  </Link>
                </NavigationMenuLink>
              </li>
            );
          })}
          <li className="border-border/50 mt-1 border-t pt-1">
            <NavigationMenuLink asChild>
              <Link
                className="group hover:bg-primary/10 hover:text-foreground focus:bg-primary/10 focus:text-foreground dark:hover:bg-primary/20 dark:focus:bg-primary/20 flex flex-col rounded-md p-3 leading-none no-underline transition-colors outline-none select-none"
                href="/broadcasts"
              >
                <div className="text-foreground mb-1 flex items-center gap-2 text-xs font-semibold">
                  <span className="text-primary">
                    <Video className="h-3.5 w-3.5" />
                  </span>
                  See all
                  <ArrowRight className="ml-auto h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
                <p className="text-muted-foreground text-[11px] leading-snug">Browse all broadcasts</p>
              </Link>
            </NavigationMenuLink>
          </li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
