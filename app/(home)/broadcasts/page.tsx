import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import { CTASection } from '@/components/website/common/cta-section';
import { broadcastsSchema } from '@/utils/seo/schema/broadcasts/broadcasts-schema';

import { PageHeroSection } from '@/components/website/common/page-hero-section';
import { FeaturesGridSection } from '@/components/website/common/features-grid-section';
import { UseCasesSection } from '@/components/website/common/use-cases-section';
import { StatsSection } from '@/components/website/common/stats-section';
import { ProcessSection } from '@/components/website/common/process-section';

import {
  benefits,
  broadcastTypes,
  useCases,
  stats,
  processSteps,
} from '@/components/website/broadcasts/data';
import { ItemsGridSection } from '@/components/website/common/items-grid-section';

export function generateMetadata() {
  return createEnhancedMetadata({
    title: 'Broadcast Solutions | MAP Media Art Production',
    description:
      'Explore our comprehensive range of professional broadcast solutions including OBVAN units, Flight Cases, SNG systems, and Internet Broadcasting solutions designed for modern media production.',
    pathname: '/broadcasts',
    mainOverrides: {
      category: 'Media Production Broadcasts',
    },
  });
}

export default async function BroadcastsPage() {
  const jsonLd = await broadcastsSchema(broadcastTypes);

  return (
    <>
      {/* JSON-LD */}
      <script
        id="broadcasts-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />

      <PageHeroSection
        imageSrc="/hero.webp"
        imageAlt="Professional Broadcast Solutions"
        badgeText="Broadcast Solutions"
        title="Professional Media"
        highlightedText="Broadcast Systems"
        description="Comprehensive broadcast solutions designed for modern media production. From mobile OBVAN units to portable flight cases, we provide cutting-edge technology for every broadcasting need."
        secondaryDescription="At MAP, we specialize in providing state-of-the-art broadcast equipment and solutions for professional media production."
      />

      {/* Main Content */}
      <section className="section-padding container space-y-16">
        <ItemsGridSection
          title="Our Broadcast Solutions"
          description="Choose the perfect broadcast system for your production needs"
          items={broadcastTypes.map(broadcast => ({
            icon: broadcast.icon,
            title: broadcast.label,
            description: broadcast.description,
            features: broadcast.features,
            slug: broadcast.slug,
            id: broadcast.type,
          }))}
          basePath="/broadcasts"
        />
        <FeaturesGridSection
          title="Why Choose Our Broadcast Solutions?"
          description="Professional-grade equipment and expertise for every production"
          items={benefits}
          gridCols="3"
          hoverScale="1.02"
          iconColor="custom"
        />
        <StatsSection
          title="Our Track Record"
          description="Trusted by broadcast professionals across the region"
          stats={stats}
        />
        <ProcessSection
          title="How It Works"
          description="Simple steps to get your broadcast production started"
          steps={processSteps}
        />
        <UseCasesSection
          title="Perfect For"
          description="Our broadcast solutions excel in various production scenarios"
          useCases={useCases}
          gridCols="4"
        />

        {/* CTA Section */}
        <div className="section-padding">
          <CTASection
            title="Ready to Start Your Next Production?"
            description="Contact our team to discuss your broadcast requirements and discover how our solutions can elevate your media production capabilities."
            buttons={[
              { text: 'Contact Us', href: '/contact' },
              { text: 'View Solutions', href: '/solutions' },
            ]}
          />
        </div>
      </section>
    </>
  );
}
