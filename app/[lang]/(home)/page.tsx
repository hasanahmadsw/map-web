import React from 'react'
import { newsHomePageSchema } from "@/utils/seo/schema/newsHomePageSchema";
import { createEnhancedMetadata } from "@/utils/seo/meta/enhanced-meta";
import type { Metadata } from "next";
import { Lang, getTranslations, sanitizeLang } from '@/utils/dictionary-utils';
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
  const { lang: rawLang } = await params;
  const lang = sanitizeLang(rawLang);
  const {metadata:dict} = await getTranslations(lang);

  const metaData = createEnhancedMetadata({
    lang,
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
  const { lang: rawLang } = await params;
  const lang = sanitizeLang(rawLang);
  const t = await getTranslations(lang);
  
  const jsonLd = await newsHomePageSchema(lang);

  return (
     <div className="bg-dark-section relative min-h-screen overflow-hidden">
      {/* Background Pattern */}
    

      {/* Gradient Orbs */}
      <div className="orb-blue-large absolute top-0 -left-40 h-[30rem] w-[30rem]" />
      <div className="orb-purple-large absolute top-1/4 -right-40 h-[30rem] w-[30rem]" />
      <div className="orb-blue-large absolute top-1/2 -left-40 h-[30rem] w-[30rem]" />
      <div className="orb-purple-large absolute top-3/4 -right-40 h-[30rem] w-[30rem]" />
      <div className="orb-blue-large absolute bottom-0 -left-40 h-[30rem] w-[30rem]" />
      <div className="orb-purple-large absolute -right-40 bottom-0 h-[30rem] w-[30rem]" />
      <script
        id="news-home-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <main className="min-h-screen max-w-7xl mx-auto">
        <HeroSection lang={lang} t={t} />
        <StatisticsSection lang={lang} t={t} />
        <SolutionsSection lang={lang} t={t} />
        <ServicesSection lang={lang} t={t} />
        <ArticlesSection lang={lang} t={t} />
        <FAQSection lang={lang} t={t} />
        <CTASection lang={lang} t={t} />
      </main>
    </div>
  );
}

