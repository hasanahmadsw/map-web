import { Suspense } from 'react';

import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import type { Metadata } from 'next';
import { HeroSection } from '@/components/website/home/hero-section';
import { SolutionsSection } from '@/components/website/home/solutions/solutions-section';
import { ServicesSection } from '@/components/website/home/services/services-section';
import { ArticlesSection } from '@/components/website/home/articles/articles-section';

import SectionSkeleton from '@/components/shared/skeletons/section-skeletion';
import AboutUs from '@/components/website/home/about-us/about-us';
import { homeSchema } from '@/utils/seo/schema/home/home-schema';

export async function generateMetadata(): Promise<Metadata> {
  const metaData = createEnhancedMetadata({
    title: 'MAP Media Art Production | Best Media Solutions in Middle East',
    description:
      'MAP Media Art Production is a leading media production company in the UAE, delivering creative video, film, and digital content across the Middle East.',
    pathname: '/',
    mainOverrides: {
      category: 'media production',
    },
    openGraphOverrides: {
      section: 'media production',
    },
  });

  return metaData;
}

export default async function Page() {
  // Markup Schema
  const jsonLd = await homeSchema();

  return (
    <>
      {/* JSON-LD */}
      <script
        id="home-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />

      {/* Hero Section */}
      <HeroSection />

      {/* Solutions Section */}
      <Suspense fallback={<SectionSkeleton />}>
        <SolutionsSection />
      </Suspense>

      {/* About Us Section */}
      <AboutUs />

      {/* Services Section */}
      <Suspense fallback={<SectionSkeleton />}>
        <ServicesSection />
      </Suspense>

      {/* Articles Section */}
      <Suspense fallback={<SectionSkeleton />}>
        <ArticlesSection />
      </Suspense>
    </>
  );
}
