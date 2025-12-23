'use client';

import { Button } from '@/components/ui/button';
import { DatabaseBackup, Filter, RefreshCw, Sparkles } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface EmptyStateProps {
  type: 'no-data' | 'no-filter-results';
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

function EmptyState({ type, icon, title, description, className = '' }: EmptyStateProps) {
  const router = useRouter();
  const pathName = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 100);
  }, []);

  const defaultMessages = {
    'no-data': {
      title: title || 'No Data Available',
      description:
        description || 'It looks like there is no data in the system yet. Add some data to get started.',
      action: null,
      icon: icon || <DatabaseBackup className="h-12 w-12" />,
    },
    'no-filter-results': {
      title: title || 'No Results Found',
      description:
        description || "We couldn't find any data matching your filters. Try adjusting your search criteria.",
      action: {
        label: 'Reset Filters',
        onClick: () => router.replace(pathName),
      },
      icon: icon || <Filter className="h-12 w-12" />,
    },
  };

  const { title: messageTitle, description: messageDescription, icon: Icon, action } = defaultMessages[type];

  return (
    <div
      className={`relative ${className} ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} transition-all duration-500 ease-out`}
    >
      <div className="relative flex flex-col items-center justify-center px-4 py-16 text-center">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="from-primary/5 to-primary/10 absolute -top-20 -left-20 h-40 w-40 animate-pulse rounded-full bg-linear-to-r blur-3xl" />
          <div className="animation-delay-1000 from-secondary/5 to-secondary/10 absolute -right-20 -bottom-20 h-40 w-40 animate-pulse rounded-full bg-linear-to-r blur-3xl" />

          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `linear-linear(to right, hsl(var(--muted-foreground)) 1px, transparent 1px),
                            linear-linear(to bottom, hsl(var(--muted-foreground)) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        {/* Main content container */}
        <div className="relative z-10 max-w-md">
          {/* Icon container with floating animation */}
          <div
            className={`relative mb-8 scale-100 transition-all duration-700 ${mounted ? 'scale-100 rotate-0' : 'scale-75 -rotate-6'}`}
          >
            <div className="relative flex items-center justify-center">
              {/* Outer glow effect */}
              <div className="from-primary/20 to-secondary/20 absolute inset-0 animate-pulse rounded-full bg-linear-to-r blur-xl" />

              {/* Icon background with floating animation */}
              <div
                className={`hover:shadow-3xl from-card to-muted relative flex h-32 w-32 items-center justify-center rounded-2xl bg-linear-to-br shadow-2xl transition-shadow duration-300 ${type === 'no-filter-results' ? 'animate-float' : ''}`}
              >
                {/* Inner linear ring */}
                <div className="from-primary/10 to-secondary/10 absolute inset-4 rounded-full border-4 border-transparent bg-linear-to-r bg-clip-padding" />

                {/* Animated border */}
                <div className="animate-spin-slow border-t-primary/30 border-r-secondary/30 absolute inset-0 rounded-2xl border-2 border-transparent" />

                {/* Icon */}
                <div className="relative z-10">
                  <div className={`transition-transform duration-500 ${mounted ? 'scale-100' : 'scale-0'}`}>
                    {Icon}
                  </div>
                </div>

                {/* Decorative corner elements */}
                <div className="absolute top-0 left-0 h-6 w-6">
                  <div className="bg-primary/30 h-2 w-2 rounded-full" />
                </div>
                <div className="absolute top-0 right-0 h-6 w-6">
                  <div className="bg-secondary/30 h-2 w-2 rounded-full" />
                </div>
                <div className="absolute bottom-0 left-0 h-6 w-6">
                  <div className="bg-secondary/30 h-2 w-2 rounded-full" />
                </div>
                <div className="absolute right-0 bottom-0 h-6 w-6">
                  <div className="bg-primary/30 h-2 w-2 rounded-full" />
                </div>

                {/* Sparkle effects for no-data */}
                {type === 'no-data' && (
                  <>
                    <div className="absolute -top-2 -right-2">
                      <Sparkles className="text-primary/40 animation-delay-100 h-4 w-4 animate-ping" />
                    </div>
                    <div className="absolute -bottom-2 -left-2">
                      <Sparkles className="text-secondary/40 animation-delay-500 h-3 w-3 animate-ping" />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Text content */}
          <div
            className={`mb-8 transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
          >
            <h2 className="from-foreground to-foreground/80 mb-3 bg-linear-to-r bg-clip-text text-2xl font-bold text-transparent">
              {messageTitle}
            </h2>
            <p className="text-muted-foreground mx-auto max-w-sm text-lg leading-relaxed">
              {messageDescription}
            </p>
          </div>

          {/* Action button */}
          {action && (
            <div
              className={`transition-all duration-700 ${mounted ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}
            >
              <Button
                onClick={action.onClick}
                size="lg"
                className="group from-primary to-primary/90 text-primary-foreground hover:shadow-primary/25 relative overflow-hidden rounded-xl bg-linear-to-r px-8 py-6 text-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
              >
                {/* Button shine effect */}
                <span className="animate-shimmer via-primary-foreground/20 absolute inset-0 -translate-x-full bg-linear-to-r from-transparent to-transparent" />

                {/* Button content */}
                <span className="relative z-10 flex items-center gap-3">
                  {type === 'no-filter-results' && (
                    <RefreshCw className="h-5 w-5 transition-transform duration-300 group-hover:rotate-180" />
                  )}
                  {action.label}
                </span>

                {/* Button border animation */}
                <span className="from-primary to-secondary absolute inset-0 rounded-xl border-2 border-transparent bg-linear-to-r bg-clip-border opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmptyState;
