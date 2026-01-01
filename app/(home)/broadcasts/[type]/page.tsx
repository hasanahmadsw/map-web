import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import {
  BroadcastsSection,
  BroadcastsSectionSkeleton,
} from '@/components/website/broadcasts/broadcasts-section';
import { CTASection } from '@/components/website/common/cta-section';

import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import SectionHeader from '@/components/website/common/section-header';
import {
  Building2,
  CheckCircle2,
  ArrowRight,
  Radio,
  Zap,
  Shield,
  Settings,
  Users,
  Clock,
} from 'lucide-react';
import CustomSearch from '@/components/shared/search/custom-search';
import { BroadcastType } from '@/types/broadcasts/broadcast.enums';

interface Props {
  params: Promise<{
    type: string;
  }>;
  searchParams?: Promise<{
    search?: string;
    page?: string;
    limit?: string;
  }>;
}

function getTypeFromSlug(slug: string): BroadcastType | null {
  const typeMap: Record<string, BroadcastType> = {
    obvan: BroadcastType.OBVAN,
    'flight-case': BroadcastType.FLIGHT_CASE,
    sng: BroadcastType.SNG,
    'internet-broadcast': BroadcastType.INTERNET_BROADCAST,
    other: BroadcastType.OTHER,
  };
  return typeMap[slug.toLowerCase()] || null;
}

function formatBroadcastType(type: BroadcastType): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

function getTypeMetadata(type: BroadcastType) {
  const metadataMap: Record<
    BroadcastType,
    {
      title: string;
      description: string;
      badgeText: string;
      headerTitle: string;
      highlightedText: string;
      headerDescription: string;
      features: string[];
      benefits: { title: string; description: string; icon: typeof Building2 }[];
      useCases: string[];
    }
  > = {
    [BroadcastType.OBVAN]: {
      title: 'OBVAN Broadcast Units | MAP',
      description:
        'Explore our Outside Broadcast Vans (OBVAN) - state-of-the-art mobile broadcast units designed for live events and professional broadcasting.',
      badgeText: 'OBVAN',
      headerTitle: 'Outside Broadcast ',
      highlightedText: 'Vans',
      headerDescription:
        'State-of-the-art mobile broadcast units designed for live events and professional broadcasting.',
      features: [
        'Multi-camera production setup',
        'Live event coverage capability',
        'Real-time broadcasting',
        'Professional audio mixing',
        'Mobile transmission systems',
        'On-site editing capabilities',
      ],
      benefits: [
        {
          title: 'Mobile Production',
          description: 'Complete broadcast production facility on wheels, ready for any location',
          icon: Building2,
        },
        {
          title: 'Live Coverage',
          description: 'Real-time broadcasting capabilities for sports, events, and breaking news',
          icon: Radio,
        },
        {
          title: 'Professional Quality',
          description: 'Broadcast-grade equipment ensuring exceptional production quality',
          icon: Shield,
        },
      ],
      useCases: [
        'Live Sports Events',
        'Music Festivals',
        'Corporate Events',
        'Breaking News',
        'Political Rallies',
        'Religious Ceremonies',
      ],
    },
    [BroadcastType.FLIGHT_CASE]: {
      title: 'Flight Case Broadcast Units | MAP',
      description:
        'Explore our portable Flight Case broadcast units - compact and mobile solutions for professional broadcasting and media production.',
      badgeText: 'Flight Cases',
      headerTitle: 'Portable Broadcast ',
      highlightedText: 'Flight Cases',
      headerDescription:
        'Compact and mobile broadcast units designed for professional broadcasting and media production.',
      features: [
        'Portable and lightweight',
        'Quick setup and deployment',
        'Durable construction',
        'Travel-friendly design',
        'Compact equipment storage',
        'Easy transportation',
      ],
      benefits: [
        {
          title: 'Portability',
          description: 'Lightweight and compact design perfect for travel and remote locations',
          icon: Zap,
        },
        {
          title: 'Quick Setup',
          description: 'Rapid deployment with minimal setup time for time-sensitive productions',
          icon: Clock,
        },
        {
          title: 'Durability',
          description: 'Robust construction designed to withstand travel and harsh conditions',
          icon: Shield,
        },
      ],
      useCases: [
        'Remote Productions',
        'Travel Documentaries',
        'Field Reporting',
        'Corporate Presentations',
        'Educational Content',
        'Small Events',
      ],
    },
    [BroadcastType.SNG]: {
      title: 'SNG Broadcast Units | MAP',
      description:
        'Explore our Satellite News Gathering (SNG) units - professional broadcast solutions for satellite transmission and remote broadcasting.',
      badgeText: 'SNG',
      headerTitle: 'Satellite News ',
      highlightedText: 'Gathering',
      headerDescription:
        'Professional broadcast units designed for satellite transmission and remote broadcasting.',
      features: [
        'Satellite transmission',
        'Global coverage capability',
        'Reliable connectivity',
        'Remote broadcasting',
        'High-quality transmission',
        'Real-time satellite uplink',
      ],
      benefits: [
        {
          title: 'Global Reach',
          description: 'Satellite transmission enabling broadcasting from anywhere in the world',
          icon: Radio,
        },
        {
          title: 'Reliable Connection',
          description: 'Consistent and stable satellite connectivity for critical broadcasts',
          icon: Shield,
        },
        {
          title: 'Remote Access',
          description: 'Broadcast from remote locations without traditional infrastructure',
          icon: Settings,
        },
      ],
      useCases: [
        'Breaking News',
        'International Events',
        'Remote Locations',
        'Disaster Coverage',
        'War Zones',
        'Rural Areas',
      ],
    },
    [BroadcastType.INTERNET_BROADCAST]: {
      title: 'Internet Broadcast Units | MAP',
      description:
        'Explore our Internet Broadcast units - professional solutions for online streaming and digital broadcasting.',
      badgeText: 'Internet Broadcast',
      headerTitle: 'Online Streaming & ',
      highlightedText: 'Digital Broadcasting',
      headerDescription:
        'Professional broadcast units designed for online streaming and digital broadcasting.',
      features: [
        'Online streaming capability',
        'Digital broadcasting',
        'Webinar support',
        'High-quality output',
        'Multi-platform streaming',
        'Interactive features',
      ],
      benefits: [
        {
          title: 'Digital Reach',
          description: 'Broadcast to global audiences through online platforms and streaming services',
          icon: Radio,
        },
        {
          title: 'Cost Effective',
          description: 'Affordable solution for reaching large audiences without satellite costs',
          icon: Zap,
        },
        {
          title: 'Interactive',
          description: 'Engage with audiences through live chat, polls, and interactive features',
          icon: Users,
        },
      ],
      useCases: [
        'Webinars',
        'Online Conferences',
        'Live Streaming',
        'Educational Content',
        'Product Launches',
        'Virtual Events',
      ],
    },
    [BroadcastType.OTHER]: {
      title: 'Other Broadcast Units | MAP',
      description:
        'Explore our additional broadcast units - specialized solutions for various broadcasting and media production needs.',
      badgeText: 'Other',
      headerTitle: 'Additional Broadcast ',
      highlightedText: 'Solutions',
      headerDescription: 'Specialized broadcast units for various broadcasting and media production needs.',
      features: [
        'Custom configurations',
        'Specialized equipment',
        'Tailored solutions',
        'Flexible options',
        'Unique requirements',
        'Bespoke setups',
      ],
      benefits: [
        {
          title: 'Customization',
          description: 'Tailored solutions designed to meet your specific production requirements',
          icon: Settings,
        },
        {
          title: 'Flexibility',
          description: 'Adaptable configurations for unique broadcasting scenarios',
          icon: Zap,
        },
        {
          title: 'Expert Consultation',
          description: 'Professional guidance to design the perfect broadcast solution',
          icon: Users,
        },
      ],
      useCases: [
        'Special Events',
        'Unique Productions',
        'Custom Requirements',
        'Experimental Broadcasting',
        'Niche Markets',
        'Specialized Content',
      ],
    },
  };
  return metadataMap[type];
}

export async function generateMetadata({ params }: Props) {
  const { type } = await params;
  const broadcastType = getTypeFromSlug(type);

  if (!broadcastType) {
    return createEnhancedMetadata({
      title: 'Broadcast Units | MAP',
      description: 'Explore our professional broadcast units.',
      pathname: `/broadcasts/${type}`,
    });
  }

  const metadata = getTypeMetadata(broadcastType);

  return createEnhancedMetadata({
    title: metadata.title,
    description: metadata.description,
    pathname: `/broadcasts/${type}`,
    mainOverrides: {
      category: `${formatBroadcastType(broadcastType)} Broadcast Units`,
    },
  });
}

export default async function BroadcastTypePage(props: Props) {
  const { type } = await props.params;
  const searchParams = await props.searchParams;

  const broadcastType = getTypeFromSlug(type);

  if (!broadcastType) {
    notFound();
  }

  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 12;
  const search = searchParams?.search || '';

  const metadata = getTypeMetadata(broadcastType);

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section with Background Image */}
      <div className="pt-edge-nav-margin relative h-[70vh] w-full overflow-hidden md:h-[80vh]">
        <Image
          src="/hero.webp"
          alt={`${metadata.badgeText} Broadcast Units`}
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/70 to-black/50" />

        {/* Content Overlay - Centered */}
        <div className="relative z-10 container mx-auto flex h-full max-w-7xl flex-col justify-center px-6 py-10">
          <div className="mx-auto max-w-4xl space-y-6 text-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
                <Building2 className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white">{metadata.badgeText}</span>
              </div>

              <h1 className="text-4xl font-semibold text-white md:text-5xl lg:text-6xl">
                {metadata.headerTitle}
                <span className="from-primary to-primary/80 bg-linear-to-r bg-clip-text text-transparent">
                  {metadata.highlightedText}
                </span>
              </h1>

              <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/90 md:text-xl">
                {metadata.headerDescription}
              </p>

              <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/80">
                {metadata.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="container space-y-16 py-16">
        {/* Features Section */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold md:text-4xl">Key Features</h2>
            <p className="text-muted-foreground mt-2 text-base md:text-lg">
              What makes our {metadata.badgeText} units exceptional
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {metadata.features.map((feature, index) => (
              <div
                key={index}
                className="group glass-card border-border/50 hover:border-primary/50 hover:bg-primary/5 flex items-center gap-3 rounded-lg border p-4 transition-all duration-200"
              >
                <CheckCircle2 className="text-primary h-5 w-5 shrink-0" />
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold md:text-4xl">Why Choose {metadata.badgeText}?</h2>
            <p className="text-muted-foreground mt-2 text-base md:text-lg">
              Key advantages of our {metadata.badgeText.toLowerCase()} broadcast solutions
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {metadata.benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="group glass-card relative overflow-hidden rounded-xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                >
                  <div className="space-y-4">
                    <div className="bg-primary/10 group-hover:bg-primary/20 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-colors">
                      <Icon className="text-primary h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="mb-2 font-semibold">{benefit.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="glass-card rounded-3xl p-8 md:p-12">
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-semibold md:text-4xl">Perfect For</h2>
              <p className="text-muted-foreground mt-2 text-base md:text-lg">
                Ideal scenarios for {metadata.badgeText.toLowerCase()} broadcast units
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {metadata.useCases.map((useCase, index) => (
                <div
                  key={index}
                  className="group border-border/50 bg-background/50 hover:border-primary/50 hover:bg-primary/5 flex items-center gap-3 rounded-lg border p-4 transition-all duration-200"
                >
                  <CheckCircle2 className="text-primary h-5 w-5 shrink-0" />
                  <span className="text-sm font-medium">{useCase}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Broadcast Units Section */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold md:text-4xl">Available {metadata.badgeText} Units</h2>
            <p className="text-muted-foreground mt-2 text-base md:text-lg">
              Browse our collection of professional {metadata.badgeText.toLowerCase()} broadcast units
            </p>
          </div>

          <Suspense key={`${page} | ${search}`} fallback={<BroadcastsSectionSkeleton />}>
            <BroadcastsSection page={page} limit={limit} search={search} type={broadcastType} />
          </Suspense>
        </div>

        {/* CTA Section */}
        <div className="section-padding">
          <CTASection
            title="Ready to Get Started?"
            description={`Explore our ${metadata.badgeText} units and discover how we can support your broadcasting needs. Get in touch with our team for personalized guidance and custom solutions.`}
            buttons={[
              { text: 'Contact Us', href: '/contact' },
              { text: 'View All Broadcasts', href: '/broadcasts' },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
