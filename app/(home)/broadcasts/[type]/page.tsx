import { notFound } from 'next/navigation';
import { CTASection } from '@/components/website/common/cta-section';
import { PageHeroSection } from '@/components/website/common/page-hero-section';
import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import { Building2 } from 'lucide-react';
import { BroadcastType } from '@/types/broadcasts/broadcast.enums';
import { getTypeFromSlug, getTypeMetadata } from '@/components/website/broadcasts/data-utils';
import { FeaturesGridSection } from '@/components/website/common/features-grid-section';
import { UseCasesSection } from '@/components/website/common/use-cases-section';

import { FeaturesListSection } from '@/components/website/common/features-list-section';
import {
  BroadcastsSection,
  BroadcastsSectionSkeleton,
} from '@/components/website/broadcasts/type/broadcasts-section';
import { Suspense } from 'react';

interface Props {
  params: Promise<{
    type: string;
  }>;
  searchParams?: Promise<{
    search?: string;
    page?: string;
    limit?: string;
  }>;
}

function formatBroadcastType(type: BroadcastType): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

export async function generateMetadata({ params }: Props) {
  const { type } = await params;
  const broadcastType = getTypeFromSlug(type);

  if (!broadcastType) {
    return createEnhancedMetadata({
      title: 'Broadcast Units | MAP Media Art Production',
      description: 'Explore our professional broadcast units.',
      pathname: `/broadcasts/${type}`,
    });
  }

  const metadata = getTypeMetadata(broadcastType);

  return createEnhancedMetadata({
    title: metadata.title,
    description: metadata.description,
    pathname: `/broadcasts/${type}`,
    mainOverrides: {
      category: `${formatBroadcastType(broadcastType)} Broadcast Units`,
    },
  });
}

export default async function BroadcastTypePage(props: Props) {
  const { type } = await props.params;
  const searchParams = await props.searchParams;

  const broadcastType = getTypeFromSlug(type);

  if (!broadcastType) {
    notFound();
  }

  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 12;
  const search = searchParams?.search || '';

  const metadata = getTypeMetadata(broadcastType);

  return (
    <div className="bg-background min-h-screen">
      <PageHeroSection
        imageSrc="/hero.webp"
        imageAlt={`${metadata.badgeText} Broadcast Units`}
        badgeIcon={Building2}
        badgeText={metadata.badgeText}
        title={metadata.headerTitle}
        highlightedText={metadata.highlightedText}
        description={metadata.headerDescription}
        secondaryDescription={metadata.description}
      />

      {/* Main Content */}
      <section className="section-padding container space-y-16">
        <FeaturesListSection
          title="Key Features"
          description={`What makes our ${metadata.badgeText} units exceptional`}
          features={metadata.features}
          gridCols="3"
        />
        <FeaturesGridSection
          title={`Why Choose ${metadata.badgeText}?`}
          description={`Key advantages of our ${metadata.badgeText.toLowerCase()} broadcast solutions`}
          items={metadata.benefits}
          gridCols="3"
          hoverScale="1.01"
          iconColor="primary"
        />
        <UseCasesSection
          title="Perfect For"
          description={`Ideal scenarios for ${metadata.badgeText.toLowerCase()} broadcast units`}
          useCases={metadata.useCases}
          gridCols="3"
        />

        <Suspense key={`${page} | ${search}`} fallback={<BroadcastsSectionSkeleton />}>
          <BroadcastsSection
            page={page}
            limit={limit}
            search={search}
            type={broadcastType}
            badgeText={metadata.badgeText}
          />
        </Suspense>

        {/* CTA Section */}
        <div className="section-padding">
          <CTASection
            title="Ready to Get Started?"
            description={`Explore our ${metadata.badgeText} units and discover how we can support your broadcasting needs. Get in touch with our team for personalized guidance and custom solutions.`}
            buttons={[
              { text: 'Contact Us', href: '/contact' },
              { text: 'View All Broadcasts', href: '/broadcasts' },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
