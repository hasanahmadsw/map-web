import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import { CTASection } from '@/components/website/common/cta-section';
import { broadcastsSchema } from '@/utils/seo/schema/broadcasts/broadcasts-schema';

import { PageHeroSection } from '@/components/website/common/page-hero-section';
import { FeaturesGridSection } from '@/components/website/common/features-grid-section';
import { UseCasesSection } from '@/components/website/common/use-cases-section';
import { BroadcastsTypesGrid } from '@/components/website/broadcasts/main/broadcasts-types-grid';
import { BroadcastsStatsSection } from '@/components/website/broadcasts/main/broadcasts-stats-section';
import { BroadcastsProcessSection } from '@/components/website/broadcasts/main/broadcasts-process-section';
import { benefits, broadcastTypes, useCases } from '@/components/website/broadcasts/main/data';

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
        secondaryDescription="At MAP, we specialize in providing state-of-the-art broadcast equipment and solutions for professional media production. Our diverse range of broadcast systems ensures you have the right tools for any production scenario."
      />

      {/* Main Content */}
      <section className="section-padding container space-y-16">
        <BroadcastsTypesGrid />
        <FeaturesGridSection
          title="Why Choose Our Broadcast Solutions?"
          description="Professional-grade equipment and expertise for every production"
          items={benefits}
          gridCols="3"
          hoverScale="1.02"
          iconColor="custom"
        />
        <BroadcastsStatsSection />
        <BroadcastsProcessSection />
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
