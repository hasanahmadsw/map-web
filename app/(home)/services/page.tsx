import { Suspense } from 'react';

import { ServicesSection } from '@/components/website/services/services-section';
import { ServicesSectionSkeleton } from '@/components/website/services/services-section-skeleton';
import { ServicesCTASection } from '@/components/website/services/services-cta-section';

import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import SectionHeader from '@/components/website/home/about-us/home-headers';
import { Settings } from 'lucide-react';
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
    title: 'Professional Media Production Services in UAE | MAP',
    description:
      'Explore our full range of media production services, from video filming and editing to post-production, animation, and branded content.',
    pathname: '/services',
    mainOverrides: {
      category: 'Media Production Services',
    },
  });
}

export default async function ServicesPage(props: Props) {
  const searchParams = await props.searchParams;

  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 12;
  const search = searchParams?.search || '';

  return (
    <div className="pt-edge-nav-margin container mx-auto max-w-7xl space-y-4 py-10">
      <SectionHeader
        BadgeText="Services"
        title="Our"
        highlightedText="Services"
        description="We offer a wide range of services to meet your media production and broadcasting needs."
        Icon={Settings}
      />

      <div className="mb-16 flex w-full items-center justify-center gap-4">
        <CustomSearch
          query="search"
          placeholder="Search services..."
          Icon={
            <Settings className="text-primary absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 transform" />
          }
          className="w-full sm:w-2xl"
        />
      </div>

      <Suspense key={`${page} | ${search}`} fallback={<ServicesSectionSkeleton />}>
        <ServicesSection page={page} limit={limit} search={search} />
      </Suspense>

      <div className="mx-auto mt-16 max-w-5xl px-4">
        <ServicesCTASection />
      </div>
    </div>
  );
}
