'use client'

import * as React from 'react'
import Link from 'next/link'
import { ChevronDown, Radio, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { BroadcastType } from '@/types/broadcasts/broadcast.enums'
import { SheetClose } from '@/components/ui/sheet'

interface MobileBroadcastAccordionProps {
  onLinkClick?: () => void
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
]

export function MobileBroadcastAccordion({ onLinkClick }: MobileBroadcastAccordionProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleLinkClick = () => {
    onLinkClick?.()
    setIsOpen(false)
  }

  return (
    <div className="space-y-2">
      <button
        className="hover:text-primary hover:bg-accent flex w-full items-center justify-between rounded-lg p-3 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold">Broadcast</span>
        <ChevronDown
          className={cn('h-4 w-4 flex-none transition-transform duration-200', isOpen ? 'rotate-180' : '')}
          aria-hidden="true"
        />
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-200',
          isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="space-y-1 pl-6">
          {broadcastTypes.map(broadcast => (
            <SheetClose key={broadcast.type} asChild>
              <Link
                href={`/broadcasts?type=${broadcast.type}`}
                onClick={handleLinkClick}
                className="group text-muted-foreground hover:text-foreground hover:bg-accent flex gap-x-2 rounded-md p-1.5 text-sm leading-6 font-semibold transition-colors"
              >
                <span className="border-border bg-muted flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border">
                  <Radio className="h-3 w-3" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold">{broadcast.label}</div>
                  <p className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">{broadcast.description}</p>
                </div>
              </Link>
            </SheetClose>
          ))}
          <SheetClose asChild>
            <Link
              href="/broadcasts"
              onClick={handleLinkClick}
              className="group text-muted-foreground hover:text-foreground hover:bg-accent mt-1 flex gap-x-2 rounded-md border-t p-1.5 pt-1.5 text-sm leading-6 font-semibold transition-colors"
            >
              <span className="border-border bg-muted flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border">
                <ArrowRight className="h-3 w-3" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-semibold">See all</div>
                <p className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">Browse all broadcasts</p>
              </div>
            </Link>
          </SheetClose>
        </div>
      </div>
    </div>
  )
}

