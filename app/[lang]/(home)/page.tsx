import React, { Suspense } from 'react';
import { newsHomePageSchema } from '@/utils/seo/schema/newsHomePageSchema';
import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import type { Metadata } from 'next';
import { Lang, getTranslations, sanitizeLang } from '@/utils/dictionary-utils';
import { HeroSection } from '@/components/website/home/hero-section';
import { StatisticsSection } from '@/components/website/home/statistics-section';
import { SolutionsSection } from '@/components/website/home/solutions-section';
import { ServicesSection } from '@/components/website/home/services-section';
import { ArticlesSection } from '@/components/website/home/articles-section';
import { FAQSection } from '@/components/website/home/faq-section';
import { CTASection } from '@/components/website/home/cta-section';

export const dynamic = 'force-dynamic';

// Loading fallback component
function SectionSkeleton() {
  return (
    <div className="w-full py-16">
      <div className="container max-w-7xl">
        <div className="bg-muted/50 mb-4 h-8 w-64 animate-pulse rounded" />
        <div className="bg-muted/30 mb-8 h-4 w-96 animate-pulse rounded" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-muted/30 h-64 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = sanitizeLang(rawLang);
  const { metadata: dict } = await getTranslations(lang);

  const metaData = createEnhancedMetadata({
    lang,
    title: { absolute: dict.pages?.home },
    description: dict.descriptions?.home,
    keywords: dict.keywords?.home,
  });

  return metaData;
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = sanitizeLang(rawLang);
  const t = await getTranslations(lang);

  const jsonLd = await newsHomePageSchema(lang);

  return (
    <div className="bg-dark-section relative min-h-screen overflow-hidden">
      {/* Background Pattern */}

      {/* Optimized Gradient Orbs - Reduced count and added will-change for performance */}
      <div className="orb-blue-large absolute top-0 -left-40 h-[30rem] w-[30rem] will-change-transform" />
      <div className="orb-purple-large absolute top-1/4 -right-40 h-[30rem] w-[30rem] will-change-transform" />
      <div className="orb-blue-large absolute top-1/2 -left-40 h-[30rem] w-[30rem] will-change-transform" />
      <div className="orb-purple-large absolute top-3/4 -right-40 h-[30rem] w-[30rem] will-change-transform" />

      <script
        id="news-home-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <main className="mx-auto min-h-screen max-w-7xl">
        {/* Above-the-fold sections - no Suspense for immediate render */}
        <HeroSection lang={lang} t={t} />
        <StatisticsSection lang={lang} t={t} />

        {/* Below-the-fold sections - wrapped in Suspense for streaming */}
        <Suspense fallback={<SectionSkeleton />}>
          <SolutionsSection lang={lang} t={t} />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <ServicesSection lang={lang} t={t} />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <ArticlesSection lang={lang} t={t} />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <FAQSection lang={lang} t={t} />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <CTASection lang={lang} t={t} />
        </Suspense>
      </main>
    </div>
  );
}
