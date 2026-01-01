'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { allSolutionKeys } from '@/utils/solution-key-mapping';

interface SolutionsDropdownProps {
  onLinkClick?: () => void;
}

export function SolutionsDropdown({ onLinkClick }: SolutionsDropdownProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  // Show first 3 solutions in dropdown
  const solutions = allSolutionKeys.slice(0, 3);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href="/solutions"
        className="text-foreground hover:text-primary flex items-center gap-x-1 text-sm leading-6 font-medium transition-colors"
      >
        Solutions
        <ChevronDown
          className={cn('h-4 w-4 transition-transform duration-200', isHovered ? 'rotate-180' : '')}
        />
      </Link>

      {/* Bridge area to prevent gap from breaking hover */}
      {isHovered && <div className="absolute top-full left-1/2 h-4 w-full -translate-x-1/2" />}

      {/* Desktop Dropdown */}
      <div
        className={cn(
          'absolute left-1/2 z-50 mt-4 w-screen max-w-md -translate-x-1/2 px-4 transition-all duration-200',
          isHovered
            ? 'pointer-events-auto visible translate-y-0 opacity-100'
            : 'pointer-events-none invisible -translate-y-2 opacity-0',
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="bg-popover/95 ring-border overflow-hidden rounded-2xl shadow-lg ring-1 backdrop-blur-xl">
          <div className="from-primary/5 to-primary/5 relative bg-linear-to-br via-transparent">
            <div className="relative grid gap-2 p-3">
              {solutions.map(solution => (
                <Link
                  key={solution.key}
                  href={`/solutions/${solution.slug}`}
                  onClick={onLinkClick}
                  className="group hover:bg-accent relative flex items-center gap-x-4 rounded-lg p-2.5 text-sm leading-6 transition-colors"
                >
                  <div className="bg-muted group-hover:bg-primary/10 flex h-9 w-9 flex-none items-center justify-center rounded-lg transition-colors">
                    <solution.icon className="h-[18px] w-[18px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-foreground group-hover:text-primary font-semibold transition-colors">
                      {solution.title}
                      <span className="absolute inset-0" />
                    </div>
                    <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs">
                      {solution.description}
                    </p>
                  </div>
                </Link>
              ))}
              <Link
                href="/solutions"
                onClick={onLinkClick}
                className="group hover:bg-accent relative flex items-center gap-x-4 rounded-lg border-t p-2.5 pt-2.5 text-sm leading-6 transition-colors"
              >
                <div className="bg-muted group-hover:bg-primary/10 flex h-9 w-9 flex-none items-center justify-center rounded-lg transition-colors">
                  <ArrowRight className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-foreground group-hover:text-primary font-semibold transition-colors">
                    See all
                    <span className="absolute inset-0" />
                  </div>
                  <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs">Browse all solutions</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MobileSolutionsAccordionProps {
  onLinkClick?: () => void;
}

export function MobileSolutionsAccordion({ onLinkClick }: MobileSolutionsAccordionProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const solutions = allSolutionKeys;

  return (
    <div className="space-y-2">
      <button
        className="text-foreground hover:text-primary hover:bg-accent flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base leading-7 font-semibold transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        Solutions
        <ChevronDown
          className={cn('h-5 w-5 flex-none transition-transform duration-200', isOpen ? 'rotate-180' : '')}
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
          {solutions.map(solution => (
            <Link
              key={solution.key}
              href={`/solutions/${solution.slug}`}
              onClick={onLinkClick}
              className="group text-muted-foreground hover:text-foreground hover:bg-accent flex gap-x-2 rounded-md p-1.5 text-sm leading-6 font-semibold transition-colors"
            >
              <span className="border-border bg-muted flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border">
                <solution.icon className="h-3 w-3" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-semibold">{solution.title}</div>
                <p className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">{solution.description}</p>
              </div>
            </Link>
          ))}
          <Link
            href="/solutions"
            onClick={onLinkClick}
            className="group text-muted-foreground hover:text-foreground hover:bg-accent mt-1 flex gap-x-2 rounded-md border-t p-1.5 pt-1.5 text-sm leading-6 font-semibold transition-colors"
          >
            <span className="border-border bg-muted flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border">
              <ArrowRight className="h-3 w-3" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="font-semibold">See all</div>
              <p className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">Browse all solutions</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
