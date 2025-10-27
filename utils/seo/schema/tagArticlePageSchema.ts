import { Article, BreadcrumbList } from "schema-dts";
import { getTranslations, Lang } from "@/utils/dictionary-utils";

export async function tagArticlePageSchema(
  lang: Lang,
  tag: any,
  articles: any[]
): Promise<{
  "@context": string;
  "@graph": [Article, BreadcrumbList];
}> {
  const dict = await getTranslations(lang);

  const siteURL = process.env.NEXT_PUBLIC_SITE_URL!;
  const pageUrl = `${siteURL}/${lang}/tags/${tag.slug}`;

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
        name: dict.metadata?.pages?.tags,
        item: `${siteURL}/${lang}/tags`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tag.name,
        item: pageUrl,
      },
    ],
  };

  const articleSchema: Article = {
    "@type": "Article",
    headline: `${tag.name} - ${dict.metadata?.pages?.tags}`,
    description: tag.description,
    url: pageUrl,
    inLanguage: lang,
    keywords: [tag.name, ...(dict.metadata?.keywords?.tags || [])],
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
    articleSection: tag.name,
    wordCount: articles.length,
    isPartOf: {
      "@type": "CollectionPage",
      name: dict.metadata?.pages?.tags,
      url: `${siteURL}/${lang}/tags`,
    },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [articleSchema, breadcrumbSchema],
  };
}
