import { WebSite, NewsMediaOrganization, WithContext } from "schema-dts";
import { getTranslations, Lang } from "@/utils/dictionary-utils";

export async function newsHomePageSchema(
  lang: Lang
): Promise<WithContext<WebSite>> {
  const dict = await getTranslations(lang);

  const siteURL = process.env.NEXT_PUBLIC_SITE_URL 
  
  const socialMediaLinks = [
    "https://www.facebook.com/newswebsite",
    "https://www.twitter.com/newswebsite",
    "https://www.linkedin.com/company/newswebsite",
    "https://www.instagram.com/newswebsite",
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: dict.metadata?.siteName,
    description: dict.metadata?.descriptions?.home,
    url: siteURL,
    inLanguage: lang,
    keywords: dict.metadata?.keywords?.home?.join(", "),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteURL}/${lang}`,
      name: dict.metadata?.pages?.home,
      description: dict.metadata?.descriptions?.home,
      isPartOf: {
        "@type": "WebSite",
        "@id": siteURL,
      },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: dict.metadata?.pages?.home,
            item: `${siteURL}/${lang}`,
          },
        ],
      },
    },
    publisher: {
      "@type": "Organization",
      name: dict.metadata?.siteName,
      description: dict.metadata?.descriptions?.home,
      url: siteURL,
      logo: {
        "@type": "ImageObject",
        url: `${siteURL}/images/logo.png`,
      },
      sameAs: socialMediaLinks,
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
    },
  };
}
