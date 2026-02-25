import type { Metadata } from 'next';
import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import {
  commercialVideoTypes,
  whyChooseMapCommercial,
  commercialUseCases,
  brandedContentItems,
  faqItems,
  internalLinks,
} from '@/components/website/services/commercial-video-production.data';
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
    title: 'Commercial Video Production Dubai | Advertising & Branded Content | MAP',
    description:
      'Professional commercial video production in Dubai. TV ads, digital advertising, and branded content for brands and agencies. Advertising video production across UAE and Gulf.',
    pathname: '/commercial-video-production',
    keywords: [
      'commercial video production dubai',
      'advertising video production dubai',
      'branded content production dubai',
      'TV commercial production dubai',
      'advertising agency dubai',
    ],
  });
}

export default function CommercialVideoProductionPage() {
  return (
    <div className="bg-background min-h-screen">
      <PageHero
        title="Commercial Video Production Dubai | Advertising & Branded Content"
        description="Professional commercial video production and advertising video production in Dubai. TV commercials, digital ads, and branded content for brands and agencies across the UAE and Gulf region."
        buttons={[
          { text: 'Request a Quote', href: '/contact?subject=commercial-video' },
          { text: 'View All Services', href: '/services', variant: 'outline' },
        ]}
        breadcrumbs={[
          { label: 'Services', href: '/services' },
          { label: 'Commercial Video Production' },
        ]}
        minHeight="55vh"
      />

      <PageSection>
        <PageIntro
          title="Commercial Video Production & Advertising Video Production in Dubai"
          paragraphs={[
            'MAP Media Art Production is a leading commercial video production company in Dubai, specializing in advertising video production and branded content production for brands, agencies, and retailers across Dubai, UAE, Saudi Arabia, Oman, and Qatar. From TV commercials and digital advertising to branded documentaries and social content, we deliver broadcast-grade creative production that drives brand awareness and engagement.',
          ]}
        />
      </PageSection>

      <PageSection>
        <PageFeaturesGrid
          title="Commercial & Advertising Video Production Services"
          description="Our commercial video production in Dubai covers TV, digital, and branded content. We combine creative direction with professional filming and post-production for advertising that stands out."
          items={commercialVideoTypes}
        />
      </PageSection>

      <PageSection>
        <PageHighlightBox
          title="Branded Content Production Dubai"
          description="Branded content production goes beyond traditional advertising—it tells your brand story through documentaries, editorial-style films, and narrative content that resonates with audiences. Our branded content production in Dubai creates authentic, engaging content for social platforms, owned channels, and integrated campaigns. Ideal for brand building, thought leadership, and long-form storytelling that drives connection and loyalty."
          items={brandedContentItems}
        />
      </PageSection>

      <PageSection>
        <PageFeaturesGrid
          title="Why Choose MAP for Commercial & Advertising Video Production"
          description="MAP delivers professional commercial video production and advertising video production in Dubai. Our creative teams, broadcast-grade equipment, and regional expertise make us the preferred production partner for brands and agencies across the Gulf."
          items={whyChooseMapCommercial}
          cols={4}
        />
      </PageSection>

      <PageSection>
        <PageUseCasesGrid
          title="Perfect For"
          description="Our commercial video production and advertising video production services support a wide range of brands and campaigns."
          items={commercialUseCases}
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
          title="Ready for Your Commercial Video Production in Dubai?"
          description="Discuss your advertising or branded content project with our team. We deliver professional commercial video production from concept to delivery across the UAE and Gulf."
          buttons={[
            { text: 'Request Quote', href: '/contact?subject=commercial-video' },
            { text: 'Contact Us', href: '/contact' },
          ]}
        />
      </PageSection>
    </div>
  );
}
