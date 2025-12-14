
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArticleContent } from "@/components/article-content";
import { RelatedArticles } from "@/components/related-articles";
import { articlesService } from "@/services/articles.service";
import { getTranslations, Lang } from "@/utils/dictionary-utils";
import { createEnhancedMetadata } from "@/utils/seo/meta/enhanced-meta";
import { articlePageSchema } from "@/utils/seo/schema/articlePageSchema";
import { cn } from "@/lib/utils";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
    lang: string;
  }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug, lang } = await params;
  const article = await articlesService.getBySlug(slug);
  
  if (!article) {
    notFound();
  }

  const t = await getTranslations(lang as Lang);
  const siteURL = process.env.NEXT_PUBLIC_SITE_URL!;

  // Build comprehensive keywords from article data
  const keywords = [
    ...(article.tags?.map(tag => tag.name) || []),
    ...(article.topics?.map(topic => topic.name) || []),
    article.name,
  ].filter(Boolean);

  // Build author information
  const authors = [
    {
      name: t.metadata?.siteName ,
      url: siteURL,
    },
  ];

  const metadata = createEnhancedMetadata({
    lang: lang as Lang,
    title: { absolute: article.name },
    description: article.excerpt || `${article.name} - Read the full article on ${t.metadata?.siteName}`,
    type: "article",
    keywords,
    publishedTime: article.createdAt,
    modifiedTime: article.updatedAt,
    authors,
    pathname: `/news/${article.slug}`,
    image: article.image || undefined,
    openGraphOverrides: {
      type: "article",
      publishedTime: article.createdAt,
      modifiedTime: article.updatedAt,
      authors: authors.map(author => author.name),
      section: article.topics?.map(topic => topic.name).join(", ") || "News",
      tags: article.tags?.map(tag => tag.name) || [],
    },
    twitterOverrides: {
      card: "summary_large_image",
      creator: "@newswebsite",
      site: "@newswebsite",
    },
  });

  return metadata;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug, lang } = await params;
  const t = await getTranslations(lang as Lang);
  const article = await articlesService.getBySlug(slug);

  if (!article) {
    notFound();
  }

  // Generate structured data for SEO
  const structuredData = await articlePageSchema(article as any, lang as Lang);

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-8 py-8">
          {/* Article Content and Related Articles */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Article Content Component */}
            <div className={cn(article.relatedArticles ? "lg:col-span-2" : "lg:col-span-3")}>
              <ArticleContent t={t} lang={lang} article={article} />
            </div>

            {/* Right Sidebar - Related Articles */}
            {article.relatedArticles && (
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <RelatedArticles 
                    lang={lang} 
                    currentArticle={article} 
                    t={t} 
                    allArticles={article.relatedArticles || []} 
                    maxArticles={4} 
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
