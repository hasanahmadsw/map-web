import { Suspense } from 'react';

import type { Metadata } from 'next';

import { ServicesSection } from '@/components/sections/services/services-section';
import { ServicesSectionSkeleton } from '@/components/sections/services/services-section-skeleton';
import { getTranslations, sanitizeLang } from '@/utils/dictionary-utils';
import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';

interface Props {
  searchParams?: Promise<{
    search?: string;
    page?: string;
    limit?: string;
    isFeatured?: string;
  }>;
}

export function generateMetadata() {
  return createEnhancedMetadata({
    lang: 'en',
    title: 'Our Services',
    description: 'Professional media production and broadcasting services tailored to your needs',
    type: 'website',
    pathname: '/services',
  });
}

export default async function ServicesPage(props: Props) {
  const searchParams = await props.searchParams;

  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 12;
  const search = searchParams?.search || '';
  const isFeatured = searchParams?.isFeatured === 'true' ? true : undefined;

  return (
    <div className="container mx-auto max-w-7xl py-10">
      <div className="space-y-4">
        <div>
          <h1 className="mb-3 max-w-2xl text-3xl font-medium">Our Services</h1>
          <p className="text-muted-foreground max-w-2xl pb-6">
            Professional media production and broadcasting services tailored to your needs
          </p>
        </div>

        <Suspense
          key={`${page} | ${search} | ${isFeatured ? 'featured' : 'all'}`}
          fallback={<ServicesSectionSkeleton />}
        >
          <ServicesSection page={page} limit={limit} search={search} isFeatured={isFeatured} />
        </Suspense>
      </div>
    </div>
  );
}
