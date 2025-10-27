import { CollectionPage, BreadcrumbList, ItemList, NewsArticle, Organization, WithContext } from "schema-dts";
import { getTranslations, Lang } from "@/utils/dictionary-utils";
import type { Article as CustomArticle } from "@/types/article.types";
import type { Tag } from "@/types/tags.types";

export async function newsPageSchema(
  articles: CustomArticle[],
  lang: Lang,
  searchParams?: {
    search?: string;
    topics?: string;
    page?: number;
    tagId?: string;
    topicId?: string;
  },
  tags?: Tag[]
): Promise<WithContext<CollectionPage>> {
  const dict = await getTranslations(lang);
  const siteURL = process.env.NEXT_PUBLIC_SITE_URL!;
  const pageUrl = `${siteURL}/${lang}/news`;

  // Build breadcrumb schema
  const breadcrumbSchema: BreadcrumbList = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: dict.metadata?.pages?.home,
        item: `${siteURL}/${lang}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: dict.metadata?.pages?.news,
        item: pageUrl,
      },
    ],
  };

  // Build organization schema
  const organizationSchema: Organization = {
    "@type": "Organization",
    name: dict.metadata?.siteName,
    description: dict.metadata?.descriptions?.home,
    url: siteURL,
    logo: {
      "@type": "ImageObject",
      url: `${siteURL}/images/logo.png`,
    },
    sameAs: [
      "https://www.facebook.com/newswebsite",
      "https://www.twitter.com/newswebsite",
      "https://www.linkedin.com/company/newswebsite",
      "https://www.instagram.com/newswebsite",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: dict.metadata?.organization?.contactType,
      availableLanguage: ["English", "Arabic"],
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "AE",
      addressLocality: "Dubai",
    },
    knowsAbout: dict.metadata?.organization?.knowsAbout,
  };

  // Build item list for articles
  const itemListSchema: ItemList = {
    "@type": "ItemList",
    numberOfItems: articles.length,
    itemListElement: articles.map((article, index) => ({
      "@type": "NewsArticle",
      position: index + 1,
      headline: article.name,
      description: article.excerpt || article.meta?.description || "",
      url: `${siteURL}/${lang}/news/${article.slug}`,
      datePublished: article.createdAt,
      dateModified: article.updatedAt,
      inLanguage: lang,
      isAccessibleForFree: true,
      wordCount: article.content?.split(/\s+/).length || 0,
      articleSection: article.topics?.map((topic: any) => topic.name).join(", ") || "",
      keywords: article.meta?.keywords?.join(", ") || article.tags?.map((tag: any) => tag.name).join(", ") || "",
      author: {
        "@type": "Organization",
        name: dict.metadata?.siteName,
      },
      publisher: organizationSchema,
      ...(article.image && {
        image: article.image,
      }),
    })),
  };

  // Build main collection page schema
  const collectionPageSchema: CollectionPage = {
    "@type": "CollectionPage",
    name: searchParams?.search 
      ? `${dict.metadata?.pages?.news} - ${searchParams.search}`
      : searchParams?.topics
      ? `${dict.metadata?.pages?.news} - ${searchParams.topics}`
      : dict.metadata?.pages?.news,
    description: searchParams?.search
      ? `${dict.metadata?.descriptions?.news} - Search results for "${searchParams.search}"`
      : searchParams?.topics
      ? `${dict.metadata?.descriptions?.news} - ${searchParams.topics} topics`
      : dict.metadata?.descriptions?.news,
    url: pageUrl,
    inLanguage: lang,
    keywords: [
      ...(dict.metadata?.keywords?.news || []),
      ...(searchParams?.search ? [searchParams.search] : []),
      ...(searchParams?.topics ? [searchParams.topics] : []),
      ...(searchParams?.tagId ? [searchParams.tagId, "tagged content"] : []),
      ...(searchParams?.topicId ? [searchParams.topicId, "categorized content"] : []),
      ...(tags ? tags.slice(0, 10).map(tag => tag.name) : []),
      "content discovery",
      "browse by tags",
    ].join(", "),
    publisher: organizationSchema,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
      name: dict.metadata?.pages?.news,
      description: dict.metadata?.descriptions?.news,
      breadcrumb: breadcrumbSchema,
    },
    mainEntity: itemListSchema,
    ...(searchParams?.page && searchParams.page > 1 && {
      isPartOf: {
        "@type": "CollectionPage",
        "@id": pageUrl,
        name: dict.metadata?.pages?.news,
      },
    }),
  };

  return {
    "@context": "https://schema.org",
    ...collectionPageSchema,
  };
}
