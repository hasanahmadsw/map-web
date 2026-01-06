import { CTASection } from '@/components/website/common/cta-section';
import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import { PageHeroSection } from '@/components/website/common/page-hero-section';
import { FeaturesGridSection } from '@/components/website/common/features-grid-section';
import { UseCasesSection } from '@/components/website/common/use-cases-section';
import { StatsSection } from '@/components/website/common/stats-section';
import { ProcessSection } from '@/components/website/common/process-section';
import { ItemsGridSection } from '@/components/website/common/items-grid-section';
import { Lightbulb } from 'lucide-react';
import { allSolutionKeys } from '@/components/website/solutions/data-utils';
import { features, processSteps, stats, useCases } from '@/components/website/solutions/data';

export function generateMetadata() {
  return createEnhancedMetadata({
    title: 'Media Solutions | MAP Media Art Production',
    description:
      'Discover tailored media solutions including video production, photography, and events management designed to elevate brands and engage audiences.',
    pathname: '/solutions',
    mainOverrides: {
      category: 'Media Production Solutions',
    },
  });
}

export default async function SolutionsPage() {
  return (
    <div className="bg-background min-h-screen">
      <PageHeroSection
        imageSrc="/hero.webp"
        imageAlt="Professional Media Solutions"
        badgeIcon={Lightbulb}
        badgeText="Media Solutions"
        title="Creative Media"
        highlightedText="Solutions"
        description="Comprehensive media solutions designed to elevate your brand and engage your audience. From video production to photography and events management, we provide end-to-end solutions for your media needs."
        secondaryDescription="At MAP, we specialize in delivering tailored media solutions that combine creativity, technology, and expertise. Our diverse range of solutions ensures you have the right tools for any media production scenario."
        height="h-[70vh] md:h-[80vh]"
      />

      {/* Main Content */}
      <section className="container space-y-16 py-16">
        <ItemsGridSection
          title="Our Solutions"
          description="Choose the perfect solution for your media production needs"
          items={allSolutionKeys.map(solutionKey => ({
            icon: solutionKey.icon,
            title: solutionKey.title,
            description: solutionKey.description,
            features: solutionKey.keywords,
            slug: solutionKey.slug,
            id: solutionKey.key,
          }))}
          basePath="/solutions"
        />

        <FeaturesGridSection
          title="Why Choose Our Solutions?"
          description="Professional-grade services and expertise for every project"
          items={features}
          gridCols="3"
          hoverScale="1.02"
          iconColor="custom"
        />

        <StatsSection
          title="Our Track Record"
          description="Trusted by businesses and brands across the region"
          stats={stats}
        />

        <ProcessSection
          title="How It Works"
          description="Simple steps to get your media solution started"
          steps={processSteps}
        />

        <UseCasesSection
          title="Perfect For"
          description="Our solutions excel in various business scenarios"
          useCases={useCases}
          gridCols="4"
        />

        {/* CTA Section */}
        <div className="section-padding">
          <CTASection
            title="Ready to Start Your Next Project?"
            description="Contact our team to discuss your media solution requirements and discover how our solutions can elevate your brand and engage your audience."
            buttons={[
              { text: 'Contact Us', href: '/contact' },
              { text: 'View Services', href: '/services' },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
