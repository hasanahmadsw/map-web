import React from 'react'
import { newsHomePageSchema } from "@/utils/seo/schema/newsHomePageSchema";
import { createEnhancedMetadata } from "@/utils/seo/meta/enhanced-meta";
import type { Metadata } from "next";
import { Lang, getTranslations } from '@/utils/dictionary-utils';
import { HeroSection } from "@/components/home/hero-section";
import { StatisticsSection } from "@/components/home/statistics-section";
import { SolutionsSection } from "@/components/home/solutions-section";
import { ServicesSection } from "@/components/home/services-section";
import { ArticlesSection } from "@/components/home/articles-section";
import { FAQSection } from "@/components/home/faq-section";
import { CTASection } from "@/components/home/cta-section";

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
  const t = await getTranslations(lang as Lang);
  
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
      <main className="min-h-screen bg-background max-w-7xl mx-auto">
        <HeroSection lang={lang} t={t} />
        <StatisticsSection lang={lang} t={t} />
        <SolutionsSection lang={lang} t={t} />
        <ServicesSection lang={lang} t={t} />
        <ArticlesSection lang={lang} t={t} />
        <FAQSection lang={lang} t={t} />
        <CTASection lang={lang} t={t} />
      </main>
    </>
  );
}

