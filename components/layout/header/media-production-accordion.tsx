'use client'

import * as React from 'react'
import Link from 'next/link'
import { ChevronDown, Video, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { servicesService } from '@/services/services.service'
import { SolutionKey } from '@/types/solution-key.enum'
import type { ServiceResponse } from '@/types/services.types'
import { SheetClose } from '@/components/ui/sheet'

interface MobileMediaProductionAccordionProps {
  onLinkClick?: () => void
}

export function MobileMediaProductionAccordion({ onLinkClick }: MobileMediaProductionAccordionProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [services, setServices] = React.useState<ServiceResponse[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchServices() {
      try {
        const response = await servicesService.getAll({
          solutionKey: SolutionKey.PRODUCTION,
          isPublished: true,
          limit: 100,
        })
        setServices(response.data || [])
      } catch (error) {
        console.error('Failed to fetch production services:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchServices()
  }, [])

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
        <span className="font-semibold">Media Production</span>
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
          {isLoading ? (
            <div className="text-muted-foreground p-2 text-sm">Loading...</div>
          ) : services.length > 0 ? (
            <>
              {services.map(service => (
                <SheetClose key={service.id} asChild>
                  <Link
                    href={`/services/${service.slug}`}
                    onClick={handleLinkClick}
                    className="group text-muted-foreground hover:text-foreground hover:bg-accent flex gap-x-2 rounded-md p-1.5 text-sm leading-6 font-semibold transition-colors"
                  >
                    <span className="border-border bg-muted flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border">
                      <Video className="h-3 w-3" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold">{service.name}</div>
                      <p className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">
                        {service.shortDescription || service.description}
                      </p>
                    </div>
                  </Link>
                </SheetClose>
              ))}
              <SheetClose asChild>
                <Link
                  href="/solutions/media-production"
                  onClick={handleLinkClick}
                  className="group text-muted-foreground hover:text-foreground hover:bg-accent mt-1 flex gap-x-2 rounded-md border-t p-1.5 pt-1.5 text-sm leading-6 font-semibold transition-colors"
                >
                  <span className="border-border bg-muted flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border">
                    <ArrowRight className="h-3 w-3" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold">See all</div>
                    <p className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">
                      Browse all production services
                    </p>
                  </div>
                </Link>
              </SheetClose>
            </>
          ) : (
            <div className="text-muted-foreground p-2 text-sm">No services available</div>
          )}
        </div>
      </div>
    </div>
  )
}

