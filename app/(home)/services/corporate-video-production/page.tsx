import type { Metadata } from 'next';
import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import {
  corporateVideoTypes,
  whyChooseMapCorporate,
  corporateUseCases,
  companyVideoItems,
  faqItems,
  internalLinks,
} from '@/components/website/services/corporate-video-production.data';
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
    title: 'Corporate Video Production Dubai | Business & Company Videos | MAP',
    description:
      'Professional corporate video production in Dubai. Company videos, business video production, and internal communications for enterprises. Full-service company video production across UAE and Gulf.',
    pathname: '/corporate-video-production',
    keywords: [
      'corporate video production dubai',
      'business video production dubai',
      'company video production dubai',
      'company video dubai',
      'corporate film production dubai',
    ],
  });
}

export default function CorporateVideoProductionPage() {
  return (
    <div className="bg-background min-h-screen">
      <PageHero
        title="Corporate Video Production Dubai | Business & Company Videos"
        description="Professional corporate video production and business video production in Dubai. Company videos, internal communications, and B2B content for enterprises across the UAE and Gulf region."
        buttons={[
          { text: 'Request a Quote', href: '/contact?subject=corporate-video' },
          { text: 'View All Services', href: '/services', variant: 'outline' },
        ]}
        breadcrumbs={[
          { label: 'Services', href: '/services' },
          { label: 'Corporate Video Production' },
        ]}
        minHeight="55vh"
      />

      <PageSection>
        <PageIntro
          title="Corporate Video Production & Business Video Production in Dubai"
          paragraphs={[
            'MAP Media Art Production is a leading corporate video production company in Dubai, specializing in business video production and company video production for enterprises, SMEs, and organizations across Dubai, UAE, Saudi Arabia, Oman, and Qatar. From company profiles and internal communications to B2B marketing and recruitment films, we deliver professional company videos that strengthen your brand, engage stakeholders, and support your business objectives.',
          ]}
        />
      </PageSection>

      <PageSection>
        <PageFeaturesGrid
          title="Corporate & Business Video Production Services"
          description="Our corporate video production in Dubai covers company profiles, internal comms, B2B content, and recruitment. We deliver business video production tailored to corporate standards and brand guidelines."
          items={corporateVideoTypes}
        />
      </PageSection>

      <PageSection>
        <PageHighlightBox
          title="Company Video Production Dubai"
          description="Company video production helps organizations communicate their story, values, and capabilities to customers, partners, investors, and employees. Our company video production in Dubai creates professional films for brand introductions, annual reports, investor relations, and stakeholder communication. We work with corporate guidelines, NDAs, and compliance requirements to deliver company videos that reflect your brand and meet your business objectives."
          items={companyVideoItems}
        />
      </PageSection>

      <PageSection>
        <PageFeaturesGrid
          title="Why Choose MAP for Corporate & Business Video Production"
          description="MAP delivers professional corporate video production and business video production in Dubai. Our experience with enterprises, confidential workflows, and corporate standards makes us the preferred partner for company video production across the Gulf."
          items={whyChooseMapCorporate}
          cols={4}
        />
      </PageSection>

      <PageSection>
        <PageUseCasesGrid
          title="Perfect For"
          description="Our corporate video production and business video production services support a wide range of business needs."
          items={corporateUseCases}
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
          title="Ready for Your Corporate Video Production in Dubai?"
          description="Discuss your company video or business video project with our team. We deliver professional corporate video production from concept to delivery across the UAE and Gulf."
          buttons={[
            { text: 'Request Quote', href: '/contact?subject=corporate-video' },
            { text: 'Contact Us', href: '/contact' },
          ]}
        />
      </PageSection>
    </div>
  );
}
