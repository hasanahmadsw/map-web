import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import type { Article } from '@/types/articles.types';

interface SimpleArticleCardProps {
  article: Article;

  index: number;
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

const blurDataURL = `data:image/svg+xml;base64,${toBase64(shimmer(800, 600))}`;

export function SimpleArticleCard({ article, priority = false }: SimpleArticleCardProps) {
  // Pre-compute values to avoid repeated calculations
  const coverImage =
    article.featuredImage ||
    article.image ||
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80';
  const isUnoptimized = coverImage.includes('unsplash.com') || coverImage.includes('supabase.co');

  // Calculate reading time (approximate: 200 words per minute)
  const wordCount = article.content?.split(/\s+/).length || 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const formattedDate = article.createdAt ? formatDate(article.createdAt) : 'Date not available';

  return (
    <article className="group glass-card hover:bg-background/40 relative isolate flex flex-col justify-end overflow-hidden rounded-2xl px-8 pt-80 pb-8 transition-all duration-300">
      {/* Background Image */}
      <Image
        src={coverImage}
        alt={article.name}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-300 will-change-transform group-hover:scale-105"
        loading={priority ? 'eager' : 'lazy'}
        priority={priority}
        placeholder="blur"
        blurDataURL={blurDataURL}
        unoptimized={isUnoptimized}
      />

      {/* Gradient Overlay */}
      <div className="from-background via-background/60 absolute inset-0 -z-10 bg-linear-to-t to-transparent" />

      {/* Date and Reading Time */}
      <div className="text-muted-foreground mb-3 flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6">
        <time dateTime={article.createdAt} className="mr-8">
          {formattedDate}
        </time>
        <div className="-ml-4 flex items-center gap-x-4">
          <svg viewBox="0 0 2 2" className="fill-muted-foreground/50 -ml-0.5 h-0.5 w-0.5 flex-none">
            <circle cx={1} cy={1} r={1} />
          </svg>
          <div className="flex gap-x-2.5">{readingTime} min read</div>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-foreground text-lg leading-6 font-semibold">
        <Link href={`/blog/${article.slug}`}>
          <span className="absolute inset-0" />
          {article.name}
        </Link>
      </h3>
    </article>
  );
}
