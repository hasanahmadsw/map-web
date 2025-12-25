'use client';

import { Sparkles } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

interface ServicesHeaderProps {
  initialSearch?: string;
}

export function ServicesHeader({ initialSearch = '' }: ServicesHeaderProps) {
  return (
    <header className="relative container mx-auto max-w-7xl space-y-10 overflow-hidden px-4 pb-6">
      {/* Header Content */}
      <div className="relative space-y-5">
        {/* Decorative Badge */}
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="group border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/30 px-4 py-1.5 text-xs font-medium transition-colors"
          >
            <Sparkles className="text-primary mr-1.5 h-3 w-3" />
            Explore Our Services
          </Badge>
        </div>

        <div className="space-y-4">
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            <span className="from-foreground via-foreground to-foreground/70 block bg-linear-to-r bg-clip-text text-transparent">
              Our Services
            </span>
          </h1>
          <p className="text-muted-foreground max-w-2xl text-base leading-relaxed md:text-lg lg:text-xl">
            Professional media production and broadcasting services tailored to your needs. Discover
            comprehensive solutions designed to elevate your projects and bring your vision to life.
          </p>
        </div>
      </div>
    </header>
  );
}
