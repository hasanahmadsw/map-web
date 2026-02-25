import type { Metadata } from 'next';
import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import {
  whatWeOffer,
  whyChooseMap,
  filmingServices,
  processSteps,
  useCases,
  videoProductionCapabilities,
  mapVsOthers,
  clientTypes,
  faqItems,
  internalLinks,
} from '@/components/website/services/services-page.data';
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
    title: 'Video Production Dubai | Production Company & Filming Services | MAP',
    description:
      'Professional video production company in Dubai. Filming services for corporate videos, commercials, documentaries, and events. Full-service production from concept to delivery across UAE and Gulf.',
    pathname: '/services',
    keywords: [
      'video production dubai',
      'production company dubai',
      'filming services dubai',
      'corporate video production dubai',
      'video production company UAE',
    ],
  });
}

export default function ServicesPage() {
  return (
    <div className="bg-background min-h-screen">
      <PageHero
        title="Video Production Dubai | Professional Filming & Production Company"
        description="MAP is a leading production company in Dubai offering end-to-end video production and filming services across the UAE and Gulf. Corporate videos, commercials, documentaries, and live event coverage."
        buttons={[
          { text: 'Request a Quote', href: '/contact?subject=video-production' },
          { text: 'Contact Us', href: '/contact', variant: 'outline' },
        ]}
        minHeight="60vh"
      />

      <PageSection>
        <PageIntro
          title="Video Production & Filming Services in Dubai"
          paragraphs={[
            'MAP Media Art Production is a full-service production company in Dubai delivering high-quality video production and filming services for brands, government bodies, and events across Dubai, UAE, Saudi Arabia, Oman, and Qatar. From corporate videos and commercials to documentaries and live broadcasts, our team provides complete production and post-production solutions.',
          ]}
        />
      </PageSection>

      <PageSection>
        <PageFeaturesGrid
          title="What We Offer – Video Production Dubai"
          description="Our video production services in Dubai cover the full spectrum of corporate, commercial, and event filming needs. We combine creative expertise with professional equipment to deliver broadcast-grade results."
          items={whatWeOffer}
        />
      </PageSection>

      <PageSection>
        <PageFeaturesGrid
          title="Video Production Capabilities"
          description="Our production company in Dubai offers a comprehensive range of filming and production capabilities. From 4K multi-camera setups to drone cinematography and virtual production, we deliver professional results for every project."
          items={videoProductionCapabilities}
        />
      </PageSection>

      <PageSection>
        <PageHighlightBox
          title="Professional Filming Services in Dubai"
          description="Our filming services in Dubai include multi-camera production, drone filming, studio and green screen work, location scouting, and integration with live broadcasting. We handle permits and logistics for shoots across the UAE and Gulf."
          items={filmingServices}
        />
      </PageSection>

      <PageSection>
        <PageFeaturesGrid
          title="Why Choose MAP as Your Production Company in Dubai"
          description="MAP delivers professional video production and filming services across Dubai and the Gulf. Our combination of broadcast-grade equipment, experienced crews, and end-to-end service makes us the preferred production company for corporate, government, and event clients."
          items={whyChooseMap}
        />
      </PageSection>

      <PageSection>
        <div className="rounded-2xl border border-border/60 bg-muted/20 p-6 md:p-8">
          <h2 className="text-xl font-semibold md:text-2xl">MAP vs. Other Production Companies</h2>
          <p className="text-muted-foreground mt-3 text-sm md:text-base leading-relaxed max-w-3xl">
            How we compare as a production company in Dubai. We focus on broadcast-grade quality, regional
            coverage, and full-service production from concept to delivery.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[400px] text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 text-left font-medium"></th>
                  <th className="py-3 text-left font-medium">MAP</th>
                  <th className="py-3 text-left font-medium">Typical Alternatives</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {mapVsOthers.map((row, i) => (
                  <tr key={i} className="border-b border-border/60">
                    <td className="py-3 font-medium">{row.aspect}</td>
                    <td className="py-3">{row.map}</td>
                    <td className="py-3">{row.others}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </PageSection>

      <PageSection>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold md:text-2xl">Client Types & Use Cases</h2>
            <p className="text-muted-foreground mt-2 text-sm md:text-base leading-relaxed max-w-3xl">
              We serve government agencies, corporate brands, event organizers, advertising agencies, and
              educational institutions. Our filming services in Dubai support a wide range of video production
              needs across sectors.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clientTypes.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-start gap-4 rounded-lg border border-border/60 p-4">
                  <Icon className="text-primary mt-1 size-5 shrink-0" />
                  <div>
                    <h3 className="font-medium">{item.label}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </PageSection>

      <PageSection>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold md:text-2xl">How It Works</h2>
            <p className="text-muted-foreground mt-2 text-sm md:text-base leading-relaxed max-w-3xl">
              Our video production process in Dubai is structured for clarity and efficiency. From initial
              consultation to final delivery, we keep you informed and involved at every stage.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((item, i) => (
              <div key={i} className="rounded-xl border border-border/60 bg-muted/20 p-6">
                <span className="text-primary text-2xl font-bold">{item.step}</span>
                <h3 className="mt-2 font-semibold">{item.title}</h3>
                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </PageSection>

      <PageSection>
        <PageUseCasesGrid
          title="Perfect For"
          description="Our video production and filming services excel in various business and creative scenarios."
          items={useCases}
        />
      </PageSection>

      <PageSection>
        <PageFaq items={faqItems} />
      </PageSection>

      <PageSection>
        <PageInternalLinks
          title="Explore Our Solutions"
          description="Discover our broadcasting services, equipment rental, and solutions for media production in Dubai and the region."
          links={internalLinks}
        />
      </PageSection>

      <PageSection>
        <CTASection
          title="Ready for Your Next Video Production in Dubai?"
          description="Discuss your project with our team and receive a tailored proposal for filming services in Dubai. We deliver professional video production from concept to delivery across the UAE and Gulf."
          buttons={[
            { text: 'Request Quote', href: '/contact?subject=rfq' },
            { text: 'Contact Us', href: '/contact?subject=video-production' },
          ]}
        />
      </PageSection>
    </div>
  );
}
