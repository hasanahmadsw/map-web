import { CollectionPage, BreadcrumbList, ItemList, Organization, WithContext } from "schema-dts";
import { getTranslations, Lang } from "@/utils/dictionary-utils";
import type { Tag } from "@/types/tags.types";

export async function tagsPageSchema(
  tags: Tag[],
  lang: Lang
): Promise<WithContext<CollectionPage>> {
  const dict = await getTranslations(lang);
  const siteURL = process.env.NEXT_PUBLIC_SITE_URL!;
  const pageUrl = `${siteURL}/${lang}/tags`;

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
        name: dict.metadata?.pages?.tags,
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

  // Build item list for tags
  const itemListSchema: ItemList = {
    "@type": "ItemList",
    numberOfItems: tags.length,
    itemListElement: tags.map((tag, index) => ({
      "@type": "Thing",
      position: index + 1,
      name: tag.name,
      description: tag.description,
      url: `${siteURL}/${lang}/tags/${tag.slug}`,
      identifier: tag.slug,
      additionalProperty: {
        "@type": "PropertyValue",
        name: "Article Count",
        value: tag.articleCount,
      },
    })),
  };

  // Build main collection page schema
  const collectionPageSchema: CollectionPage = {
    "@type": "CollectionPage",
    name: dict.metadata?.pages?.tags,
    description: `${dict.metadata?.descriptions?.tags} - Browse ${tags.length} tags to discover content`,
    url: pageUrl,
    inLanguage: lang,
    keywords: [
      ...(dict.metadata?.keywords?.tags || []),
      "content discovery",
      "tagged content",
      "content organization",
      "browse by tags",
    ].join(", "),
    publisher: organizationSchema,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
      name: dict.metadata?.pages?.tags,
      description: dict.metadata?.descriptions?.tags,
      breadcrumb: breadcrumbSchema,
    },
    mainEntity: itemListSchema,
  };

  return {
    "@context": "https://schema.org",
    ...collectionPageSchema,
  };
}