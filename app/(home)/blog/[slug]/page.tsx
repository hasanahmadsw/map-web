import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Eye, User, Tag, BookOpen, Sparkles, FileText } from 'lucide-react';

import { articlesService } from '@/services/articles.service';

import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import DivHtml from '@/components/shared/div-html';
import { capitalizeEachWord } from '@/utils/format';
import { formatDate } from '@/lib/utils';
import type { Article } from '@/types/articles.types';
import { BlogArticleCard } from '@/components/website/blog/blog-article-card';
import { ShareCard } from '@/components/website/blog/share-card';
import SafeHtmlContent from '@/components/shared/safe-html-content';

interface BlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
  const wordCount = text.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
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

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  let article: Article | null = null;

  try {
    article = await articlesService.getBySlug(slug);

    const keywords = [
      article.name,
      ...(article.tags || []),
      ...(article.topics || []),
      article.author?.name,
      'blog',
      'article',
      'news',
    ].filter(Boolean) as string[];

    const metadata = createEnhancedMetadata({
      title: { absolute: article.name },
      description:
        article.excerpt || article.meta?.description || `${article.name} - Read our latest article`,
      type: 'article',
      keywords,
      pathname: `/blog/${article.slug}`,
      image: article.featuredImage || article.image || undefined,
      mainOverrides: {
        category: 'Blog',
      },
      openGraphOverrides: {
        type: 'article',
        publishedTime: article.createdAt,
        authors: article.author?.name ? [article.author.name] : undefined,
        tags: article.tags || [],
        images:
          article.featuredImage || article.image
            ? [{ url: article.featuredImage || article.image || '' }]
            : undefined,
      },
    });

    return metadata;
  } catch {
    return {
      title: 'Article Not Found',
      description: 'Article not found',
    };
  }
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  let article: Article | null = null;

  try {
    article = await articlesService.getBySlug(slug);
  } catch {
    // Article not found
  }

  if (!article) {
    notFound();
  }

  const coverImage = article.featuredImage || article.image;
  const topics = toLabelList(article.topics);
  const tags = toLabelList(article.tags);
  const readingTime = calculateReadingTime(article.content || '');

  return (
    <div className="bg-background relative min-h-screen">
      {/* Decorative Orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="orb-blue absolute -top-32 -left-32 h-96 w-96" />
        <div className="orb-purple absolute -right-32 -bottom-32 h-96 w-96" />
      </div>

      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden md:h-[70vh]">
        {coverImage ? (
          <>
            <Image
              src={coverImage}
              alt={article.name}
              fill
              className="object-cover"
              priority
              unoptimized={coverImage.includes('supabase.co') || coverImage.includes('unsplash.com')}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-transparent" />
          </>
        ) : (
          <div className="bg-muted absolute inset-0" />
        )}

        {/* Content Overlay */}
        <div className="relative z-10 container mx-auto flex h-full max-w-7xl flex-col justify-end px-6 py-10">
          <div className="space-y-4">
            <Link
              href={`/blog`}
              className="glass-button flex w-fit items-center gap-2 rounded-full px-4 py-2 text-white hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              {article.isFeatured && (
                <Badge variant="default" className="text-sm font-medium">
                  <Sparkles className="mr-1 h-3 w-3" />
                  Featured
                </Badge>
              )}
              {topics.slice(0, 3).map(topic => (
                <Badge key={topic} variant="secondary" className="text-sm">
                  <BookOpen className="mr-1 h-3 w-3" />
                  {capitalizeEachWord(topic)}
                </Badge>
              ))}
            </div>

            <h1 className="max-w-3xl text-4xl font-semibold text-white md:text-5xl">{article.name}</h1>

            {article.excerpt && (
              <p className="max-w-2xl text-lg text-white/90 md:text-xl">{article.excerpt}</p>
            )}

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
              {article.author && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{article.author.name}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(article.createdAt)}</span>
              </div>
              {readingTime > 0 && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{readingTime} min read</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{article.viewCount || 0} views</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content Column */}
          <div className="space-y-8 lg:col-span-2">
            {/* Article Content */}
            <section>
              <Card className="glass-card">
                <CardContent className="pt-6">
                  <SafeHtmlContent content={article.content} />
                </CardContent>
              </Card>
            </section>

            {/* Tags Section */}
            {tags.length > 0 && (
              <section>
                <div className="mb-4 flex items-center gap-2">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                    <Tag className="text-primary h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-semibold">Tags</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-sm">
                      {capitalizeEachWord(tag)}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            {/* Related Articles */}
            {article.relatedArticles && article.relatedArticles.length > 0 && (
              <section>
                <div className="mb-4 flex items-center gap-2">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                    <FileText className="text-primary h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-semibold">Related Articles</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {article.relatedArticles.map(relatedArticle => (
                    <BlogArticleCard key={relatedArticle.id} article={relatedArticle} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Article Info Card */}
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                    <FileText className="text-primary h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl">Article Details</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {article.author && (
                  <div className="flex items-start gap-3">
                    <User className="text-muted-foreground mt-0.5 h-4 w-4" />
                    <div className="flex-1">
                      <p className="text-muted-foreground mb-1 text-sm font-medium">Author</p>
                      <div className="flex items-center gap-2">
                        {article.author.image && (
                          <Image
                            src={article.author.image}
                            alt={article.author.name}
                            width={32}
                            height={32}
                            className="rounded-full"
                            unoptimized={
                              article.author.image.includes('supabase.co') ||
                              article.author.image.includes('unsplash.com')
                            }
                          />
                        )}
                        <p className="text-base font-medium">{article.author.name}</p>
                      </div>
                      {article.author.bio && (
                        <p className="text-muted-foreground mt-1 text-sm">{article.author.bio}</p>
                      )}
                    </div>
                  </div>
                )}

                <Separator />

                <div className="flex items-start gap-3">
                  <Calendar className="text-muted-foreground mt-0.5 h-4 w-4" />
                  <div className="flex-1">
                    <p className="text-muted-foreground mb-1 text-sm font-medium">Published</p>
                    <p className="text-base font-medium">{formatDate(article.createdAt)}</p>
                  </div>
                </div>

                {readingTime > 0 && (
                  <>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <Clock className="text-muted-foreground mt-0.5 h-4 w-4" />
                      <div className="flex-1">
                        <p className="text-muted-foreground mb-1 text-sm font-medium">Reading Time</p>
                        <p className="text-base font-medium">{readingTime} minutes</p>
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                <div className="flex items-start gap-3">
                  <Eye className="text-muted-foreground mt-0.5 h-4 w-4" />
                  <div className="flex-1">
                    <p className="text-muted-foreground mb-1 text-sm font-medium">Views</p>
                    <p className="text-base font-medium">{article.viewCount || 0}</p>
                  </div>
                </div>

                {topics.length > 0 && (
                  <>
                    <Separator />
                    <div className="flex items-start gap-3">
                      <BookOpen className="text-muted-foreground mt-0.5 h-4 w-4" />
                      <div className="flex-1">
                        <p className="text-muted-foreground mb-1 text-sm font-medium">Topics</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {topics.map(topic => (
                            <Badge key={topic} variant="secondary" className="text-xs">
                              {capitalizeEachWord(topic)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Share Card */}
            <ShareCard articleName={article.name} articleSlug={article.slug} />
          </div>
        </div>
      </div>
    </div>
  );
}
