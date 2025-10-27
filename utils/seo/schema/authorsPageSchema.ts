import { CollectionPage, BreadcrumbList, ItemList, Organization, WithContext } from "schema-dts";
import { getTranslations, Lang } from "@/utils/dictionary-utils";
import type { Staff } from "@/types/staff.types";

export async function authorsPageSchema(
  authors: Staff[],
  lang: Lang
): Promise<WithContext<CollectionPage>> {
  const dict = await getTranslations(lang);
  const siteURL = process.env.NEXT_PUBLIC_SITE_URL!;
  const pageUrl = `${siteURL}/${lang}/authors`;

  const breadcrumbSchema: BreadcrumbList = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: dict.metadata?.pages?.home || "Home",
        item: `${siteURL}/${lang}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: dict.metadata?.pages?.authors || "Authors",
        item: pageUrl,
      },
    ],
  };

  const organizationSchema: Organization = {
    "@type": "Organization",
    name: dict.metadata?.siteName || "News Website",
    url: siteURL,
    logo: `${siteURL}/logo.png`,
    sameAs: [
      `${siteURL}/en`,
      `${siteURL}/ar`,
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: dict.metadata?.organization?.contactType || "editorial",
      availableLanguage: ["en", "ar"],
    },
    knowsAbout: dict.metadata?.organization?.knowsAbout || [
      "World News",
      "Politics",
      "Technology",
      "Business",
      "Sports",
      "Entertainment",
      "Health",
      "Science",
    ],
  };

  const itemListSchema: ItemList = {
    "@type": "ItemList",
    numberOfItems: authors.length,
    itemListElement: authors.map((author, index) => ({
      "@type": "Person",
      position: index + 1,
      name: author.name,
      description: author.bio || `${author.name} - Author and Reporter`,
      url: `${siteURL}/${lang}/authors/${author.slug}`,
      identifier: author.slug,
      jobTitle: "Author",
      worksFor: organizationSchema,
      additionalProperty: {
        "@type": "PropertyValue",
        name: "Article Count",
        value: author.articleCount || 0,
      },
    })),
  };

  const collectionPageSchema: CollectionPage = {
    "@type": "CollectionPage",
    name: dict.metadata?.pages?.authors || "Authors",
    description: `${dict.metadata?.descriptions?.authors} - Discover content by our talented authors and reporters. Find articles written by your favorite journalists.`,
    url: pageUrl,
    inLanguage: lang,
    keywords: [
      ...(dict.metadata?.keywords?.authors || []),
      "content discovery",
      "author profiles",
      "journalist profiles",
      "reporter profiles",
      "content creators",
    ].join(", "),
    publisher: organizationSchema,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
      name: dict.metadata?.pages?.authors || "Authors",
      description: dict.metadata?.descriptions?.authors || "Meet our talented authors and reporters",
      breadcrumb: breadcrumbSchema,
    },
    mainEntity: itemListSchema,
  };

  return {
    "@context": "https://schema.org",
    ...collectionPageSchema,
  };
}
