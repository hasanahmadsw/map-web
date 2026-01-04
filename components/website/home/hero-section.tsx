'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import { ArrowRight, Search, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import EquipmentsAutocomplete from '../common/equipments-autocomplete';

export function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (value: string) => {
    if (!value.trim()) return;
    router.push(`/rental?search=${encodeURIComponent(value.trim())}`);
  };

  return (
    <section className="section-padding relative container flex min-h-screen items-center justify-center">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(to right, #888 1px, transparent 1px),
                            linear-gradient(to bottom, #888 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Content */}
      <div className="pt-edge-nav-margin relative z-10 container flex max-w-7xl flex-col items-center justify-center">
        <div className="space-y-8 text-center">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="mx-auto max-w-5xl text-4xl leading-tight font-bold tracking-tight md:text-6xl md:leading-[1.1]">
              <span className="from-foreground via-foreground to-foreground/70 bg-linear-to-r bg-clip-text text-transparent">
                Media Production and
              </span>
              <br />
              <span className="from-primary via-primary/90 to-primary/70 bg-linear-to-r bg-clip-text text-transparent">
                Broadcasting Solutions
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-base">
              Discover our comprehensive range of media production and broadcasting solutions, designed to
              meet the unique needs of businesses and organizations worldwide.
            </p>
          </div>

          {/* Search Input */}
          <div className="mx-auto w-full max-w-2xl pt-4">
            <div
              className={cn(
                'group relative z-50 gap-3 rounded-2xl px-4 py-3 transition-all duration-300',
                'bg-background/80 border-border/50 border backdrop-blur-xl',
                'shadow-lg shadow-black/5 dark:shadow-black/20',
                'hover:bg-background/90 hover:border-border hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30',
                'focus-within:bg-background/95 focus-within:border-primary/50 focus-within:shadow-primary/10 focus-within:shadow-2xl',
                'dark:bg-card/70 dark:border-border/40 dark:hover:bg-card/80 dark:focus-within:bg-card/90',
              )}
            >
              <EquipmentsAutocomplete
                placeholder="Search equipment..."
                value={searchQuery}
                onValueChange={handleSearchChange}
                className="w-full"
              />
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="relative flex flex-col items-center justify-center gap-4 pt-6 sm:flex-row">
            <Link
              className="glass-button group flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 md:px-8 md:text-base"
              href="/solutions"
            >
              Explore Solutions
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              className="glass-button rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 md:px-8 md:text-base"
              href="/blog"
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
