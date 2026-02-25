import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowRight } from 'lucide-react';
import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import { Button } from '@/components/ui/button';
import {
  BroadcastsSection,
  BroadcastsSectionSkeleton,
} from '@/components/website/broadcasts/type/broadcasts-section';
import { BroadcastType } from '@/types/broadcasts/broadcast.enums';
import { getTypeMetadata } from '@/components/website/broadcasts/data-utils';
import {
  obVanUseCases,
  obVanFeatures,
  obVsPortableRows,
  obFaq,
  obVenueRequirements,
  obCrewRoles,
  whyChooseMapOb,
  technicalAreas,
  deploymentSteps,
  serviceCoverage,
  outsideBroadcastInternalLinks,
} from '@/components/website/broadcasting/data';
import {
  PageHero,
  PageSection,
  SECTION_CLASS,
  PageIntro,
  PageFeaturesGrid,
  PageHighlightBox,
  PageFaq,
  PageInternalLinks,
} from '@/components/website/common/page-components';

export async function generateMetadata(): Promise<Metadata> {
  return createEnhancedMetadata({
    title: 'Outside Broadcast (OB) Services Dubai | MAP',
    description:
      'Professional outside broadcast services for events, sports, and live productions in Dubai. OB vans and mobile broadcast units for outdoor event coverage in UAE, Saudi Arabia, Oman, and Qatar.',
    pathname: '/broadcasting/outside-broadcast',
    keywords: [
      'outside broadcast dubai',
      'OB van dubai',
      'mobile broadcast unit dubai',
      'sports broadcasting dubai',
      'live event coverage dubai',
    ],
  });
}

interface Props {
  searchParams?: Promise<{
    search?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function OutsideBroadcastPage(props: Props) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 12;
  const search = searchParams?.search || '';

  const metadata = getTypeMetadata(BroadcastType.OBVAN);

  return (
    <>
      <PageHero
        title="Outside Broadcast (OB) Services in Dubai"
        description="Professional outside broadcast brings full production capabilities to any location—sports venues, outdoor events, government ceremonies, and live concerts. Our OB vans deliver broadcast-grade quality across Dubai, UAE, and the Gulf region."
        buttons={[
          { text: 'Request OB Support', href: '/contact?subject=broadcasting' },
          { text: 'View OB Van Units', href: '#broadcast-units', variant: 'outline' },
        ]}
        breadcrumbs={[
          { label: 'Broadcasting', href: '/broadcasting' },
          { label: 'Outside Broadcast' },
        ]}
        minHeight="55vh"
      />

      <PageSection>
        <PageIntro
          title="What is Outside Broadcast?"
          paragraphs={[
            'Outside broadcast (OB) is a mobile production system that brings studio-quality live production to any venue. When traditional studio production is not feasible—outdoor events, sports stadia, open-air ceremonies, or remote locations—OB units deploy a full production facility on-site. Cameras, vision mixing, audio, and transmission are housed in a mobile truck or deployable unit, enabling broadcast-grade live event coverage at your location.',
            'MAP provides outside broadcast services in Dubai, across the UAE, and throughout the Gulf region. Our OB vans and mobile broadcast infrastructure are fully crewed and equipped for multi-camera live production, recording, and live streaming. Government agencies, sports federations, and event organizers trust us for reliable outside broadcast coverage.',
          ]}
        />
      </PageSection>

      <PageSection>
        <div className="rounded-2xl border border-border/60 bg-muted/20 p-6 md:p-8">
          <h2 className="text-xl font-semibold md:text-2xl">OB Van vs Portable Broadcast—When to Choose Each</h2>
          <p className="text-muted-foreground mt-3 text-sm md:text-base leading-relaxed max-w-3xl">
            Not sure whether you need an OB van or a portable broadcast system? The choice depends on your
            venue, event scale, and access. Here’s a quick comparison to help you decide.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[400px] text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 text-left font-medium"></th>
                  <th className="py-3 text-left font-medium">OB Van</th>
                  <th className="py-3 text-left font-medium">Portable</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {obVsPortableRows.map((row, i) => (
                  <tr key={i} className="border-b border-border/60">
                    <td className="py-3 font-medium">{row.aspect}</td>
                    <td className="py-3">{row.ob}</td>
                    <td className="py-3">{row.portable}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button asChild className="mt-6 rounded-full" variant="outline" size="sm">
            <Link href="/broadcasting/portable-broadcast-systems">
              Learn about Portable Systems
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </PageSection>

      <PageSection>
        <PageHighlightBox
          title="When to Use Outside Broadcast"
          description="Outside broadcast is ideal for outdoor event coverage, sports broadcasting, government events, live concerts, and any production requiring on-site, mobile broadcast capability. Our OB vans and portable systems deliver broadcast-grade quality at your venue across Dubai and the region."
          items={obVanUseCases}
        />
      </PageSection>

      <PageSection>
        <div className="space-y-6">
          <PageFeaturesGrid
            title="OB Van Key Features"
            description="Our outside broadcast infrastructure in Dubai combines mobile production trucks with broadcast-grade equipment. Each OB van is equipped for multi-camera production, vision mixing, professional audio, and live streaming—all deployable to your venue."
            items={obVanFeatures}
          />
          <Button asChild className="rounded-full" variant="outline">
            <Link href="/broadcasting/ob-van">
              View OB Van Infrastructure
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </PageSection>

      <section id="broadcast-units" className={`scroll-mt-[var(--spacing-edge-nav-margin)] ${SECTION_CLASS}`}>
        <Suspense key={`${page} | ${search}`} fallback={<BroadcastsSectionSkeleton />}>
          <BroadcastsSection
            page={page}
            limit={limit}
            search={search}
            type={BroadcastType.OBVAN}
            badgeText={metadata.badgeText}
          />
        </Suspense>
      </section>

      <PageSection>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold md:text-2xl">Technical Integration</h2>
            <p className="text-muted-foreground mt-2 text-sm md:text-base leading-relaxed max-w-3xl">
              Our OB vans integrate camera systems, audio routing, monitoring, recording, and streaming
              outputs into a cohesive production environment. Multi-format camera setups support 4K and
              broadcast standards; professional audio distribution ensures clean signals; multiviewers and
              QC monitoring maintain quality throughout the live production.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {technicalAreas.map((area, i) => {
              const Icon = area.icon;
              return (
                <div key={i} className="flex items-start gap-4 rounded-lg border border-border/60 p-4">
                  <Icon className="text-primary mt-1 size-5 shrink-0" />
                  <div>
                    <h3 className="font-medium">{area.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{area.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </PageSection>

      <PageSection>
        <PageHighlightBox
          title="Venue Requirements"
          description="For a smooth OB van deployment, your venue should provide the following. We can advise on alternatives if certain requirements are difficult to meet."
          items={obVenueRequirements}
        />
      </PageSection>

      <PageSection>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold md:text-2xl">Crew & Expertise</h2>
            <p className="text-muted-foreground mt-2 text-sm md:text-base leading-relaxed max-w-3xl">
              Our OB productions are staffed by experienced crews. Vision mixers, camera operators, audio
              engineers, and technical directors work together to deliver reliable live broadcast coverage.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {obCrewRoles.map((role, i) => {
              const Icon = role.icon;
              return (
                <div key={i} className="rounded-xl border border-border/60 bg-muted/20 p-4">
                  <Icon className="text-primary mb-2 size-6" />
                  <h3 className="font-medium">{role.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{role.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </PageSection>

      <PageSection>
        <PageFeaturesGrid
          title="Why Choose MAP for Outside Broadcast"
          description="MAP delivers professional outside broadcast services across Dubai and the Gulf. Broadcast-grade equipment, experienced crews, and rapid deployment make us the trusted choice for government events, sports, and corporate productions."
          items={whyChooseMapOb}
          cols={3}
        />
      </PageSection>

      <PageSection>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold md:text-2xl">Deployment Process</h2>
            <p className="text-muted-foreground mt-2 text-sm md:text-base leading-relaxed max-w-3xl">
              Our deployment process for outside broadcast in Dubai follows a streamlined path from planning
              to breakdown. We conduct site surveys and technical planning to ensure seamless integration
              with your venue. Equipment deployment and OB van setup are executed by experienced crews.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {deploymentSteps.map((item, i) => (
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
        <PageFaq items={obFaq} />
      </PageSection>

      <PageSection>
        <div className="rounded-2xl border border-border/60 border-l-4 border-l-primary bg-muted/20 p-6 md:p-8">
          <h2 className="text-xl font-semibold md:text-2xl">Service Coverage</h2>
          <p className="text-muted-foreground mt-3 text-sm md:text-base leading-relaxed max-w-3xl">
            MAP provides outside broadcast services across the Gulf region. Our presence in Dubai, UAE,
            Saudi Arabia, Oman, and Qatar enables rapid deployment of OB vans and mobile broadcast
            infrastructure for sports, government events, and live productions.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {serviceCoverage.map((area, i) => {
              const Icon = area.icon;
              return (
                <div
                  key={i}
                  className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-background/80 px-4 py-3 transition-colors hover:border-primary/40 hover:bg-muted/30"
                >
                  <Icon className="text-primary size-5 shrink-0" />
                  <span className="font-medium text-sm">{area.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </PageSection>

      <PageSection>
        <PageInternalLinks
          title="Explore Our Broadcast Solutions"
          description="Discover our OB van infrastructure, portable broadcast systems, and flight case units. Each solution is designed for specific event broadcasting needs in Dubai and the region."
          links={outsideBroadcastInternalLinks}
        />
      </PageSection>

      {/* 15) CTA Section */}
      <div className={SECTION_CLASS}>
        <section className="py-8 md:py-10">
          <div className="rounded-2xl border border-border/60 bg-muted/30 px-6 py-10 md:px-12 md:py-12">
            <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
              <div className="space-y-4 max-w-xl">
                <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                  Ready for Your Outside Broadcast?
                </h2>
                <p className="text-muted-foreground">
                  Request a quote or speak with our broadcast team to plan your OB deployment in Dubai
                  and the region.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Button asChild size="lg" className="rounded-full">
                  <Link href="/contact?subject=rfq">
                    Request Quote
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full">
                  <Link href="/contact?subject=broadcasting">Talk to Broadcast Team</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
