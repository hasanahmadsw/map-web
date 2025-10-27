import { BreadcrumbList, Organization, Person, WebPage, WithContext } from "schema-dts";
import { getTranslations, Lang } from "@/utils/dictionary-utils";
import type { Staff as CustomStaff } from "@/types/staff.types";
import type { Article as CustomArticle } from "@/types/article.types";

export async function authorPageSchema(
  author: CustomStaff,
  articles: CustomArticle[],
  lang: Lang
): Promise<WithContext<Person>> {
  const dict = await getTranslations(lang);
  const siteURL = process.env.NEXT_PUBLIC_SITE_URL!;
  const authorUrl = `${siteURL}/${lang}/authors/${author.slug}`;

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
        item: `${siteURL}/${lang}/authors`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: author.name,
        item: authorUrl,
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

  const personSchema: Person = {
    "@type": "Person",
    name: author.name,
    description: author.bio || `${author.name} - Author and Reporter at ${dict.metadata?.siteName}`,
    url: authorUrl,
    identifier: author.slug,
    jobTitle: "Author",
    worksFor: organizationSchema,
    inLanguage: lang,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": authorUrl,
      name: author.name,
      description: author.bio || `${author.name} - Author and Reporter`,
      breadcrumb: breadcrumbSchema,
    },
    ...(author.email && {
      email: author.email,
    }),
    ...(articles && articles.length > 0 && {
      hasOccupation: {
        "@type": "Occupation",
        name: "Author",
        description: "News author and reporter",
        occupationLocation: {
          "@type": "Place",
          name: dict.metadata?.siteName || "News Website",
        },
      },
      knowsAbout: articles
        .flatMap(article => [
          ...(article.tags?.map((tag: any) => tag.name) || []),
          ...(article.topics?.map((topic: any) => topic.name) || []),
        ])
        .filter((value, index, self) => self.indexOf(value) === index)
        .slice(0, 10),
    }),
  };

  return {
    "@context": "https://schema.org",
    ...personSchema,
  };
}
