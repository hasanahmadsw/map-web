import { Suspense } from 'react';

import type { Metadata } from 'next';

import { ServicesSection } from '@/components/website/services/services-section';
import { ServicesSectionSkeleton } from '@/components/website/services/services-section-skeleton';

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
    <div className="pt-edge-nav-margin container mx-auto max-w-7xl space-y-4 py-10">
      <header>
        <h1 className="mb-3 max-w-2xl text-3xl font-medium">Our Services</h1>
        <p className="text-muted-foreground max-w-2xl pb-6">
          Professional media production and broadcasting services tailored to your needs
        </p>
      </header>

      <Suspense
        key={`${page} | ${search} | ${isFeatured ? 'featured' : 'all'}`}
        fallback={<ServicesSectionSkeleton />}
      >
        <ServicesSection page={page} limit={limit} search={search} isFeatured={isFeatured} />
      </Suspense>
    </div>
  );
}
