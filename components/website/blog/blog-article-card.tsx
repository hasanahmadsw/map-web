import { Calendar, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import DivHtml from '@/components/shared/div-html';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import type { Article } from '@/types/articles.types';

interface BlogArticleCardProps {
  article: Article;

  priority?: boolean;
}

export function BlogArticleCard({ article, priority = false }: BlogArticleCardProps) {
  const href = `/blog/${article.slug}`;
  const coverImage = article.featuredImage || article.image || FALLBACK_IMAGE;
  const topics = toLabelList(article.topics);
  const tags = toLabelList(article.tags);

  const isUnoptimized =
    coverImage.includes('unsplash.com') ||
    coverImage.includes('supabase.co') ||
    coverImage.startsWith('http');

  return (
    <Card className="group overflow-hidden p-0 transition-all duration-200 hover:shadow-md">
      <Link href={href} className="relative block h-48 w-full overflow-hidden md:h-56">
        <Image
          src={coverImage}
          alt={`${article.name || 'Article'} thumbnail`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-200 group-hover:scale-105"
          priority={priority}
          unoptimized={isUnoptimized}
        />
      </Link>

      <CardContent className="space-y-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          {topics.slice(0, 2).map(topic => (
            <Badge key={topic} variant="default" className="text-xs">
              {topic}
            </Badge>
          ))}
          {tags.slice(0, 2).map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <h3 className="group-hover:text-primary line-clamp-2 text-lg font-semibold transition-colors">
          <Link href={href} className="hover:underline">
            {article.name}
          </Link>
        </h3>

        {!!article.excerpt && (
          <div className="text-muted-foreground line-clamp-3 text-sm">
            <DivHtml html={article.excerpt} />
          </div>
        )}

        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(article.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{article.viewCount} views</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function toLabelList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .map(entry => {
      if (typeof entry === 'string') return entry;
      if (!entry || typeof entry !== 'object') return null;

      const candidate = entry as { name?: unknown; slug?: unknown };
      if (typeof candidate.name === 'string') return candidate.name;
      if (typeof candidate.slug === 'string') return candidate.slug;
      return null;
    })
    .filter(Boolean) as string[];
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80&auto=format&fit=crop';
