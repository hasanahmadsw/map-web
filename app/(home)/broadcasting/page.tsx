import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import { Button } from '@/components/ui/button';
import {
  broadcastingCapabilities,
  obVanUseCases,
  portableUseCases,
  workflowSteps,
  useCases,
  technicalAreas,
  deploymentSteps,
  serviceCoverage,
  broadcastingInternalLinks,
} from '@/components/website/broadcasting/data';
import {
  PageHero,
  PageSection,
  SECTION_CLASS,
  PageIntro,
  PageFeaturesGrid,
  PageUseCasesGrid,
  PageInternalLinks,
} from '@/components/website/common/page-components';

export async function generateMetadata(): Promise<Metadata> {
  return createEnhancedMetadata({
    title: 'Live Broadcasting & Production Solutions in Dubai | MAP',
    description:
      'Outside broadcast and portable live production systems for events, conferences, and multi-camera productions in Dubai and UAE. Professional event broadcasting, live streaming, and OB van services.',
    pathname: '/broadcasting',
    keywords: [
      'broadcasting services dubai',
      'live broadcasting dubai',
      'event broadcasting dubai',
      'outside broadcast dubai',
      'portable broadcast system dubai',
      'multi camera live production dubai',
      'conference live streaming dubai',
    ],
  });
}

export default function BroadcastingPage() {
  return (
    <>
      <PageHero
        title="Live Broadcasting & Production Solutions in Dubai"
        description="Professional outside broadcast (OB) and portable live production systems for government events, corporate conferences, exhibitions, and multi-camera live streaming across Dubai and the UAE. From OB vans to flight-case units, we deliver end-to-end broadcast solutions tailored to your venue and audience."
        buttons={[
          { text: 'Request Broadcasting Support', href: '/contact?subject=broadcasting' },
          { text: 'Contact Team', href: '/contact', variant: 'outline' },
        ]}
        minHeight="60vh"
      />

      <PageSection>
        <PageIntro
          title="Professional Live Broadcasting Services in Dubai & UAE"
          paragraphs={[
            'MAP provides professional event broadcasting, live production, and multi-camera production services in Dubai and across the UAE. Our outside broadcast (OB) and portable broadcast systems deliver broadcast-grade coverage for corporate events, government conferences, sports, product launches, and hybrid events. From live streaming services in Dubai to full-scale OB van deployments, we support events of any scale with expert crews, professional equipment, and reliable live event coverage.',
            'Whether you need event broadcasting in Dubai for a government summit, live streaming services for a corporate conference, or a portable broadcast system for an exhibition center, our team delivers outside broadcast and multi-camera live production solutions tailored to your requirements. We serve government agencies, corporate clients, and event organizers across the UAE with reliable, professional-grade live event coverage.',
          ]}
        />
      </PageSection>

      <PageSection>
        <PageFeaturesGrid
          title="Broadcasting Capabilities"
          description="Our live broadcasting solutions in Dubai cover the full spectrum of event production needs. From outdoor OB van deployments to indoor portable systems, we deliver professional multi-camera production and conference streaming for every event type. Government bodies and corporate organizations trust MAP for reliable, broadcast-grade event coverage."
          items={broadcastingCapabilities}
        />
      </PageSection>

      <PageSection>
        <div className="rounded-2xl border border-border/60 border-l-4 border-l-primary bg-muted/20 p-6 md:p-8">
          <h2 className="text-xl font-semibold md:text-2xl">Outside Broadcast (OB Van)</h2>
          <p className="text-muted-foreground mt-4 text-sm md:text-base tracking-tight leading-relaxed">
            Outside broadcast (OB) units are mobile production trucks equipped for live event coverage in Dubai
            and across the UAE. Our OB van infrastructure delivers broadcast-grade quality for outdoor venues,
            sports stadia, and open-air events. When traditional studio production is not feasible, outside
            broadcast systems bring the full production facility to your location—cameras, vision mixing,
            audio, and transmission all in one mobile unit.
          </p>
          <p className="text-muted-foreground mt-4 text-sm md:text-base tracking-tight leading-relaxed">
            Outside broadcast in Dubai is ideal for sports broadcasting, government events, live concerts,
            public ceremonies, and any production requiring on-site, mobile broadcast capability. Our OB vans are
            fully crewed and equipped for multi-camera live production, recording, and live streaming services.
          </p>
          <h3 className="mt-6 font-medium">When to Use Outside Broadcast</h3>
          <ul className="text-muted-foreground mt-2 space-y-1 text-sm">
            {obVanUseCases.map((useCase, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="text-primary size-4 shrink-0" />
                {useCase}
              </li>
            ))}
          </ul>
          <Button asChild className="mt-6 rounded-full" variant="outline">
            <Link href="/broadcasting/outside-broadcast">
              View OB Van Infrastructure
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </PageSection>

      {/* 5) Portable Broadcast Systems */}
      <PageSection>
        <div className="rounded-2xl border border-border/60 border-l-4 border-l-primary bg-muted/20 p-6 md:p-8">
          <h2 className="text-xl font-semibold md:text-2xl">Portable Broadcast Systems</h2>
          <p className="text-muted-foreground mt-4 text-sm md:text-base tracking-tight leading-relaxed">
            A portable broadcast system in Dubai offers flexible, transportable production solutions for
            indoor venues where a full OB van is not required. Our flight case and compact broadcast units
            are designed for quick deployment in hotel ballrooms, conference halls, exhibition centers, and
            temporary event spaces. Ideal for corporate conferences, product launches, and hybrid events
            that demand professional multi-camera production without the footprint of a mobile broadcast truck.
          </p>
          <p className="text-muted-foreground mt-4 text-sm md:text-base tracking-tight leading-relaxed">
            Portable broadcast systems support indoor events, temporary broadcast setups, and venues with
            limited access. We provide live streaming services, vision switching, and recording for
            conference live streaming in Dubai and across the UAE.
          </p>
          <ul className="text-muted-foreground mt-4 space-y-1 text-sm">
            {portableUseCases.map((useCase, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="text-primary size-4 shrink-0" />
                {useCase}
              </li>
            ))}
          </ul>
          <Button asChild className="mt-6 rounded-full" variant="outline">
            <Link href="/broadcasting/portable-broadcast-systems">
              View Portable Systems
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </PageSection>

      {/* 6) Multi-Camera Production Workflow */}
      <PageSection>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold md:text-2xl">Multi-Camera Production Workflow</h2>
            <p className="text-muted-foreground mt-2 text-sm md:text-base tracking-tight  leading-relaxed ">
              Our multi-camera live production workflow in Dubai integrates vision switching, multi-camera
              monitoring, recording and replay, live streaming output, and professional audio integration into
              a cohesive pipeline. Whether you require outside broadcast for a sports event or conference live
              streaming for a corporate summit, we deliver end-to-end production with broadcast-grade quality.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {workflowSteps.map((step, i) => (
              <span
                key={i}
                className="rounded-full border border-border/60 bg-muted/30 px-4 py-2 text-sm font-medium"
              >
                {step}
              </span>
            ))}
          </div>
        </div>
      </PageSection>

      <PageSection>
        <PageUseCasesGrid
          title="Use Cases"
          description="Our broadcasting services in Dubai support a wide range of use cases. We are trusted by government agencies, corporate organizations, and event producers for live production needs. From corporate events and government conferences to sports coverage, product launches, and panel discussions, our outside broadcast and portable broadcast systems deliver reliable, professional event coverage across the UAE."
          items={useCases}
          cols={5}
        />
      </PageSection>

      {/* 8) Technical Integration */}
      <PageSection>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold md:text-2xl">Technical Integration</h2>
            <p className="text-muted-foreground mt-2 text-sm md:text-base tracking-tight  leading-relaxed ">
              Our live broadcasting infrastructure in Dubai integrates camera systems, audio routing, monitoring,
              recording, and streaming outputs into a cohesive production environment. Multi-format camera
              setups support 4K and broadcast standards; professional audio distribution ensures clean
              signals; multiviewers and QC monitoring maintain quality; redundant recording systems protect
              your content; and multi-platform streaming outputs deliver to web, social, and broadcast
              destinations. High-level technical integration for event broadcasting in Dubai and the UAE.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* 9) Deployment Process */}
      <PageSection>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold md:text-2xl">Deployment Process</h2>
            <p className="text-muted-foreground mt-2 text-sm md:text-base tracking-tight  leading-relaxed ">
              Our deployment process for live broadcasting in Dubai follows a streamlined path from planning to
              breakdown. We conduct site surveys and technical planning to ensure seamless integration with
              your venue. Equipment deployment and configuration are executed by experienced crews. During
              live production, our technical team provides full support. Post-event, we manage efficient
              strike and equipment return. This process applies to both OB van deployments and portable
              broadcast system setups for event broadcasting across the UAE.
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

      {/* 10) Service Coverage */}
      <PageSection>
        <div className="rounded-2xl border border-border/60 border-l-4 border-l-primary bg-muted/20 p-6 md:p-8">
          <h2 className="text-xl font-semibold md:text-2xl">Service Coverage</h2>
          <p className="text-muted-foreground mt-3 text-sm md:text-base leading-relaxed max-w-3xl">
            MAP provides live broadcasting and event production services across the Gulf region. Our presence
            in Dubai and the UAE, Saudi Arabia, Oman, and Qatar enables rapid deployment for outside broadcast
            and portable broadcast system requirements. Whether you need conference live streaming, sports
            coverage, or multi-camera production for government events, we deliver professional broadcasting
            services with regional expertise and support.
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
          description="Discover our outside broadcast, OB van, portable broadcast systems, and flight case units. Each solution is designed for specific event broadcasting needs in Dubai and the UAE."
          links={broadcastingInternalLinks}
        />
      </PageSection>

      <div className={SECTION_CLASS}>
        <div className="rounded-2xl border border-border/60 bg-muted/30 px-6 py-10 md:px-12 md:py-12">
          <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
            <div className="space-y-4 max-w-xl">
              <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                Ready for Your Next Broadcast?
              </h2>
              <p className="text-muted-foreground">
                Request a quote or speak with our broadcast team to plan your live production in Dubai.
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
