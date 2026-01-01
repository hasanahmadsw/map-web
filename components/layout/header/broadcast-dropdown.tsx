'use client';

import * as React from 'react';
import Link from 'next/link';
import { Radio, ArrowRight } from 'lucide-react';
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import { BroadcastType } from '@/types/broadcasts/broadcast.enums';

const broadcastTypes = [
  { type: BroadcastType.OBVAN, label: 'OBVAN', description: 'Outside Broadcast Vans for live events' },
  {
    type: BroadcastType.FLIGHT_CASE,
    label: 'Flight Cases',
    description: 'Portable broadcast equipment cases',
  },
  { type: BroadcastType.SNG, label: 'SNG', description: 'Satellite News Gathering units' },
  {
    type: BroadcastType.INTERNET_BROADCAST,
    label: 'Internet Broadcast',
    description: 'Online streaming and broadcasting solutions',
  },
  { type: BroadcastType.OTHER, label: 'Other', description: 'Additional broadcast solutions' },
];

export function BroadcastDropdown() {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>Broadcast</NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-1">
          {broadcastTypes.map(broadcast => {
            const typeSlug = broadcast.type.toLowerCase().replace(/_/g, '-');
            return (
              <NavigationMenuLink key={broadcast.type} asChild>
                <Link
                  href={`/broadcasts/${typeSlug}`}
                  className="group hover:bg-accent flex items-start gap-3 rounded-lg p-3 transition-colors"
                >
                  <div className="bg-muted group-hover:bg-primary/10 flex h-9 w-9 flex-none items-center justify-center rounded-lg transition-colors">
                    <Radio className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-foreground group-hover:text-primary font-semibold transition-colors">
                      {broadcast.label}
                    </div>
                    <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">{broadcast.description}</p>
                  </div>
                </Link>
              </NavigationMenuLink>
            );
          })}
          <NavigationMenuLink asChild>
            <Link
              href="/broadcasts"
              className="group hover:bg-accent flex items-start gap-3 rounded-lg border-t p-3 pt-3 transition-colors"
            >
              <div className="bg-muted group-hover:bg-primary/10 flex h-9 w-9 flex-none items-center justify-center rounded-lg transition-colors">
                <ArrowRight className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-foreground group-hover:text-primary font-semibold transition-colors">
                  See all
                </div>
                <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">Browse all broadcasts</p>
              </div>
            </Link>
          </NavigationMenuLink>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
