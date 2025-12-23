import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { SolutionResponse } from '@/types/solutions.types';
import DivHtml from '@/components/shared/div-html';
import { ArrowRight } from 'lucide-react';
import { renderIcon } from '@/utils/icon-resolver';

interface SolutionCardProps {
  solution: SolutionResponse;
  className?: string;
  priority?: boolean;
}

// Generate a lightweight blur data URL for placeholder (optimized SVG)
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${w}" height="${h}" fill="#f0f0f0"/>
  <rect width="${w}" height="${h}" fill="url(#grad)" opacity="0.5">
    <animate attributeName="x" from="-${w}" to="${w}" dur="1.5s" repeatCount="indefinite"/>
  </rect>
  <defs>
    <linearGradient id="grad">
      <stop offset="0%" stop-color="#f0f0f0"/>
      <stop offset="50%" stop-color="#e0e0e0"/>
      <stop offset="100%" stop-color="#f0f0f0"/>
    </linearGradient>
  </defs>
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str);

const blurDataURL = `data:image/svg+xml;base64,${toBase64(shimmer(400, 300))}`;

export function SolutionCard({ solution, className, priority = false }: SolutionCardProps) {
  // Pre-compute values to avoid repeated calculations
  const hasImage = Boolean(solution.featuredImage?.trim());
  const isSupabaseImage = hasImage && solution.featuredImage.includes('supabase.co');

  return (
    <Link
      href={`/solutions/${solution.slug}`}
      className={cn(
        'group glass-card relative block overflow-hidden rounded-xl p-6',
        'flex min-h-[280px] flex-col',
        className,
      )}
    >
      {/* Subtle Background Pattern/Image */}
      {hasImage && (
        <div className="will-change-opacity absolute inset-0 opacity-30 transition-opacity duration-300 group-hover:opacity-60">
          <Image
            src={solution.featuredImage}
            alt={solution.name || 'Solution image'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            loading={priority ? 'eager' : 'lazy'}
            priority={priority}
            placeholder="blur"
            blurDataURL={blurDataURL}
            unoptimized={isSupabaseImage}
          />
        </div>
      )}

      {/* Glass Content Panel */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Icon */}
        <div className="mb-4">
          <div className="bg-primary/10 inline-flex h-12 w-12 items-center justify-center rounded-xl">
            {renderIcon(solution.icon, { size: 24, fallback: 'Video' })}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col">
          <h3 className="text-foreground group-hover:text-primary mb-2 line-clamp-2 text-xl font-semibold transition-colors">
            {solution.name}
          </h3>

          {solution.shortDescription && (
            <div className="text-muted-foreground mb-4 line-clamp-3 flex-1 text-sm">
              <DivHtml html={solution.shortDescription} />
            </div>
          )}

          {/* CTA */}
          <div className="text-primary border-border/50 mt-auto flex items-center border-t pt-4 text-sm font-medium">
            <span>Explore Solution</span>
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 will-change-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
