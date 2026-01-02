import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';

import {
  BroadcastsSection,
  BroadcastsSectionSkeleton,
} from '@/components/website/broadcasts/broadcasts-section';
import { CTASection } from '@/components/website/common/cta-section';

import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';

import { Building2, CheckCircle2 } from 'lucide-react';

import { BroadcastType } from '@/types/broadcasts/broadcast.enums';
import { getTypeFromSlug, getTypeMetadata } from '@/components/website/broadcasts/data-utils';

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

function formatBroadcastType(type: BroadcastType): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
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
                  className="group glass-card relative overflow-hidden rounded-xl p-6 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg"
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
