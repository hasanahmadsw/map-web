import type { Metadata } from 'next';
import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import {
  eventVideoTypes,
  whyChooseMapEvent,
  eventUseCases,
  eventVideographyItems,
  faqItems,
  internalLinks,
} from '@/components/website/services/event-video-production.data';
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

export async function generateMetadata(): Promise<Metadata> {
  return createEnhancedMetadata({
    title: 'Event Video Production Dubai | Conference & Corporate Event Filming | MAP',
    description:
      'Professional event videography and conference video production in Dubai. Corporate event filming for conferences, product launches, galas, and exhibitions. Event video production across UAE and Gulf.',
    pathname: '/event-video-production',
    keywords: [
      'event videography dubai',
      'conference video production dubai',
      'corporate event filming dubai',
      'event video production dubai',
      'conference filming dubai',
    ],
  });
}

export default function EventVideoProductionPage() {
  return (
    <div className="bg-background min-h-screen">
      <PageHero
        title="Event Video Production Dubai | Conference & Corporate Event Filming"
        description="Professional event videography and conference video production in Dubai. Corporate event filming for conferences, product launches, galas, and exhibitions across the UAE and Gulf region."
        buttons={[
          { text: 'Request a Quote', href: '/contact?subject=event-video' },
          { text: 'View All Services', href: '/services', variant: 'outline' },
        ]}
        breadcrumbs={[
          { label: 'Services', href: '/services' },
          { label: 'Event Video Production' },
        ]}
        minHeight="55vh"
      />

      <PageSection>
        <PageIntro
          title="Event Videography & Conference Video Production in Dubai"
          paragraphs={[
            'MAP Media Art Production is a leading event video production company in Dubai, specializing in event videography, conference video production, and corporate event filming for conferences, product launches, galas, exhibitions, and hybrid events across Dubai, UAE, Saudi Arabia, Oman, and Qatar. From multi-camera conference coverage to cinematic corporate event filming, we deliver broadcast-grade event videography that captures the impact of your events and repurposes them for marketing and archival use.',
          ]}
        />
      </PageSection>

      <PageSection>
        <PageFeaturesGrid
          title="Event Video Production Services"
          description="Our event videography and conference video production in Dubai covers conferences, corporate events, exhibitions, and galas. We combine multi-camera expertise with quick turnaround for highlights and social content."
          items={eventVideoTypes}
        />
      </PageSection>

      <PageSection>
        <PageHighlightBox
          title="Event Videography Dubai – Full-Service Coverage"
          description="Event videography in Dubai goes beyond recording—we create content. Our event video production delivers conference highlights, speaker reels, corporate event films, and social media clips. We capture the energy of your events and transform footage into marketing assets, testimonials, and on-demand content. Ideal for conferences, product launches, trade shows, and corporate celebrations."
          items={eventVideographyItems}
        />
      </PageSection>

      <PageSection>
        <PageFeaturesGrid
          title="Why Choose MAP for Event & Conference Video Production"
          description="MAP delivers professional event videography and conference video production in Dubai. Our multi-camera setups, same-day highlights, and regional coverage make us the preferred partner for corporate event filming across the Gulf."
          items={whyChooseMapEvent}
          cols={4}
        />
      </PageSection>

      <PageSection>
        <PageUseCasesGrid
          title="Perfect For"
          description="Our event videography and conference video production services support a wide range of events and use cases."
          items={eventUseCases}
        />
      </PageSection>

      <PageSection>
        <PageFaq items={faqItems} />
      </PageSection>

      <PageSection>
        <PageInternalLinks
          title="Explore Our Services"
          description="Discover our full range of video production and media services in Dubai."
          links={internalLinks}
        />
      </PageSection>

      <PageSection>
        <CTASection
          title="Ready for Your Event Video Production in Dubai?"
          description="Discuss your conference, corporate event, or exhibition filming needs with our team. We deliver professional event videography from capture to delivery across the UAE and Gulf."
          buttons={[
            { text: 'Request Quote', href: '/contact?subject=event-video' },
            { text: 'Contact Us', href: '/contact' },
          ]}
        />
      </PageSection>
    </div>
  );
}
