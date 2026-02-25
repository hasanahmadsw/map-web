'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
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
          {/* Badge / Positioning */}
          <p className="text-primary text-sm font-semibold uppercase tracking-widest">
            Production Infrastructure Partner
          </p>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="mx-auto max-w-5xl text-4xl leading-tight font-bold tracking-tight md:text-6xl md:leading-[1.1]">
              <span className="from-foreground via-foreground to-foreground/70 bg-linear-to-r bg-clip-text text-transparent">
                Film, Broadcast & Production
              </span>
              <br />
              <span className="from-primary via-primary/90 to-primary/70 bg-linear-to-r bg-clip-text text-transparent">
                Solutions in Dubai
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground">
              MAP provides production infrastructure, equipment rental, and full-service broadcasting
              solutions for agencies, broadcasters, and production companies across the UAE and Gulf.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="relative flex flex-col items-center justify-center gap-4 pt-6 sm:flex-row sm:flex-wrap">
            <Link
              className="glass-button group flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 md:px-8 md:text-base"
              href="/equipment-rental"
            >
              Rent Equipment
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              className="glass-button group flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 md:px-8 md:text-base"
              href="/contact?subject=production-support"
            >
              Request Production Support
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              className="glass-button group flex items-center justify-center gap-2 rounded-full border border-primary/30 px-6 py-3 text-sm font-medium transition-all duration-200 md:px-8 md:text-base"
              href="/broadcasting"
            >
              Broadcasting Support
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Quick Stats */}
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
              <span>Full-Service Production</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
