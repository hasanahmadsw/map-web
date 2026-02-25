import type { Metadata } from 'next';
import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import { generateAboutPageSchema } from '@/utils/seo/schema/about/about-schema';
import {
  PageHero,
  PageSection,
  PageFeaturesGrid,
  PageFaq,
  PageInternalLinks,
} from '@/components/website/common/page-components';
import { CTASection } from '@/components/website/common/cta-section';
import AboutSection from '@/components/website/about/about-section';
import {
  coreValues,
  aboutStats,
  missionContent,
  visionContent,
  faqItems,
  aboutInternalLinks,
} from '@/components/website/about/data';

export async function generateMetadata(): Promise<Metadata> {
  return createEnhancedMetadata({
    title: 'About Us | MAP Media Art Production',
    description:
      'Learn about MAP Media Art Production—25+ years shaping creative media in Dubai, UAE, and the Middle East. Our story, values, and commitment to excellence.',
    pathname: '/about',
    mainOverrides: {
      category: 'Company Profile',
    },
  });
}

export default async function AboutPage() {
  const jsonLd = await generateAboutPageSchema();
  const MissionIcon = missionContent.icon;
  const VisionIcon = visionContent.icon;

  return (
    <div className="bg-background min-h-screen">
      <script
        id="about-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />

      <PageHero
        title="About MAP Media Art Production"
        description="25+ years shaping the future of media and storytelling across the UAE, Saudi Arabia, and the wider Middle East. Creative excellence, technical expertise, and innovation in every project."
        buttons={[
          { text: 'Get in Touch', href: '/contact' },
          { text: 'Our Services', href: '/services', variant: 'outline' },
        ]}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'About Us' },
        ]}
        minHeight="55vh"
      />

      <AboutSection />

      <PageSection>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {aboutStats.map((stat, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/60 bg-muted/20 px-6 py-8 text-center transition-colors hover:bg-muted/30"
            >
              <span className="text-primary text-3xl font-bold md:text-4xl">{stat.value}</span>
              <p className="text-muted-foreground mt-2 text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-border/60 border-l-4 border-l-primary bg-muted/20 p-6 md:p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <MissionIcon className="text-primary size-6" />
              </div>
              <h2 className="text-xl font-semibold md:text-2xl">{missionContent.title}</h2>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">{missionContent.text}</p>
          </div>
          <div className="rounded-2xl border border-border/60 border-l-4 border-l-primary bg-muted/20 p-6 md:p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <VisionIcon className="text-primary size-6" />
              </div>
              <h2 className="text-xl font-semibold md:text-2xl">{visionContent.title}</h2>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">{visionContent.text}</p>
          </div>
        </div>
      </PageSection>

      <PageSection>
        <PageFeaturesGrid
          title="Our Core Values"
          description="At MAP, we are committed to delivering exceptional visual content. Our core values guide our work and shape the way we approach every project."
          items={coreValues}
          cols={3}
        />
      </PageSection>

      <PageSection>
        <PageFaq title="Frequently Asked Questions" items={faqItems} />
      </PageSection>

      <PageSection>
        <PageInternalLinks
          title="Explore Our Services"
          description="Discover our video production, broadcasting, and media solutions across Dubai and the Gulf."
          links={aboutInternalLinks}
        />
      </PageSection>

      <PageSection>
        <CTASection
          title="Ready to Bring Your Vision to Life?"
          description="Discuss your project with our team. We deliver professional media production from concept to delivery across the UAE and Gulf."
          buttons={[
            { text: 'Contact Us', href: '/contact' },
            { text: 'View Services', href: '/services' },
          ]}
        />
      </PageSection>
    </div>
  );
}
