import { Suspense } from 'react';

import { SolutionsSection, SolutionsSectionSkeleton } from '@/components/website/solutions/solutions-section';
import { SolutionsCTASection } from '@/components/website/solutions/solutions-cta-section';

import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import SectionHeader from '@/components/website/home/about-us/home-headers';
import { Lightbulb } from 'lucide-react';
import CustomSearch from '@/components/shared/search/custom-search';

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
    title: 'Creative Media Solutions for Brands & Businesses | MAP',
    description:
      'Discover tailored media solutions including video production, storytelling, and digital content designed to elevate brands and engage audiences.',
    pathname: '/solutions',
    mainOverrides: {
      category: 'Media Production Solutions',
    },
  });
}

export default async function SolutionsPage(props: Props) {
  const searchParams = await props.searchParams;

  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 12;
  const search = searchParams?.search || '';

  return (
    <section className="pt-edge-nav-margin container mx-auto max-w-7xl space-y-4 py-10">
      <SectionHeader
        BadgeText="Solutions"
        title="Our "
        highlightedText="Solutions"
        description="We offer a wide range of solutions to meet your media production and broadcasting needs."
        Icon={Lightbulb}
      />

      <div className="mb-16 flex w-full items-center justify-center gap-4">
        <CustomSearch
          query="search"
          placeholder="Search solutions..."
          Icon={
            <Lightbulb className="text-primary absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 transform" />
          }
          className="w-full sm:w-2xl"
        />
      </div>

      <Suspense key={`${page} | ${search}`} fallback={<SolutionsSectionSkeleton />}>
        <SolutionsSection page={page} limit={limit} search={search} />
      </Suspense>

      <div className="mt-16 max-w-6xl">
        <SolutionsCTASection />
      </div>
    </section>
  );
}
