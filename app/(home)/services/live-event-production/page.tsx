import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import {
  liveEventTypes,
  whyChooseMapLive,
  liveUseCases,
  liveProductionItems,
  faqItems,
  internalLinks,
} from '@/components/website/services/live-event-production.data';
import {
  PageHero,
  PageSection,
  PageIntro,
  PageFeaturesGrid,
  PageHighlightBox,
  PageUseCasesGrid,
  PageFaq,
  PageInternalLinks,
} from '@/components/website/common/page-components';
import { CTASection } from '@/components/website/common/cta-section';
import { Button } from '@/components/ui/button';

export async function generateMetadata(): Promise<Metadata> {
  return createEnhancedMetadata({
    title: 'Live Event Production Dubai | Conference Live Production | MAP',
    description:
      'Professional live event production and conference live production in Dubai. Real-time broadcasting, OB vans, portable systems, and multi-platform streaming for conferences and events across UAE and Gulf.',
    pathname: '/live-event-production',
    keywords: [
      'live event production dubai',
      'conference live production dubai',
      'live streaming dubai',
      'conference broadcasting dubai',
      'OB van dubai',
    ],
  });
}

export default function LiveEventProductionPage() {
  return (
    <div className="bg-background min-h-screen">
      <PageHero
        title="Live Event Production Dubai | Conference Live Production"
        description="Professional live event production and conference live production in Dubai. Real-time broadcasting with OB vans and portable systems. Multi-platform streaming for conferences and corporate events across the UAE and Gulf."
        buttons={[
          { text: 'Request a Quote', href: '/contact?subject=live-event' },
          { text: 'View Broadcasting', href: '/broadcasting', variant: 'outline' },
        ]}
        breadcrumbs={[
          { label: 'Services', href: '/services' },
          { label: 'Live Event Production' },
        ]}
        minHeight="55vh"
      />

      <PageSection>
        <PageIntro
          title="Live Event Production & Conference Live Production in Dubai"
          paragraphs={[
            'MAP Media Art Production delivers professional live event production and conference live production in Dubai. From OB vans for large-venue events to portable broadcast systems for indoor conferences, we provide real-time multi-camera switching, professional audio, and multi-platform streaming. Our live event production services cover conferences, corporate events, product launches, and hybrid productions across Dubai, UAE, Saudi Arabia, Oman, and Qatar. We link directly with our full broadcasting infrastructure—outside broadcast and portable systems—for seamless live production at any scale.',
          ]}
        />
      </PageSection>

      <PageSection>
        <PageFeaturesGrid
          title="Live Event Production Services"
          description="Our live event production and conference live production in Dubai combines broadcast infrastructure with real-time streaming. OB vans, portable systems, and multi-platform delivery for conferences and events."
          items={liveEventTypes}
        />
      </PageSection>

      <PageSection>
        <PageHighlightBox
          title="Conference Live Production Dubai – Real-Time Broadcasting"
          description="Conference live production in Dubai means your audience—in-person and online—receives the same broadcast in real time. We deploy multi-camera setups with vision mixing, graphics, and professional audio. Stream to YouTube, LinkedIn, custom platforms, and event apps. Our live event production integrates with OB vans for outdoor and large venues, or portable broadcast systems for hotel ballrooms and conference halls. See our Broadcasting page for full infrastructure details."
          items={liveProductionItems}
        />
      </PageSection>

      <PageSection>
        <div className="space-y-6">
          <PageFeaturesGrid
            title="Why Choose MAP for Live Event & Conference Live Production"
            description="MAP delivers professional live event production and conference live production in Dubai. Our broadcast infrastructure, real-time expertise, and regional coverage make us the preferred partner for live production across the Gulf."
            items={whyChooseMapLive}
            cols={4}
          />
          <Button asChild className="rounded-full" variant="outline">
            <Link href="/broadcasting">
              Explore Broadcasting – OB Vans & Portable Systems
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </PageSection>

      <PageSection>
        <PageUseCasesGrid
          title="Perfect For"
          description="Our live event production and conference live production services support a wide range of events and use cases."
          items={liveUseCases}
        />
      </PageSection>

      <PageSection>
        <PageFaq items={faqItems} />
      </PageSection>

      <PageSection>
        <PageInternalLinks
          title="Explore Our Broadcasting & Production Services"
          description="Live event production is powered by our broadcasting infrastructure. Discover OB vans, portable systems, and event video production."
          links={internalLinks}
        />
      </PageSection>

      <PageSection>
        <CTASection
          title="Ready for Your Live Event Production in Dubai?"
          description="Discuss your conference live production or live event streaming needs with our team. We deliver professional live broadcasting from OB vans and portable systems across the UAE and Gulf."
          buttons={[
            { text: 'Request Quote', href: '/contact?subject=live-event' },
            { text: 'View Broadcasting', href: '/broadcasting' },
          ]}
        />
      </PageSection>
    </div>
  );
}
