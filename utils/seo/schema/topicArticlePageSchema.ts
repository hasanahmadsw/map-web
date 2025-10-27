import { Article, BreadcrumbList } from "schema-dts";
import { getTranslations, Lang } from "@/utils/dictionary-utils";

export async function topicArticlePageSchema(
  lang: Lang,
  topic: any,
  articles: any[]
): Promise<{
  "@context": string;
  "@graph": [Article, BreadcrumbList];
}> {
  const dict = await getTranslations(lang);

  const siteURL = process.env.NEXT_PUBLIC_SITE_URL!;
  const pageUrl = `${siteURL}/${lang}/topics/${topic.slug}`;

  const breadcrumbSchema: BreadcrumbList = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: dict.metadata?.pages?.home,
        item: siteURL + `/${lang}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: dict.metadata?.pages?.topics,
        item: `${siteURL}/${lang}/topics`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: topic.name,
        item: pageUrl,
      },
    ],
  };

  const articleSchema: Article = {
    "@type": "Article",
    headline: `${topic.name} - ${dict.metadata?.pages?.topics}`,
    description: topic.description,
    url: pageUrl,
    inLanguage: lang,
    keywords: [topic.name, ...(dict.metadata?.keywords?.topics || [])],
    publisher: {
      "@type": "Organization",
      name: dict.metadata?.siteName,
      logo: {
        "@type": "ImageObject",
        url: `${siteURL}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    articleSection: topic.name,
    wordCount: articles.length,
    isPartOf: {
      "@type": "CollectionPage",
      name: dict.metadata?.pages?.topics,
      url: `${siteURL}/${lang}/topics`,
    },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [articleSchema, breadcrumbSchema],
  };
}
