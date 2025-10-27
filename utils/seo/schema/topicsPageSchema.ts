import { CollectionPage, BreadcrumbList } from "schema-dts";
import { getTranslations, Lang } from "@/utils/dictionary-utils";

export async function topicsPageSchema(lang: Lang): Promise<{
  "@context": string;
  "@graph": [CollectionPage, BreadcrumbList];
}> {
  const dict = await getTranslations(lang);

  const siteURL = process.env.NEXT_PUBLIC_SITE_URL!;
  const pageUrl = `${siteURL}/${lang}/topics`;

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
        item: pageUrl,
      },
    ],
  };

  const collectionPageSchema: CollectionPage = {
    "@type": "CollectionPage",
    name: dict.metadata?.pages?.topics,
    description: dict.metadata?.descriptions?.topics,
    url: pageUrl,
    inLanguage: lang,
    keywords: dict.metadata?.keywords?.topics?.join(", "),
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
  };

  return {
    "@context": "https://schema.org",
    "@graph": [collectionPageSchema, breadcrumbSchema],
  };
}