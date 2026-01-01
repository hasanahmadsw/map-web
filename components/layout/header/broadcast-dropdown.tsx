'use client';

import Link from 'next/link';
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
      <NavigationMenuTrigger className="hover:text-primary cursor-pointer bg-transparent py-1.5 text-sm whitespace-nowrap min-[1100px]:text-[15px]">
        Broadcast
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="w-80 p-3">
          {broadcastTypes.map(broadcast => {
            const typeSlug = broadcast.type.toLowerCase().replace(/_/g, '-');
            return (
              <li key={broadcast.type}>
                <NavigationMenuLink asChild>
                  <Link
                    className="hover:bg-muted hover:text-accent-foreground flex rounded-md p-3 leading-none no-underline transition-colors outline-none select-none"
                    href={`/broadcasts/${typeSlug}`}
                  >
                    <div>
                      <div className="text-sm font-semibold">{broadcast.label}</div>
                      {broadcast.description && (
                        <p className="text-muted-foreground line-clamp-2 text-xs leading-snug">
                          {broadcast.description}
                        </p>
                      )}
                    </div>
                  </Link>
                </NavigationMenuLink>
              </li>
            );
          })}
          <li>
            <NavigationMenuLink asChild>
              <Link
                className="hover:bg-muted hover:text-accent-foreground flex rounded-md p-3 leading-none no-underline transition-colors outline-none select-none"
                href="/broadcasts"
              >
                <div>
                  <div className="text-sm font-semibold">See all</div>
                  <p className="text-muted-foreground line-clamp-2 text-xs leading-snug">
                    Browse all broadcasts
                  </p>
                </div>
              </Link>
            </NavigationMenuLink>
          </li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}
