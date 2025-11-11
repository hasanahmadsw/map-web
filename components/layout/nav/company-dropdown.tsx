"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronDown, Building2, UserCircle, Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLang } from "@/hooks/useLang"

interface CompanyDropdownProps {
  onLinkClick?: () => void
}

const companyItems = [
  {
    title: "About",
    href: "/about",
    icon: Building2,
    description: "Learn more about our company and mission",
  },
  {
    title: "Careers",
    href: "/careers",
    icon: UserCircle,
    description: "Join our team and grow your career",
  },
  {
    title: "Contact",
    href: "/contact",
    icon: Mail,
    description: "Get in touch with our team",
  },
]

export function CompanyDropdown({ onLinkClick }: CompanyDropdownProps) {
  const lang = useLang()
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/${lang}/about`}
        className="flex items-center gap-x-1 text-sm font-medium leading-6 text-foreground transition-colors hover:text-primary"
      >
        Company
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isHovered ? "rotate-180" : ""
          )}
        />
      </Link>

      {/* Bridge area to prevent gap from breaking hover */}
      {isHovered && (
        <div className="absolute left-1/2 -translate-x-1/2 w-full h-4 top-full" />
      )}

      {/* Desktop Dropdown */}
      <div
        className={cn(
          "absolute left-1/2 z-50 mt-4 w-screen max-w-md -translate-x-1/2 px-4 transition-all duration-200",
          isHovered
            ? "opacity-100 visible translate-y-0 pointer-events-auto"
            : "opacity-0 invisible -translate-y-2 pointer-events-none"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="overflow-hidden rounded-2xl bg-popover/95 backdrop-blur-xl shadow-lg ring-1 ring-border">
          <div className="relative bg-gradient-to-br from-primary/5 via-transparent to-primary/5">
            <div className="relative grid gap-2 p-3">
              {companyItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.title}
                    href={`/${lang}${item.href}`}
                    onClick={onLinkClick}
                    className="group relative flex items-center gap-x-4 rounded-lg p-2.5 text-sm leading-6 hover:bg-accent transition-colors"
                  >
                    <div className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                      <Icon className="h-4 w-4 text-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                        <span className="absolute inset-0" />
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface MobileCompanyAccordionProps {
  onLinkClick?: () => void
}

export function MobileCompanyAccordion({ onLinkClick }: MobileCompanyAccordionProps) {
  const lang = useLang()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="space-y-2">
      <button
        className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-foreground hover:text-primary hover:bg-accent transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        Company
        <ChevronDown
          className={cn(
            "h-5 w-5 flex-none transition-transform duration-200",
            isOpen ? "rotate-180" : ""
          )}
          aria-hidden="true"
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="space-y-1 pl-6">
          {companyItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.title}
                href={`/${lang}${item.href}`}
                onClick={onLinkClick}
                className="group flex gap-x-2 rounded-md p-1.5 text-sm font-semibold leading-6 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border border-border bg-muted">
                  <Icon className="h-3 w-3" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{item.title}</div>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                    {item.description}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

