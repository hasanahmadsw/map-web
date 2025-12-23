import { Suspense } from 'react';

import type { Metadata } from 'next';

import {
  SolutionsSection,
  SolutionsSectionSkeleton,
} from '@/components/sections/solutions/solutions-section';

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
    title: 'Solutions',
    description: 'Discover our professional media production and broadcasting solutions',
    pathname: '/solutions',
  });
}

export default async function SolutionsPage(props: Props) {
  const searchParams = await props.searchParams;

  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 12;
  const search = searchParams?.search || '';
  const isFeatured = searchParams?.isFeatured === 'true' ? true : undefined;

  return (
    <section className="container mx-auto max-w-7xl space-y-4 py-10">
      {/* Header */}
      <header>
        <h1 className="mb-3 max-w-2xl text-3xl font-medium">Our Solutions</h1>
        <p className="text-muted-foreground max-w-2xl pb-6">
          Professional media production and broadcasting solutions tailored to your needs
        </p>
      </header>

      <Suspense
        key={`${page} | ${search} | ${isFeatured ? 'featured' : 'all'}`}
        fallback={<SolutionsSectionSkeleton />}
      >
        <SolutionsSection page={page} limit={limit} search={search} isFeatured={isFeatured} />
      </Suspense>
    </section>
  );
}
