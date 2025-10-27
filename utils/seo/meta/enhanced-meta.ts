import seoConfig from "./seo.config";
import { buildTwitter } from "./buildTwitter";
import { buildOpenGraph } from "./buildOpenGraph";

import type { Metadata } from "next";
import { Lang } from "@/utils/dictionary-utils";

export interface EnhancedMetadata {
   lang: Lang;
   title: string | { absolute: string };
   description: string;
   type?: "website" | "article";
   image?: string;
   keywords?: string[];
   publishedTime?: string;
   modifiedTime?: string;
   authors?: { name: string; url?: string }[];
   pathname?: string;
   openGraphOverrides?: Partial<Metadata["openGraph"]>;
   twitterOverrides?: Partial<Metadata["twitter"]>;
}

/**
 * Generates enhanced SEO metadata for Next.js pages.
 * @param input EnhancedMetadata
 * @returns Metadata object for Next.js
 */
export function createEnhancedMetadata(input: EnhancedMetadata): Metadata {
   const {
      lang,
      title,
      description,
      type = "website",
      keywords = [],
      publishedTime,
      modifiedTime,
      authors,
      pathname = "",
      openGraphOverrides,
      twitterOverrides,
      image,
   } = input;
   const siteName = seoConfig.siteName;
   const siteURL = process.env.NEXT_PUBLIC_SITE_URL!;

   return {
      title,
      description,
      keywords,
      openGraph: buildOpenGraph({
         lang,
         title,
         description,
         type,
         image,
         siteName,
         siteURL,
         publishedTime,
         modifiedTime,
         authors,
         pathname,
         openGraphOverrides,
      }),
      twitter: buildTwitter({
         title,
         description,
         image,
         siteURL,
         twitterOverrides,
      }),
      robots: { index: true, follow: true },
      alternates: {
         canonical: `${siteURL}/${lang}${pathname}`,
         languages: {
            en: `${siteURL}/en${pathname}`,
            ar: `${siteURL}/ar${pathname}`,
         },
      },
      ...(type === "article" &&
         authors && {
            authors,
         }),
      applicationName: siteName,
   };
}
