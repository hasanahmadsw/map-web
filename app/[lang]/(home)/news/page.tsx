import type { Metadata } from "next";
import { NewsControls } from "@/components/articles/public/news-controls";
import { NewsHeader } from "@/components/articles/public/news-header";
import { NewsResults } from "@/components/articles/public/news-results";
import { articlesService } from "@/services/articles.service";
import { tagsService } from "@/services/tags.service";
import { topicsService } from "@/services/topics.service";
import { type SortBy, SortOrder } from "@/types/common.types";
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
    sortBy?: "createdAt" | "updatedAt" | "name" | "publishedAt" | "viewCount";
    sortOrder?: "ASC" | "DESC";
    tagId?: string;
    topicId?: string;
  }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
  searchParams,
}: NewsPageParams & NewsPageSearchParams): Promise<Metadata> {
  const { lang } = await params;
  const { search, topics, page, tagId, topicId } = await searchParams;

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
  } else if (tagId) {
    title = `${title} - Tag: ${tagId}`;
    description = `${description} - Articles tagged with ${tagId}`;
  } else if (topicId) {
    title = `${title} - Topic: ${topicId}`;
    description = `${description} - Articles in ${topicId} category`;
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
    ...(tagId ? [tagId, "tags", "tagged content"] : []),
    ...(topicId ? [topicId, "categories"] : []),
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
  const { search, topics, page, limit, sortBy, sortOrder, tagId, topicId } = await searchParams;

  const topicsData = await topicsService.getAll(lang);
  const tags = await tagsService.getAll(lang as Lang);
  const pageNum = page ? Number(page) : 1;
  const limitNum = limit ? Number(limit) : 10;
  const articles = await articlesService.getAll({
    lang,
    search: search || "",
    page: pageNum,
    limit: limitNum,
    sortBy: (sortBy as SortBy) || undefined,
    sortOrder: (sortOrder as SortOrder) || SortOrder.DESC,
    topicId: topicId || topics || undefined,
    tagId: tagId || undefined,
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
      tagId: tagId || undefined,
      topicId: topicId || undefined,
    },
    tags,
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

        <NewsControls topics={topicsData} />

        <NewsResults
          t={t}
          articles={articles.data}
          totalArticles={articles.pagination.total}
          lang={lang}
          currentPage={pageNum}
          limit={limitNum}
          searchParams={{
            search: search || "",
            topics: topics || "",
            sortBy: sortBy || "",
            sortOrder: sortOrder || "",
            tagId: tagId || "",
            topicId: topicId || "",
          }}
        />
      </div>
    </>
  );
}
