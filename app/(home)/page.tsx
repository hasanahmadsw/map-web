import { Suspense } from 'react';

import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import type { Metadata } from 'next';
import {
  PageHero,
  PageSection,
  PageIntro,
  PageUseCasesGrid,
  PageInternalLinks,
} from '@/components/website/common/page-components';
import { CTASection } from '@/components/website/common/cta-section';

import { WhatWeDoSection } from '@/components/website/home/what-we-do-section';
import { BroadcastingInfrastructureSection } from '@/components/website/home/broadcasting-infrastructure-section';
import { WorkflowSection } from '@/components/website/home/workflow-section';
import { ArticlesSection } from '@/components/website/home/articles/articles-section';

import {
  equipmentCategoryLinks,
  equipmentBrandLinks,
  productionServiceLinks,
  industriesServed,
  workflowSteps,
} from '@/components/website/home/home-page.data';

import SectionSkeleton from '@/components/shared/skeletons/section-skeletion';
import { homeSchema } from '@/utils/seo/schema/home/home-schema';

export async function generateMetadata(): Promise<Metadata> {
  const metaData = createEnhancedMetadata({
    title: 'MAP Media Art Production | Production Infrastructure Partner',
    description:
      'MAP is your production infrastructure partner in Dubai. Film, broadcast & production solutions—equipment rental, broadcasting, and full-service video production across the UAE and Gulf.',
    pathname: '/',
    mainOverrides: {
      category: 'media production',
    },
  });

  return metaData;
}

export default async function Page() {
  const jsonLd = await homeSchema();

  return (
    <div className="bg-background min-h-screen">
      <script
        id="home-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />

      {/* 1. Hero */}
      <PageHero
        title="Film, Broadcast & Production Solutions"
        description="MAP is your production infrastructure partner. Equipment rental, broadcasting solutions, and full-service video production for agencies, broadcasters, and production companies across the UAE and Gulf."
        buttons={[
          { text: 'Rent Equipment', href: '/equipment-rental' },
          { text: 'Request Production Support', href: '/contact?subject=production-support', variant: 'outline' },
          { text: 'Broadcasting Support', href: '/broadcasting', variant: 'outline' },
        ]}
        minHeight="60vh"
      />

      {/* 2. What We Do - Core Business Units */}
      <PageSection>
        <PageIntro
          title="What We Do – Core Business Units"
          paragraphs={[
            'MAP is your production infrastructure partner. We provide equipment rental, broadcasting solutions, and full-service production across Dubai and the Gulf.',
          ]}
        />
      </PageSection>

      <PageSection>
        <WhatWeDoSection />
      </PageSection>

      {/* 3. Equipment Highlights */}
      <PageSection>
        <PageInternalLinks
          title="Equipment Highlights"
          description="Professional camera, lens, and lighting rental. Browse equipment from top brands including ARRI, Sony, Canon, and Zeiss."
          links={[...equipmentCategoryLinks, ...equipmentBrandLinks]}
        />
      </PageSection>

      {/* 4. Broadcasting Infrastructure */}
      <PageSection>
        <BroadcastingInfrastructureSection />
      </PageSection>

      {/* 5. Production Services */}
      <PageSection>
        <PageInternalLinks
          title="Production Services"
          description="Full-service video production from commercial and corporate filming to event coverage and studio production."
          links={productionServiceLinks}
        />
      </PageSection>

      {/* 6. Industries Served */}
      <PageSection>
        <PageUseCasesGrid
          title="Industries Served"
          description="We serve advertising agencies, film production companies, corporate clients, government entities, event organizers, and broadcasters."
          items={industriesServed}
          cols={3}
        />
      </PageSection>

      {/* 7. Workflow / Process */}
      <PageSection>
        <WorkflowSection steps={workflowSteps} />
      </PageSection>

      {/* 8. Articles */}
      <PageSection>
        <Suspense fallback={<SectionSkeleton />}>
          <ArticlesSection />
        </Suspense>
      </PageSection>

      {/* CTA */}
      <PageSection>
        <CTASection
          title="Ready to Get Started?"
          description="Request a quote, rent equipment, or speak with our team about your production needs in Dubai and the UAE."
          buttons={[{ text: 'Request Quote', href: '/contact?subject=rfq' }]}
          offices={[]}
        />
      </PageSection>
    </div>
  );
}
