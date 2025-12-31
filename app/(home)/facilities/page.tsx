import { Suspense } from 'react';

import {
  FacilitiesSection,
  FacilitiesSectionSkeleton,
} from '@/components/website/facilities/facilities-section';
import { CTASection } from '@/components/website/common/cta-section';

import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import SectionHeader from '@/components/website/common/section-header';
import { Building2 } from 'lucide-react';
import CustomSearch from '@/components/shared/search/custom-search';

interface Props {
  searchParams?: Promise<{
    search?: string;
    page?: string;
    limit?: string;
    type?: string;
    solutionId?: string;
  }>;
}

export function generateMetadata() {
  return createEnhancedMetadata({
    title: 'Professional Media Facilities | MAP',
    description:
      'Explore our state-of-the-art media production facilities including studios, OB vans, flight cases, and SNG units designed for professional broadcasting.',
    pathname: '/facilities',
    mainOverrides: {
      category: 'Media Production Facilities',
    },
  });
}

export default async function FacilitiesPage(props: Props) {
  const searchParams = await props.searchParams;

  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 12;
  const search = searchParams?.search || '';
  const type = searchParams?.type || undefined;
  const solutionId = searchParams?.solutionId ? Number(searchParams.solutionId) : undefined;

  return (
    <section className="pt-edge-nav-margin container space-y-4">
      <SectionHeader
        BadgeText="Facilities"
        title="Our "
        highlightedText="Facilities"
        description="State-of-the-art media production facilities designed for professional broadcasting and content creation."
        Icon={Building2}
      />

      <div className="mb-16 flex w-full items-center justify-center gap-4">
        <CustomSearch
          query="search"
          placeholder="Search facilities..."
          Icon={
            <Building2 className="text-primary absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 transform" />
          }
          className="w-full sm:w-2xl"
        />
      </div>

      <Suspense
        key={`${page} | ${search} | ${type} | ${solutionId}`}
        fallback={<FacilitiesSectionSkeleton />}
      >
        <FacilitiesSection page={page} limit={limit} search={search} type={type} solutionId={solutionId} />
      </Suspense>

      <div className="section-padding">
        <CTASection
          title="Want to Learn More?"
          description="Explore our facilities and discover how we can support your media production and broadcasting needs. Get in touch with our team for personalized guidance."
          buttons={[
            { text: 'Contact Us', href: '/contact' },
            { text: 'View Solutions', href: '/solutions' },
          ]}
        />
      </div>
    </section>
  );
}
