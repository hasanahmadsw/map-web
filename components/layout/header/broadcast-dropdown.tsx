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

const broadcastTypes = [
  {
    type: 'overview',
    label: 'Overview',
    description: 'Browse all broadcast solutions and production services',
    icon: 'TvMinimal',
    href: '/broadcasting',
  },
  {
    type: BroadcastType.OBVAN,
    label: 'Outside Broadcast',
    description: 'Outside Broadcast Vans for live events',
    icon: 'Truck',
    href: '/broadcasting/outside-broadcast',
  },
  {
    type: BroadcastType.FLIGHT_CASE,
    label: 'Portable Broadcast',
    description: 'Portable broadcast equipment cases',
    icon: 'PcCase',
    href: '/broadcasting/portable-broadcast-systems',
  },
];

export function BroadcastDropdown() {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="hover:text-primary cursor-pointer bg-transparent py-1.5 text-sm whitespace-nowrap min-[1100px]:text-[15px]">
        Broadcast
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="max-h-[calc(100dvh-var(--spacing-navbar-height))] w-80 overflow-y-auto p-2">
          {broadcastTypes.map(broadcast => (
            <li key={broadcast.type}>
              <NavigationMenuLink asChild>
                <Link
                  className="group hover:bg-primary/10 hover:text-foreground focus:bg-primary/10 focus:text-foreground dark:hover:bg-primary/20 dark:focus:bg-primary/20 flex flex-col rounded-md p-3 leading-none no-underline transition-colors outline-none select-none"
                  href={broadcast.href}
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
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
