'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { fmt } from '@/constants/validation-msg';
import { cn } from '@/lib/utils';

import { FileSearch, Ghost, Home, RefreshCw, Search, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface ErrorStateBaseProps {
  type: 'not-found' | 'api-error';
  title?: string;
  description?: string;
  entity?: string;
  entities?: string;
  errorMessage?: string;
  className?: string;
  showPrimaryAction?: boolean;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  onRetry?: () => void;
  backHref?: string;
  homeHref?: string;
  variant?: 'default' | 'compact';
}

function ErrorState(props: ErrorStateBaseProps) {
  const {
    type,
    title: customTitle,
    description: customDescription,
    entity,
    entities,
    errorMessage,
    className,
    showPrimaryAction = true,
    showBackButton = true,
    showHomeButton = true,
    onRetry,
    backHref,
    homeHref,
    variant = 'default',
  } = props;

  // Configuration for different error types
  const configurations = {
    'not-found': {
      icon: <FileSearch className="h-12 w-12" />,
      title:
        customTitle ||
        fmt('The {{entity}} not found', {
          entity: entity ? entity : 'Resource',
        }),
      description:
        customDescription ||
        fmt('The {{entity}} you are looking for does not exist.', {
          entity: entity ? entity : 'Resource',
        }),
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
      borderColor: 'border-blue-200 dark:border-blue-800',
      primaryAction: {
        label: fmt('Browse {{entities}}', {
          entities: entities ? entities : 'Resources',
        }),
        href: backHref || `/`,
        icon: <Ghost className="h-4 w-4" />,
      } as { label: string; href: string; icon: React.ReactElement },
    },

    'api-error': {
      icon: <ShieldAlert className="h-12 w-12" />,
      title: customTitle || fmt('An error occurred'),
      description: customDescription || errorMessage || 'An error occurred',
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-950/30',
      borderColor: 'border-red-200 dark:border-red-800',
      primaryAction: {
        label: 'Try Again',
        onClick: onRetry,
        icon: <RefreshCw className="h-4 w-4" />,
      } as { label: string; onClick?: () => void; icon: React.ReactElement },
    },
  };

  const config = configurations[type];
  const isCompact = variant === 'compact';

  if (isCompact) {
    return (
      <Alert
        variant={type === 'not-found' ? 'default' : 'destructive'}
        className={cn('relative overflow-hidden', config.bgColor, config.borderColor, className)}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, ${config.color.replace('text-', '')} 1px, transparent 0)`,
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        <div className="relative z-10">
          <div className="flex items-start gap-4">
            <div className={cn('mt-1 rounded-lg p-2', config.bgColor)}>{config.icon}</div>
            <div className="flex-1 space-y-2">
              <AlertTitle className={cn('text-lg font-semibold', config.color)}>{config.title}</AlertTitle>
              <AlertDescription className="text-gray-700 dark:text-gray-300">
                {config.description}
              </AlertDescription>
              <div className="flex gap-2 pt-2">
                {'onClick' in config.primaryAction && config.primaryAction.onClick ? (
                  <Button
                    variant={type === 'not-found' ? 'default' : 'destructive'}
                    size="sm"
                    onClick={config.primaryAction.onClick}
                    className="gap-2"
                  >
                    {config.primaryAction.icon}
                    {config.primaryAction.label}
                  </Button>
                ) : (
                  'href' in config.primaryAction &&
                  config.primaryAction.href && (
                    <Button
                      asChild
                      variant={type === 'not-found' ? 'default' : 'destructive'}
                      size="sm"
                      className="gap-2"
                    >
                      <Link href={config.primaryAction.href}>
                        {config.primaryAction.icon}
                        {config.primaryAction.label}
                      </Link>
                    </Button>
                  )
                )}
                {showHomeButton && (
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/`}>
                      <Home className="mr-2 h-4 w-4" />
                      Go Home
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Alert>
    );
  }

  // Default variant
  return (
    <div
      className={cn(
        'from-muted/20 to-background flex min-h-[600px] items-center justify-center bg-linear-to-b px-4 py-16',
        className,
      )}
    >
      <div className="w-full max-w-lg space-y-8 text-center">
        {/* Animated Icon Section */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Floating background elements */}
            <div className="absolute -inset-4 animate-pulse rounded-full bg-linear-to-r from-current to-transparent opacity-10 blur-xl" />

            {/* Main icon container */}
            <div
              className={cn(
                'bg-card hover:shadow-3xl relative flex h-32 w-32 items-center justify-center rounded-2xl border shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105',
                config.borderColor,
              )}
            >
              {/* Inner gradient ring */}
              <div
                className={cn(
                  'absolute inset-4 rounded-full border-2',
                  config.borderColor,
                  'bg-linear-to-br from-white/80 to-transparent dark:from-gray-900/80',
                )}
              />

              {/* Icon */}
              <div className={cn('relative z-10', config.color)}>{config.icon}</div>

              {/* Decorative corner elements */}
              <div
                className={cn(
                  'absolute top-3 left-3 h-3 w-3 animate-ping rounded-full opacity-60',
                  config.color.replace('text-', 'bg-'),
                )}
              />
              <div
                className={cn(
                  'animation-delay-300 absolute right-3 bottom-3 h-2 w-2 animate-ping rounded-full opacity-60',
                  config.color.replace('text-', 'bg-'),
                )}
              />
            </div>

            {/* Secondary floating icon for not-found */}
            {type === 'not-found' && (
              <div className="bg-muted animate-float absolute -top-3 -right-3 flex h-12 w-12 items-center justify-center rounded-full border shadow-lg">
                <Search className="text-muted-foreground h-5 w-5" />
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-4">
          <h2
            className={cn(
              'bg-linear-to-r from-current to-current/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent',
              config.color,
            )}
          >
            {config.title}
          </h2>

          <p className="text-muted-foreground mx-auto max-w-md text-lg leading-relaxed">
            {config.description}
          </p>

          {/* Additional error message for API errors */}
          {type === 'api-error' && errorMessage && (
            <div
              className={cn(
                'mx-auto max-w-md rounded-lg border px-4 py-3 text-sm',
                config.borderColor,
                config.bgColor,
              )}
            >
              <code className="font-mono text-sm opacity-90">{errorMessage}</code>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-center">
          {/* Primary Action */}
          {'onClick' in config.primaryAction && config.primaryAction.onClick ? (
            <Button
              size="lg"
              onClick={config.primaryAction.onClick}
              className={cn(
                'gap-3 px-8 py-6 text-base font-semibold shadow-lg transition-all hover:scale-105 hover:shadow-xl',
                type === 'not-found'
                  ? ''
                  : 'bg-linear-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600',
              )}
            >
              {config.primaryAction.icon}
              {config.primaryAction.label}
            </Button>
          ) : showPrimaryAction && 'href' in config.primaryAction && config.primaryAction.href ? (
            <Button
              asChild
              size="lg"
              className="gap-3 px-8 py-6 text-base font-semibold shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              <Link href={config.primaryAction.href}>
                {config.primaryAction.icon}
                {config.primaryAction.label}
              </Link>
            </Button>
          ) : null}

          {/* Back Button */}
          {showBackButton && type !== 'not-found' && (
            <Button asChild variant="outline" size="lg" className="gap-3 px-8 py-6 text-base font-semibold">
              <Link href={backHref || `/`}>
                <Ghost className="h-5 w-5" />
                Back
              </Link>
            </Button>
          )}
        </div>

        {/* Home Button */}
        {showHomeButton && (
          <Button asChild variant="ghost" size="lg" className="gap-3 px-8 py-6 text-base font-semibold">
            <Link href={homeHref || `/`}>
              <Home className="h-5 w-5" />
              Go Home
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}

export default ErrorState;
