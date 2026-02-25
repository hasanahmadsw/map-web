import type { Metadata } from 'next';
import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import {
  studioVideoTypes,
  whyChooseMapStudio,
  studioUseCases,
  studioProductionItems,
  faqItems,
  internalLinks,
} from '@/components/website/services/studio-video-production.data';
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
    title: 'Studio Video Production Dubai | Green Screen & Interview Filming | MAP',
    description:
      'Professional studio video production in Dubai. Green screen, interview filming, product shots, and corporate content. Broadcast-grade studio facility for controlled filming across UAE and Gulf.',
    pathname: '/studio-video-production',
    keywords: [
      'studio video production dubai',
      'studio filming dubai',
      'green screen dubai',
      'interview filming dubai',
      'video studio dubai',
    ],
  });
}

export default function StudioVideoProductionPage() {
  return (
    <div className="bg-background min-h-screen">
      <PageHero
        title="Studio Video Production Dubai | Green Screen & Interview Filming"
        description="Professional studio video production in Dubai. Controlled filming environment with green screen, broadcast lighting, and 4K cameras. Interviews, product shots, and corporate content across the UAE and Gulf."
        buttons={[
          { text: 'Request a Quote', href: '/contact?subject=studio-video' },
          { text: 'View All Services', href: '/services', variant: 'outline' },
        ]}
        breadcrumbs={[
          { label: 'Services', href: '/services' },
          { label: 'Studio Video Production' },
        ]}
        minHeight="55vh"
      />

      <PageSection>
        <PageIntro
          title="Studio Video Production & Studio Filming in Dubai"
          paragraphs={[
            'MAP Media Art Production offers professional studio video production in Dubai. Our studio facility provides a controlled filming environment with broadcast-grade lighting, green screen, and 4K cameras. From interviews and talking head videos to product shots and commercial content, we deliver studio filming that meets corporate and broadcast standards. Ideal for weather-independent production, consistent quality, and efficient turnaround. We serve brands, agencies, and enterprises across Dubai, UAE, Saudi Arabia, Oman, and Qatar.',
          ]}
        />
      </PageSection>

      <PageSection>
        <PageFeaturesGrid
          title="Studio Video Production Services"
          description="Our studio video production in Dubai covers interviews, green screen, product filming, and virtual production. Controlled environment with professional lighting and audio for broadcast-quality output."
          items={studioVideoTypes}
        />
      </PageSection>

      <PageSection>
        <PageHighlightBox
          title="Studio Filming Dubai – Controlled Environment, Professional Results"
          description="Studio video production in Dubai eliminates weather and location variables. Our studio provides cyclorama, green screen, and professional lighting for interviews, product demos, testimonials, and commercials. Green screen production enables virtual backgrounds and creative compositing. We deliver footage ready for post-production—clean keys, consistent colour, and broadcast-grade quality. Ideal for corporate content, product videos, and advertising."
          items={studioProductionItems}
        />
      </PageSection>

      <PageSection>
        <PageFeaturesGrid
          title="Why Choose MAP for Studio Video Production"
          description="MAP delivers professional studio video production in Dubai. Our full studio facility, controlled environment, and experienced crew make us the preferred partner for interview filming, green screen, and product content across the Gulf."
          items={whyChooseMapStudio}
          cols={4}
        />
      </PageSection>

      <PageSection>
        <PageUseCasesGrid
          title="Perfect For"
          description="Our studio video production services support a wide range of content needs."
          items={studioUseCases}
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
          title="Ready for Your Studio Video Production in Dubai?"
          description="Discuss your studio filming, green screen, or interview project with our team. We deliver professional studio video production from concept to delivery across the UAE and Gulf."
          buttons={[
            { text: 'Request Quote', href: '/contact?subject=studio-video' },
            { text: 'Contact Us', href: '/contact' },
          ]}
        />
      </PageSection>
    </div>
  );
}
