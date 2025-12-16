import { Calendar, Clock } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import DivHtml from '../shared/div-html';
import { Article } from '@/types/articles.types';
import { Author } from './author';
import { formatDate } from '@/lib/utils';
import { Translations } from '@/utils/dictionary-utils';

interface ArticleContentProps {
  article: Article;
  lang: string;
  t: Translations;
}

export function ArticleContent({ article, lang, t }: ArticleContentProps) {
  // Parse and display the actual article content
  const parseArticleContent = (content: string) => {
    if (!content) return [];

    // Split content by double line breaks to create paragraphs
    const paragraphs = content
      .split(/\n\s*\n/)
      .filter(paragraph => paragraph.trim().length > 0)
      .map(paragraph => paragraph.trim());

    return paragraphs;
  };

  const articleContent = parseArticleContent(article.content);

  return (
    <article className="mx-auto max-w-4xl px-4">
      {/* Article Header */}
      <div className="mb-8">
        {/* Topics and Tags */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {article.topics &&
            article.topics.length > 0 &&
            article.topics.map(topic => (
              <Badge key={topic.slug} variant="default" className="px-3 py-1 text-sm">
                {topic.name}
              </Badge>
            ))}
          {article.tags &&
            article.tags.length > 0 &&
            article.tags.map(tag => (
              <Badge key={tag.slug} variant="secondary" className="px-3 py-1 text-sm">
                {tag.name}
              </Badge>
            ))}
        </div>

        {/* Title */}
        <h1 className="mb-6 text-4xl leading-tight font-bold md:text-5xl">{article.name}</h1>

        {/* Meta Information */}
        <div className="text-muted-foreground mb-6 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(article.createdAt, lang)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>
              {article.viewCount} {t.common.views}
            </span>
          </div>
        </div>

        {/* Excerpt */}
        {article.excerpt && (
          <div className="text-muted-foreground mb-8 text-xl leading-relaxed">
            <DivHtml html={article.excerpt} />
          </div>
        )}
      </div>

      {/* Featured Image */}
      {article.image && (
        <div className="mb-12 w-full">
          <div className="relative h-96 w-full overflow-hidden rounded-xl shadow-lg md:h-[500px]">
            <Image src={article.image} alt={article.name} fill className="object-cover" priority />
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="prose prose-lg prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-a:text-primary prose-blockquote:text-muted-foreground max-w-none">
        {article.content ? (
          <div
            className="text-foreground text-lg leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        ) : articleContent.length > 0 ? (
          articleContent.map((paragraph, index) => (
            <p key={index} className="text-foreground mb-6 text-lg leading-relaxed">
              {paragraph}
            </p>
          ))
        ) : (
          <p className="text-muted-foreground text-lg leading-relaxed italic">
            No content available for this article.
          </p>
        )}
      </div>

      {/* Author Section */}
      {article.author && (
        <div className="mt-12">
          <Author author={article.author} />
        </div>
      )}
    </article>
  );
}
