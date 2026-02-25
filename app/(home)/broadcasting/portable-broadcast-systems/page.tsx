import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import { Button } from '@/components/ui/button';
import {
  BroadcastsSection,
  BroadcastsSectionSkeleton,
} from '@/components/website/broadcasts/type/broadcasts-section';
import { BroadcastType } from '@/types/broadcasts/broadcast.enums';
import { getTypeMetadata } from '@/components/website/broadcasts/data-utils';
import {
  portableUseCases,
  portableFeatures,
  portableAdvantages,
  obVsPortableRows,
  portableFaq,
  portableVenueRequirements,
  whyChooseMapPortable,
  venueAvIntegration,
  technicalAreas,
  deploymentSteps,
  serviceCoverage,
  portableBroadcastInternalLinks,
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
    title: 'Portable Broadcast Systems Dubai | MAP',
    description:
      'Portable broadcast systems for indoor events—hotel ballrooms, conference halls, exhibition centers. Quick deployment for conference live streaming in Dubai, UAE, Saudi Arabia, Oman, and Qatar.',
    pathname: '/broadcasting/portable-broadcast-systems',
    keywords: [
      'portable broadcast system dubai',
      'conference live streaming dubai',
      'flight case broadcast dubai',
      'indoor event broadcast dubai',
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

export default async function PortableBroadcastSystemsPage(props: Props) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 12;
  const search = searchParams?.search || '';

  const metadata = getTypeMetadata(BroadcastType.FLIGHT_CASE);

  return (
    <>
      <PageHero
        title="Portable Broadcast Systems in Dubai"
        description="Compact, transportable broadcast setups for indoor venues—hotel ballrooms, conference halls, exhibition centers. Quick deployment in 2–4 hours with no truck access required. Ideal for conference live streaming across Dubai and the Gulf region."
        buttons={[
          { text: 'Request Portable Broadcast', href: '/contact?subject=broadcasting' },
          { text: 'View Flight Case Units', href: '#broadcast-units', variant: 'outline' },
        ]}
        breadcrumbs={[
          { label: 'Broadcasting', href: '/broadcasting' },
          { label: 'Portable Broadcast Systems' },
        ]}
        minHeight="55vh"
      />

      <PageSection>
        <PageIntro
          title="What are Portable Broadcast Systems?"
          paragraphs={[
            'Portable broadcast systems are compact, transportable production setups designed for indoor venues where a full OB van is not required. Equipment is housed in rugged flight cases for easy transport via loading dock or elevator. Vision mixing, cameras, audio, and streaming outputs are configured for quick deployment—typically 2–4 hours—in hotel ballrooms, conference halls, exhibition centers, and corporate auditoriums.',
            'MAP provides portable broadcast services in Dubai and across the Gulf. Our flight case units deliver professional multi-camera production and conference live streaming for corporate events, hybrid meetings, product launches, and exhibitions. No truck access needed—ideal for venues with limited loading capability.',
          ]}
        />
      </PageSection>

      <PageSection>
        <div className="rounded-2xl border border-border/60 bg-muted/20 p-6 md:p-8">
          <h2 className="text-xl font-semibold md:text-2xl">OB Van vs Portable Broadcast—When to Choose Each</h2>
          <p className="text-muted-foreground mt-3 text-sm md:text-base leading-relaxed max-w-3xl">
            Not sure whether you need an OB van or a portable broadcast system? Portable systems suit
            indoor events, conferences, and exhibitions. OB vans suit outdoor, sports, and large-venue
            productions. Here’s a quick comparison.
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
            <Link href="/broadcasting/outside-broadcast">
              Learn about Outside Broadcast
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </PageSection>

      <PageSection>
        <PageHighlightBox
          title="When to Use Portable Broadcast"
          description="Portable broadcast systems are ideal for indoor events, temporary setups, hotel ballrooms, conference halls, and exhibition centers. Quick deployment, no truck access, and compact footprint make them the choice for conference live streaming in Dubai and the region."
          items={portableUseCases}
        />
      </PageSection>

      <PageSection>
        <div className="space-y-6">
          <PageFeaturesGrid
            title="Portable Broadcast Key Features"
            description="Our portable broadcast systems in Dubai combine flight case units with broadcast-grade equipment. Each setup is designed for quick deployment in indoor venues—vision mixing, multi-camera production, and live streaming in a compact, transportable format."
            items={portableFeatures}
          />
          <Button asChild className="rounded-full" variant="outline">
            <Link href="/broadcasting/flight-case-units">
              View Flight Case Units
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
            type={BroadcastType.FLIGHT_CASE}
            badgeText={metadata.badgeText}
          />
        </Suspense>
      </section>

      <PageSection>
        <div className="rounded-2xl border border-border/60 bg-muted/20 p-6 md:p-8">
          <h2 className="text-xl font-semibold md:text-2xl">Why Choose Portable Broadcast</h2>
          <p className="text-muted-foreground mt-3 text-sm md:text-base leading-relaxed max-w-3xl">
            Portable broadcast systems offer distinct advantages for indoor and conference-focused
            events. Quick deployment, minimal venue footprint, and cost-effectiveness make them the
            preferred choice for many corporate and exhibition productions.
          </p>
          <ul className="mt-6 space-y-2 text-sm">
            {portableAdvantages.map((adv, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="text-primary size-4 shrink-0" />
                <span className="text-muted-foreground">{adv}</span>
              </li>
            ))}
          </ul>
        </div>
      </PageSection>

      <PageSection>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold md:text-2xl">Venue AV Integration</h2>
            <p className="text-muted-foreground mt-2 text-sm md:text-base leading-relaxed max-w-3xl">
              Our portable broadcast setups integrate seamlessly with existing venue AV. We connect to
              LED walls, projection screens, PA systems, and conference networks for a cohesive event
              experience.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {venueAvIntegration.map((item, i) => (
              <span
                key={i}
                className="rounded-full border border-border/60 bg-muted/30 px-4 py-2 text-sm font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </PageSection>

      <PageSection>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold md:text-2xl">Technical Integration</h2>
            <p className="text-muted-foreground mt-2 text-sm md:text-base leading-relaxed max-w-3xl">
              Our portable systems integrate camera systems, audio routing, monitoring, recording, and
              streaming outputs. Multi-format cameras, professional audio, multiviewers, and
              multi-platform streaming are configured for indoor production.
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
          description="Portable broadcast has lighter venue requirements than OB vans. Standard loading dock or elevator, adequate power, and stable internet are typically sufficient."
          items={portableVenueRequirements}
        />
      </PageSection>

      <PageSection>
        <PageFeaturesGrid
          title="Why Choose MAP for Portable Broadcast"
          description="MAP delivers professional portable broadcast services across Dubai and the Gulf. Quick deployment, compact equipment, and conference-ready expertise make us the choice for corporate events, exhibitions, and hybrid productions."
          items={whyChooseMapPortable}
          cols={3}
        />
      </PageSection>

      <PageSection>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold md:text-2xl">Deployment Process</h2>
            <p className="text-muted-foreground mt-2 text-sm md:text-base leading-relaxed max-w-3xl">
              Our deployment for portable broadcast in Dubai follows the same streamlined process: planning,
              setup, live production, and breakdown. Site surveys ensure seamless integration; setup is
              typically complete in 2–4 hours.
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
        <PageFaq items={portableFaq} />
      </PageSection>

      <PageSection>
        <div className="rounded-2xl border border-border/60 border-l-4 border-l-primary bg-muted/20 p-6 md:p-8">
          <h2 className="text-xl font-semibold md:text-2xl">Service Coverage</h2>
          <p className="text-muted-foreground mt-3 text-sm md:text-base leading-relaxed max-w-3xl">
            MAP provides portable broadcast services across the Gulf region. Our presence in Dubai, UAE,
            Saudi Arabia, Oman, and Qatar enables rapid deployment for conference live streaming and
            indoor event production.
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
          description="Discover our outside broadcast, OB van infrastructure, and flight case units. Each solution is designed for specific event broadcasting needs in Dubai and the region."
          links={portableBroadcastInternalLinks}
        />
      </PageSection>

      {/* 16) CTA Section */}
      <div className={SECTION_CLASS}>
        <div className="rounded-2xl border border-border/60 bg-muted/30 px-6 py-10 md:px-12 md:py-12">
          <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
            <div className="space-y-4 max-w-xl">
              <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                Ready for Your Portable Broadcast?
              </h2>
              <p className="text-muted-foreground">
                Request a quote or speak with our broadcast team to plan your portable broadcast
                deployment for conferences and indoor events in Dubai and the region.
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
      </div>
    </>
  );
}
