import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';
import { Article } from '@/types/articles.types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Translations } from '@/utils/dictionary-utils';
import { formatDate } from '@/lib/utils';

interface CompactArticleCardProps {
  article: Article;
  className?: string;
  t: Translations;
  lang: string;
}

export function CompactArticleCard({ article, className, t, lang }: CompactArticleCardProps) {
  return (
    <Card className={`transition-shadow duration-200 hover:shadow-md ${className || ''}`}>
      <CardContent className="space-y-2">
        {/* Topic Badge */}
        <div className="mb-3">
          <Badge variant="outline" className="text-xs">
            {article.topics.map(topic => topic.name).join(', ')}
          </Badge>
        </div>

        {/* Title */}
        <Link href={`/news/${article.slug}`} className="block">
          <h3 className="hover:text-primary mb-2 line-clamp-2 text-sm leading-tight font-semibold transition-colors">
            {article.name}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">{article.excerpt}</p>

        {/* Meta Information */}
        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(article.createdAt, lang)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>
              {article.viewCount} {t.common.views}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
