'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronDown, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BroadcastType } from '@/types/broadcasts/broadcast.enums';
import { SheetClose } from '@/components/ui/sheet';

interface MobileBroadcastAccordionProps {
  onLinkClick?: () => void;
}

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

export function MobileBroadcastAccordion({ onLinkClick }: MobileBroadcastAccordionProps) {
  const [isOpen, setIsOpen] = React.useState(false);

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
          'hover:border-accent-foreground/10 border border-transparent',
          'text-sm font-semibold transition-all duration-200',
          'focus-visible:ring-primary/20 focus-visible:ring-2 focus-visible:outline-none',
          isOpen && 'bg-accent text-primary border-accent-foreground/10',
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="broadcast-accordion-content"
      >
        <div className="flex items-center gap-2.5">
          <Radio className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-colors" />
          <span>Broadcast</span>
        </div>
        <ChevronDown
          className={cn(
            'text-muted-foreground h-4 w-4 flex-none transition-all duration-300 ease-in-out',
            isOpen ? 'text-primary rotate-180' : 'group-hover:text-primary',
          )}
          aria-hidden="true"
        />
      </button>
      <div
        id="broadcast-accordion-content"
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="space-y-0.5 pt-1 pr-2 pl-4">
          {broadcastTypes.map((broadcast, index) => (
            <SheetClose key={broadcast.type} asChild>
              <Link
                href={`/broadcasts?type=${broadcast.type}`}
                onClick={handleLinkClick}
                className={cn(
                  'group flex items-center gap-3 rounded-md px-3 py-2.5',
                  'text-sm leading-6 font-medium',
                  'hover:bg-accent hover:text-primary',
                  'hover:border-accent-foreground/10 border border-transparent',
                  'transition-all duration-150',
                  'focus-visible:ring-primary/20 focus-visible:ring-2 focus-visible:outline-none',
                )}
              >
                <div className="bg-muted-foreground/40 group-hover:bg-primary h-1.5 w-1.5 rounded-full transition-colors" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{broadcast.label}</div>
                </div>
              </Link>
            </SheetClose>
          ))}
          <div className="border-border/50 mt-1.5 border-t pt-1.5">
            <SheetClose asChild>
              <Link
                href="/broadcasts"
                onClick={handleLinkClick}
                className={cn(
                  'group flex items-center gap-3 rounded-md px-3 py-2.5',
                  'text-sm leading-6 font-semibold',
                  'hover:bg-accent hover:text-primary',
                  'hover:border-accent-foreground/10 border border-transparent',
                  'transition-all duration-150',
                  'focus-visible:ring-primary/20 focus-visible:ring-2 focus-visible:outline-none',
                )}
              >
                <div className="bg-primary/60 group-hover:bg-primary h-1.5 w-1.5 rounded-full transition-colors" />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold">See all</div>
                  <p className="text-muted-foreground mt-0.5 line-clamp-1 text-xs font-normal">
                    Browse all broadcasts
                  </p>
                </div>
              </Link>
            </SheetClose>
          </div>
        </div>
      </div>
    </div>
  );
}
