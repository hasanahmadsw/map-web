import { BreadcrumbList, NewsArticle, Organization, Person, WebPage, WithContext } from "schema-dts";
import { getTranslations, Lang } from "@/utils/dictionary-utils";
import type { Article as CustomArticle } from "@/types/article.types";

export async function articlePageSchema(
  article: CustomArticle,
  lang: Lang
): Promise<WithContext<NewsArticle>> {
  const dict = await getTranslations(lang);
  const siteURL = process.env.NEXT_PUBLIC_SITE_URL!;
  const articleUrl = `${siteURL}/${lang}/news/${article.slug}`;

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
        item: `${siteURL}/${lang}/news`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.name,
        item: articleUrl,
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

  // Build main article schema
  const articleSchema: NewsArticle = {
    "@type": "NewsArticle",
    headline: article.name,
    description: article.excerpt || `${article.name} - Read the full article on ${dict.metadata?.siteName}`,
    url: articleUrl,
    datePublished: article.createdAt,
    dateModified: article.updatedAt,
    inLanguage: lang,
    isAccessibleForFree: true,
    wordCount: article.content?.split(/\s+/).length || 0,
    articleSection: article.topics?.map((topic: any) => topic.name).join(", ") || "News",
    keywords: [
      ...(article.tags?.map((tag: any) => tag.name) || []),
      ...(article.topics?.map((topic: any) => topic.name) || []),
      article.name,
      "news",
      "article",
      "breaking news",
      "latest news",
    ].join(", "),
    author: {
      "@type": "Organization",
      name: dict.metadata?.siteName,
    },
    publisher: organizationSchema,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
      name: article.name,
      description: article.excerpt || `${article.name} - Read the full article on ${dict.metadata?.siteName}`,
      breadcrumb: breadcrumbSchema,
    },
    ...(article.image && {
      image: article.image,
    }),
    ...(article.tags && article.tags.length > 0 && {
      about: article.tags.map((tag: any) => ({
        "@type": "Thing",
        name: tag.name,
        description: tag.description,
      })),
    }),
  };

  return {
    "@context": "https://schema.org",
    ...articleSchema,
  };
}