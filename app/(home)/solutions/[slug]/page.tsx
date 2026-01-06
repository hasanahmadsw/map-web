import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { solutionsService } from '@/services/solutions.service';
import { servicesService } from '@/services/services.service';

import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import Image from 'next/image';
import DivHtml from '@/components/shared/div-html';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ServiceCard } from '@/components/website/home/services/service-card';
import type { ServiceResponse } from '@/types/services.types';
import { singleSolutionSchema } from '@/utils/seo/schema/solutions/single-solution-schema';
import {
  getSolutionKeyBySlug,
  getSolutionKeyInfo,
  getSolutionMetadata,
} from '@/components/website/solutions/data-utils';
import { SolutionKey } from '@/types/solution-key.enum';
import { CTASection } from '@/components/website/common/cta-section';
import { PageHeroSection } from '@/components/website/common/page-hero-section';
import { FeaturesListSection } from '@/components/website/common/features-list-section';
import { FeaturesGridSection } from '@/components/website/common/features-grid-section';
import { UseCasesSection } from '@/components/website/common/use-cases-section';
import { StatsSection } from '@/components/website/common/stats-section';
import { Award, Shield, Settings, Users, Clock, Zap } from 'lucide-react';

interface SolutionPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: SolutionPageProps): Promise<Metadata> {
  const { slug } = await params;

  // Check if it's a static solution key first
  const solutionKey = getSolutionKeyBySlug(slug);
  if (solutionKey) {
    const solutionInfo = getSolutionKeyInfo(solutionKey);
    const keywords = [solutionInfo.title, ...solutionInfo.keywords, 'solutions', 'media production'].filter(
      Boolean,
    );

    return createEnhancedMetadata({
      title: { absolute: `${solutionInfo.title} Solution in UAE` },
      description: solutionInfo.description,
      type: 'article',
      keywords,
      pathname: `/solutions/${solutionInfo.slug}`,
      mainOverrides: {
        category: `${solutionInfo.title} Solution`,
      },
    });
  }

  // Otherwise, try to fetch from database
  const solution = await solutionsService.getBySlug(slug);

  if (!solution) {
    notFound();
  }

  const keywords = [
    solution.name,
    ...(solution.meta?.keywords || []),
    'media production',
    'broadcasting',
    'solutions',
  ].filter(Boolean);

  const metadata = createEnhancedMetadata({
    title: { absolute: solution.name },
    description:
      solution.shortDescription ||
      solution.meta?.description ||
      `${solution.name} - Professional media production solution`,
    type: 'article',
    keywords,
    pathname: `/solutions/${solution.slug}`,
    image: solution.featuredImage || undefined,
    mainOverrides: {
      category: 'Media Production Solution',
    },
    openGraphOverrides: {
      tags: keywords,
      publishedTime: solution.createdAt,
      modifiedTime: solution.updatedAt,
    },
  });

  return metadata;
}

export default async function SolutionPage({ params }: SolutionPageProps) {
  const { slug } = await params;

  // Check if it's a static solution key first
  const solutionKey = getSolutionKeyBySlug(slug);
  let solutionInfo = null;
  let services: ServiceResponse[] = [];

  if (solutionKey) {
    // Handle static solution keys
    solutionInfo = getSolutionKeyInfo(solutionKey);
    try {
      const res = await servicesService.getAll({
        solutionKey: solutionKey,
        isPublished: true,
        limit: 100,
      });
      services = res.data || [];
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  } else {
    // Handle database solutions
    const solution = await solutionsService.getBySlug(slug);

    if (!solution) {
      notFound();
    }

    // Markup Schema for database solutions
    const jsonLd = await singleSolutionSchema(solution);

    return (
      <div className="bg-background min-h-screen">
        {/* JSON-LD */}
        <script
          id="solution-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
        />
        {/* Hero Section with Image */}
        <div className="pt-edge-nav-margin relative h-[60vh] w-full overflow-hidden md:h-[70vh]">
          {solution.featuredImage ? (
            <>
              <Image
                src={solution.featuredImage}
                alt={solution.name}
                fill
                className="object-cover"
                priority
                unoptimized={solution.featuredImage.includes('supabase.co')}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-transparent" />
            </>
          ) : (
            <div className="bg-muted absolute inset-0" />
          )}

          {/* Content Overlay */}
          <div className="relative z-10 container mx-auto flex h-full max-w-7xl flex-col justify-end px-6 py-10">
            <div className="space-y-4">
              {solution.isFeatured && (
                <Badge variant="default" className="text-sm font-medium">
                  Featured Solution
                </Badge>
              )}

              <h1 className="max-w-3xl text-4xl font-semibold text-white md:text-5xl">{solution.name}</h1>

              {solution.shortDescription && (
                <p className="max-w-2xl text-lg text-white/90 md:text-xl">{solution.shortDescription}</p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 container mx-auto max-w-7xl px-6 py-10">
          {/* Description Section */}
          {solution.description && (
            <section className="container max-w-7xl py-10">
              <div className="space-y-4">
                <h2 className="max-w-2xl text-3xl font-medium">About This Solution</h2>
                <div className="text-muted-foreground max-w-4xl leading-relaxed">
                  <DivHtml html={solution.description} />
                </div>
              </div>
            </section>
          )}

          {/* Services Section */}
          {solution.services && solution.services.length > 0 && (
            <section className="container max-w-7xl py-10">
              <div className="space-y-4">
                <h2 className="max-w-2xl text-3xl font-medium">Our Services</h2>
                <p className="text-muted-foreground max-w-2xl pb-6">
                  Comprehensive services included in this solution to meet your media production and
                  broadcasting needs
                </p>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {solution.services.map((service: ServiceResponse) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Call to Action Section */}
          <section className="container max-w-7xl py-10">
            <div className="mx-auto max-w-2xl space-y-6 text-center">
              <h2 className="text-3xl font-medium">Ready to Get Started?</h2>
              <p className="text-muted-foreground">
                Contact us to learn more about this solution and how it can help transform your media
                production and broadcasting needs.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  className="glass-button cursor-pointer rounded-full px-8 py-4 text-base font-medium"
                  href={`/contact`}
                >
                  Contact Us
                </Link>
                <Link
                  className="glass-button cursor-pointer rounded-full px-8 py-4 text-base font-medium"
                  href={`/solutions`}
                >
                  View All Solutions
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  // Render static solution key page
  if (!solutionInfo) {
    notFound();
  }

  const Icon = solutionInfo.icon;

  const solutionMetadata = getSolutionMetadata(solutionKey);

  return (
    <div className="bg-background min-h-screen">
      <PageHeroSection
        imageSrc="/hero.webp"
        imageAlt={`${solutionInfo.title} Solution`}
        badgeIcon={Icon}
        badgeText="Solution"
        title={solutionInfo.title}
        description={solutionInfo.description}
        secondaryDescription="Comprehensive solutions designed to meet your professional needs with cutting-edge technology and expert support."
      />

      {/* Main Content */}
      <section className="container space-y-16 py-16">
        <FeaturesListSection
          title="Key Features"
          description={`What makes our ${solutionInfo.title} solution exceptional`}
          features={solutionMetadata.features}
          gridCols="3"
        />

        <FeaturesGridSection
          title={`Why Choose ${solutionInfo.title}?`}
          description={`Key advantages of our ${solutionInfo.title.toLowerCase()} solution`}
          items={solutionMetadata.benefits}
          gridCols="3"
          hoverScale="1.02"
          iconColor="primary"
        />

        <UseCasesSection
          title="Perfect For"
          description={`Ideal scenarios for ${solutionInfo.title.toLowerCase()} solution`}
          useCases={solutionMetadata.useCases}
          gridCols="3"
        />

        {/* Services Section */}
        {services.length > 0 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-semibold md:text-4xl">Our Services</h2>
              <p className="text-muted-foreground mt-2 text-base md:text-lg">
                Comprehensive services included in this solution to meet your needs
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service: ServiceResponse) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        )}

        <StatsSection
          title="Our Track Record"
          description="Trusted by professionals across the region"
          stats={[
            { value: '500+', label: 'Projects Completed', icon: Award },
            { value: '100+', label: 'Satisfied Clients', icon: Users },
            { value: '24/7', label: 'Support Available', icon: Clock },
            { value: '25+', label: 'Years Experience', icon: Shield },
          ]}
        />

        {/* Call to Action Section */}
        <div className="section-padding">
          <CTASection
            title="Ready to Get Started?"
            description={`Contact us to learn more about ${solutionInfo.title} and how it can help transform your needs. Our team is ready to provide detailed information and answer any questions.`}
            buttons={[
              { text: 'Contact Us', href: '/contact' },
              { text: 'View All Solutions', href: '/solutions' },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
