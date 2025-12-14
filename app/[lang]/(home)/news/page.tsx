import type { Metadata } from "next";
import { NewsControls } from "@/components/articles/public/news-controls";
import { NewsHeader } from "@/components/articles/public/news-header";
import { NewsResults } from "@/components/articles/public/news-results";
import { articlesService } from "@/services/articles.service";
import { getTranslations, type Lang } from "@/utils/dictionary-utils";
import { createEnhancedMetadata } from "@/utils/seo/meta/enhanced-meta";
import { newsPageSchema } from "@/utils/seo/schema/newsPageSchema";

interface NewsPageParams {
  params: Promise<{ lang: string }>;
}

interface NewsPageSearchParams {
  searchParams: Promise<{
    search?: string;
    topics?: string;
    page?: string;
    limit?: string;
  }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
  searchParams,
}: NewsPageParams & NewsPageSearchParams): Promise<Metadata> {
  const { lang } = await params;
  const { search, topics, page } = await searchParams;

  const t = await getTranslations(lang as Lang);
  const siteURL = process.env.NEXT_PUBLIC_SITE_URL!;

  // Build dynamic title and description based on search/filter parameters
  let title = t.metadata?.pages?.news || "News Articles";
  let description =
    t.metadata?.descriptions?.news || "Read the latest news articles and breaking stories from around the world";

  if (search) {
    title = `${title} - Search: ${search}`;
    description = `${description} - Search results for "${search}"`;
  } else if (topics) {
    title = `${title} - ${topics}`;
    description = `${description} - ${topics} topics and categories`;
  }

  // Add page number to title if not first page
  const pageNum = page ? Number(page) : 1;
  if (pageNum > 1) {
    title = `${title} - Page ${pageNum}`;
  }

  // Build keywords based on search parameters
  const baseKeywords = t.metadata?.keywords?.news || [];
  const dynamicKeywords = [
    ...baseKeywords,
    ...(search ? [search, "search results"] : []),
    ...(topics ? [topics, "topics"] : []),
    "latest news",
    "breaking news",
    "current events",
    "news articles",
    "content discovery",
  ].filter(Boolean);

  const metadata = createEnhancedMetadata({
    lang: lang as Lang,
    title: { absolute: title },
    description,
    type: "website",
    keywords: dynamicKeywords,
    pathname: "/news",
    openGraphOverrides: {
      type: "website",
      title,
      description,
      url: `${siteURL}/${lang}/news`,
    },
    twitterOverrides: {
      card: "summary_large_image",
      title,
      description,
      creator: "@newswebsite",
      site: "@newswebsite",
    },
  });

  return metadata;
}

export default async function NewsPage({ params, searchParams }: NewsPageParams & NewsPageSearchParams) {
  const { lang } = await params;
  const { search, topics, page, limit } = await searchParams;

  const pageNum = page ? Number(page) : 1;
  const limitNum = limit ? Number(limit) : 10;
  const articles = await articlesService.getAll({
    search: search || "",
    page: pageNum,
    limit: limitNum,
  });
  const t = await getTranslations(lang as Lang);

  // Generate structured data for SEO
  const structuredData = await newsPageSchema(
    articles.data as any,
    lang as Lang,
    {
      search: search || undefined,
      topics: topics || undefined,
      page: pageNum,
    },
  );
  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <div className="container mx-auto px-4 py-8">
        <NewsHeader title={t.news.latestNews} description={t.news.stayUpdated} />


        <NewsResults
          t={t}
          articles={articles.data}
          totalArticles={articles.pagination?.total || 0}
          lang={lang}
          currentPage={pageNum}
          limit={limitNum}
          searchParams={{
            search: search || "",
            topics: topics || "",
          }}
        />
      </div>
    </>
  );
}
