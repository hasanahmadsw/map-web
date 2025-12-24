'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import { ArrowRight, Search, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Navigate to services page with search query
    router.push(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pb-16 md:px-0 md:py-24">
      {/* Grid Pattern Overlay */}
      <div className="bg-pattern-grid-large pointer-events-none absolute inset-0 opacity-40" />

      {/* Gradient Overlay */}
      {/* <div className="bg-pattern-overlay pointer-events-none absolute inset-0" /> */}

      {/* Content */}
      <div className="pt-edge-nav-margin relative z-10 container flex max-w-7xl flex-col items-center justify-center">
        <div className="space-y-8 text-center">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="mx-auto max-w-5xl text-4xl leading-tight font-bold tracking-tight md:text-6xl md:leading-[1.1] lg:text-7xl">
              <span className="from-foreground via-foreground to-foreground/70 bg-linear-to-r bg-clip-text text-transparent">
                Media Production and
              </span>
              <br />
              <span className="from-primary via-primary/90 to-primary/70 bg-linear-to-r bg-clip-text text-transparent">
                Broadcasting Solutions
              </span>
            </h1>
            <p className="text-muted-foreground mx-auto max-w-2xl text-base md:text-lg lg:text-xl">
              Discover our comprehensive range of media production and broadcasting solutions, designed to
              meet the unique needs of businesses and organizations worldwide.
            </p>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearch} className="mx-auto w-full max-w-2xl pt-4">
            <div
              className={cn(
                'glass-card group relative flex items-center gap-3 rounded-2xl p-1 transition-all duration-300',
                isFocused && 'ring-primary/20 shadow-primary/5 shadow-lg ring-2',
              )}
            >
              <div className="flex flex-1 items-center gap-3 px-4 py-3">
                <Search
                  className={cn(
                    'h-5 w-5 shrink-0 transition-colors duration-200',
                    isFocused ? 'text-primary' : 'text-muted-foreground',
                  )}
                />
                <Input
                  type="search"
                  placeholder="Search solutions, services, equipment..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="h-auto border-0 bg-transparent p-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0 md:text-lg"
                />
              </div>
              <button
                type="submit"
                className={cn(
                  'glass-button mr-1 rounded-xl px-6 py-3 text-sm font-medium transition-all duration-200 md:px-8',
                  searchQuery.trim()
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-muted text-muted-foreground',
                )}
                disabled={!searchQuery.trim()}
              >
                Search
              </button>
            </div>
          </form>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 pt-6 sm:flex-row">
            <Link
              className="glass-button group flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 hover:scale-105 md:px-8 md:text-base"
              href="/solutions"
            >
              Explore Solutions
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              className="glass-button rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 hover:scale-105 md:px-8 md:text-base"
              href="/news"
            >
              Read Articles
            </Link>
          </div>

          {/* Quick Stats or Features */}
          <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-8 pt-12 text-sm">
            <div className="flex items-center gap-2">
              <div className="bg-primary h-2 w-2 rounded-full" />
              <span>Production Equipment</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-primary h-2 w-2 rounded-full" />
              <span>Broadcasting Solutions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-primary h-2 w-2 rounded-full" />
              <span>Expert Consultation</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
