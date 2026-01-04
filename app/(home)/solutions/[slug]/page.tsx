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
import { getSolutionKeyBySlug, getSolutionKeyInfo } from '@/utils/solution-key-mapping';
import { SolutionKey } from '@/types/solution-key.enum';
import { CTASection } from '@/components/website/common/cta-section';
import { CheckCircle2, Award, Shield, Settings, Users, Clock, Zap, ArrowRight } from 'lucide-react';

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

  // Get solution-specific metadata
  function getSolutionMetadata(key: SolutionKey) {
    const metadataMap: Record<
      SolutionKey,
      {
        features: string[];
        benefits: { title: string; description: string; icon: typeof Award }[];
        useCases: string[];
      }
    > = {
      [SolutionKey.PRODUCTION]: {
        features: [
          'Professional video production',
          'Post-production editing',
          'Broadcast quality output',
          'Multi-camera setups',
          'Live streaming capabilities',
          'Content creation services',
        ],
        benefits: [
          {
            title: 'Professional Quality',
            description: 'Broadcast-grade production ensuring exceptional visual and audio quality',
            icon: Award,
          },
          {
            title: 'Expert Team',
            description: 'Experienced professionals with years of industry expertise',
            icon: Users,
          },
          {
            title: 'Advanced Technology',
            description: 'State-of-the-art equipment and cutting-edge production tools',
            icon: Settings,
          },
        ],
        useCases: [
          'Corporate Videos',
          'Commercial Production',
          'Documentary Films',
          'Live Broadcasts',
          'Content Marketing',
          'Social Media Content',
        ],
      },
      [SolutionKey.PHOTOGRAPHY]: {
        features: [
          'Professional photography',
          'Event coverage',
          'Product photography',
          'Corporate headshots',
          'Creative photo shoots',
          'Post-processing services',
        ],
        benefits: [
          {
            title: 'Creative Excellence',
            description: 'Artistic vision combined with technical expertise for stunning results',
            icon: Award,
          },
          {
            title: 'Versatile Solutions',
            description: 'Adaptable to various photography needs from events to commercial shoots',
            icon: Settings,
          },
          {
            title: 'Quick Turnaround',
            description: 'Efficient workflow ensuring timely delivery of high-quality images',
            icon: Clock,
          },
        ],
        useCases: [
          'Corporate Events',
          'Product Launches',
          'Wedding Photography',
          'Fashion Shoots',
          'Real Estate',
          'Portrait Sessions',
        ],
      },
      [SolutionKey.EVENTS]: {
        features: [
          'Event planning & coordination',
          'Live event coverage',
          'Technical support',
          'Equipment rental',
          'On-site production',
          'Post-event services',
        ],
        benefits: [
          {
            title: 'Complete Solutions',
            description: 'End-to-end event management from planning to execution',
            icon: Shield,
          },
          {
            title: 'Reliable Support',
            description: '24/7 technical support ensuring smooth event operations',
            icon: Users,
          },
          {
            title: 'Scalable Services',
            description: 'Flexible solutions that adapt to events of any size',
            icon: Zap,
          },
        ],
        useCases: [
          'Corporate Conferences',
          'Music Festivals',
          'Sports Events',
          'Product Launches',
          'Award Ceremonies',
          'Trade Shows',
        ],
      },
    };
    return metadataMap[key];
  }

  const solutionMetadata = getSolutionMetadata(solutionKey);

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section with Background Image */}
      <div className="pt-edge-nav-margin relative h-[70vh] w-full overflow-hidden md:h-[80vh]">
        <Image
          src="/hero.webp"
          alt={`${solutionInfo.title} Solution`}
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
                <Icon className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white">Solution</span>
              </div>

              <h1 className="text-4xl font-semibold text-white md:text-5xl lg:text-6xl">
                {solutionInfo.title}
              </h1>

              <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/90 md:text-xl">
                {solutionInfo.description}
              </p>

              <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/80">
                Comprehensive solutions designed to meet your professional needs with cutting-edge technology
                and expert support.
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
              What makes our {solutionInfo.title} solution exceptional
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {solutionMetadata.features.map((feature, index) => (
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
            <h2 className="text-3xl font-semibold md:text-4xl">Why Choose {solutionInfo.title}?</h2>
            <p className="text-muted-foreground mt-2 text-base md:text-lg">
              Key advantages of our {solutionInfo.title.toLowerCase()} solution
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {solutionMetadata.benefits.map((benefit, index) => {
              const BenefitIcon = benefit.icon;
              return (
                <div
                  key={index}
                  className="group glass-card relative overflow-hidden rounded-xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                >
                  <div className="space-y-4">
                    <div className="bg-primary/10 group-hover:bg-primary/20 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-colors">
                      <BenefitIcon className="text-primary h-6 w-6" />
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
                Ideal scenarios for {solutionInfo.title.toLowerCase()} solution
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {solutionMetadata.useCases.map((useCase, index) => (
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

        {/* Stats Section */}
        <div className="glass-card rounded-3xl p-8 md:p-12">
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-semibold md:text-4xl">Our Track Record</h2>
              <p className="text-muted-foreground mt-2 text-base md:text-lg">
                Trusted by professionals across the region
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {[
                { value: '500+', label: 'Projects Completed', icon: Award },
                { value: '100+', label: 'Satisfied Clients', icon: Users },
                { value: '24/7', label: 'Support Available', icon: Clock },
                { value: '25+', label: 'Years Experience', icon: Shield },
              ].map((stat, index) => {
                const StatIcon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="bg-primary/10 mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full">
                      <StatIcon className="text-primary h-8 w-8" />
                    </div>
                    <div className="text-foreground mb-1 text-3xl font-bold md:text-4xl">{stat.value}</div>
                    <div className="text-muted-foreground text-sm font-medium">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

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
