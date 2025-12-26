import { Suspense } from 'react';

import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import type { Metadata } from 'next';
import { HeroSection } from '@/components/website/home/hero-section';
import { SolutionsSection } from '@/components/website/home/solutions-section';
import { ServicesSection } from '@/components/website/home/services-section';
import { ArticlesSection } from '@/components/website/home/articles-section';

import SectionSkeleton from '@/components/shared/skeletons/section-skeletion';
import AboutUs from '@/components/website/home/about-us/about-us';

export async function generateMetadata(): Promise<Metadata> {
  const metaData = createEnhancedMetadata({
    title: 'Media Production Company in UAE | MAP Media Art Production',
    description:
      'MAP Media Art Production is a leading media production company in the UAE, delivering creative video, film, and digital content across the Middle East.',
    pathname: '/',
    mainOverrides: {
      category: 'media production',
    },
  });

  return metaData;
}

export default async function Page() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Pattern */}

      {/* Optimized Gradient Orbs - Reduced count and added will-change for performance */}
      {/* <div className="orb-blue-large absolute top-0 -left-40 h-120 w-120 will-change-transform" />
      <div className="orb-purple-large absolute top-1/4 -right-40 h-120 w-120 will-change-transform" />
      <div className="orb-blue-large absolute top-1/2 -left-40 h-120 w-120 will-change-transform" />
      <div className="orb-purple-large absolute top-3/4 -right-40 h-120 w-120 will-change-transform" /> */}

      {/* <script
        id="news-home-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      /> */}
      <HeroSection />
      {/* Solutions Section */}
      <Suspense fallback={<SectionSkeleton />}>
        <SolutionsSection />
      </Suspense>

      <AboutUs />
      <main className="mx-auto min-h-screen max-w-7xl">
        {/* Hero Section */}

        {/* Statistics Section */}
        {/* <StatisticsSection /> */}

        {/* Services Section */}
        <Suspense fallback={<SectionSkeleton />}>
          <ServicesSection />
        </Suspense>

        {/* Articles Section */}
        <Suspense fallback={<SectionSkeleton />}>
          <ArticlesSection />
        </Suspense>

        {/* FAQ Section */}
        {/* <FAQSection /> */}

        {/* CTA Section */}
        {/* <CTASection /> */}
      </main>
    </div>
  );
}
