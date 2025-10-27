import React from 'react'
import ClientHome from './client-home'
import { newsHomePageSchema } from "@/utils/seo/schema/newsHomePageSchema";
import { createEnhancedMetadata } from "@/utils/seo/meta/enhanced-meta";
import type { Metadata } from "next";
import { Lang, getTranslations } from '@/utils/dictionary-utils';

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const {metadata:dict} = await getTranslations(lang as Lang);

  const metaData = createEnhancedMetadata({
    lang: lang as Lang,
    title: { absolute: dict.pages?.home },
    description: dict.descriptions?.home,
    keywords: dict.keywords?.home,
  });

  return metaData;
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  
  const jsonLd = await newsHomePageSchema(lang as Lang);

  return (
    <>
      <script
        id="news-home-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ClientHome />
    </>
  );
}

