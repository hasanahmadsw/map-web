import { Suspense } from 'react';
import Image from 'next/image';

import { ServicesSection } from '@/components/website/services/services-section';
import { ServicesSectionSkeleton } from '@/components/website/services/services-section-skeleton';
import { CTASection } from '@/components/website/common/cta-section';
import { SolutionFilters } from '@/components/website/services/solution-filters';

import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import SectionHeader from '@/components/website/common/section-header';
import { Settings, CheckCircle2, Award, Shield, Users, Clock, Zap, Building2, Radio } from 'lucide-react';
import CustomSearch from '@/components/shared/search/custom-search';
import { solutionsService } from '@/services/solutions.service';
import type { SolutionResponse } from '@/types/solutions.types';

interface Props {
  searchParams?: Promise<{
    search?: string;
    page?: string;
    limit?: string;
    isFeatured?: string;
    solutionId?: string;
  }>;
}

export function generateMetadata() {
  return createEnhancedMetadata({
    title: 'Professional Media Production Services in UAE | MAP',
    description:
      'Explore our full range of media production services, from video filming and editing to post-production, animation, and branded content.',
    pathname: '/services',
    mainOverrides: {
      category: 'Media Production Services',
    },
  });
}

export default async function ServicesPage(props: Props) {
  const searchParams = await props.searchParams;

  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 12;
  const search = searchParams?.search || '';
  const solutionId = searchParams?.solutionId ? Number(searchParams.solutionId) : undefined;

  // Fetch solutions for filter badges
  let solutions: SolutionResponse[] = [];
  try {
    const solutionsResponse = await solutionsService.getAll({
      isPublished: true,
      limit: 100, // Get all solutions for filters
    });
    solutions = solutionsResponse.data || [];
  } catch {
    // If solutions fail to load, continue without filters
    solutions = [];
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section with Background Image */}
      <div className="pt-edge-nav-margin relative h-[70vh] w-full overflow-hidden md:h-[80vh]">
        <Image
          src="/hero.webp"
          alt="Professional Media Services"
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
                <Settings className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white">Media Services</span>
              </div>

              <h1 className="text-4xl font-semibold text-white md:text-5xl lg:text-6xl">
                Professional Media{' '}
                <span className="from-primary to-primary/80 bg-linear-to-r bg-clip-text text-transparent">
                  Production Services
                </span>
              </h1>

              <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/90 md:text-xl">
                Comprehensive media production services designed to bring your vision to life. From video
                production and editing to photography and post-production, we provide end-to-end solutions for
                your media needs.
              </p>

              <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/80">
                At MAP, we specialize in delivering high-quality media services that combine creativity,
                technical expertise, and cutting-edge technology. Our diverse range of services ensures you
                have the right solutions for any production scenario.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="container space-y-16 py-16">
        {/* Search Section */}
        <div className="flex w-full items-center justify-center gap-4">
          <CustomSearch
            query="search"
            placeholder="Search services..."
            Icon={
              <Settings className="text-primary absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 transform" />
            }
            className="w-full sm:w-2xl"
          />
        </div>

        {/* Solution Filters */}
        {solutions.length > 0 && (
          <div>
            <SolutionFilters solutions={solutions} />
          </div>
        )}

        {/* Features Section */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold md:text-4xl">Why Choose Our Services?</h2>
            <p className="text-muted-foreground mt-2 text-base md:text-lg">
              Professional-grade services and expertise for every project
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Award,
                title: 'Unmatched Quality',
                description:
                  'Deliver exceptional results with our premium services and industry-leading standards.',
                color: 'text-blue-500',
              },
              {
                icon: Shield,
                title: 'Reliable Performance',
                description:
                  'Dependable services built to perform flawlessly in critical production environments.',
                color: 'text-green-500',
              },
              {
                icon: Settings,
                title: 'Tailored Solutions',
                description: 'Customizable services that adapt to your unique project requirements.',
                color: 'text-purple-500',
              },
              {
                icon: Users,
                title: 'Expert Team',
                description: 'Experienced professionals dedicated to bringing your vision to life.',
                color: 'text-orange-500',
              },
              {
                icon: Zap,
                title: 'Efficient Delivery',
                description: 'Streamlined processes ensuring timely completion of your projects.',
                color: 'text-yellow-500',
              },
              {
                icon: CheckCircle2,
                title: 'End-to-End Support',
                description: 'Comprehensive support from initial consultation to final delivery.',
                color: 'text-red-500',
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group glass-card relative overflow-hidden rounded-xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                >
                  <div className="space-y-4">
                    <div
                      className={`bg-primary/10 group-hover:bg-primary/20 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-colors`}
                    >
                      <Icon className={`${feature.color} h-6 w-6`} />
                    </div>
                    <div>
                      <h3 className="mb-2 font-semibold">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Services Section */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold md:text-4xl">Our Services</h2>
            <p className="text-muted-foreground mt-2 text-base md:text-lg">
              Browse our comprehensive range of professional media production services
            </p>
          </div>

          <Suspense key={`${page} | ${search}`} fallback={<ServicesSectionSkeleton />}>
            <ServicesSection page={page} limit={limit} search={search} />
          </Suspense>
        </div>

        {/* Stats Section */}
        <div className="glass-card rounded-3xl p-8 md:p-12">
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-semibold md:text-4xl">Our Track Record</h2>
              <p className="text-muted-foreground mt-2 text-base md:text-lg">
                Trusted by businesses and brands across the region
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {[
                { value: '500+', label: 'Projects Completed', icon: Building2 },
                { value: '100+', label: 'Satisfied Clients', icon: Users },
                { value: '25+', label: 'Years Experience', icon: Clock },
                { value: '24/7', label: 'Support Available', icon: Shield },
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="bg-primary/10 mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full">
                      <Icon className="text-primary h-8 w-8" />
                    </div>
                    <div className="text-foreground mb-1 text-3xl font-bold md:text-4xl">{stat.value}</div>
                    <div className="text-muted-foreground text-sm font-medium">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold md:text-4xl">How It Works</h2>
            <p className="text-muted-foreground mt-2 text-base md:text-lg">
              Simple steps to get your media project started
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Consultation',
                description: 'Discuss your project requirements and objectives with our expert team',
              },
              {
                step: '02',
                title: 'Planning & Execution',
                description: 'We plan and execute your project with attention to detail and quality',
              },
              {
                step: '03',
                title: 'Delivery & Support',
                description: 'Professional delivery with ongoing support and revisions as needed',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group glass-card relative overflow-hidden rounded-xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-bold">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="glass-card rounded-3xl p-8 md:p-12">
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-semibold md:text-4xl">Perfect For</h2>
              <p className="text-muted-foreground mt-2 text-base md:text-lg">
                Our services excel in various business scenarios
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                'Brand Marketing',
                'Corporate Communications',
                'Product Launches',
                'Event Coverage',
                'Content Creation',
                'Social Media',
                'Training & Education',
                'Documentation',
              ].map((useCase, index) => (
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

        {/* CTA Section */}
        <div className="section-padding">
          <CTASection
            title="Ready to Start Your Next Project?"
            description="Contact our team to discuss your media service requirements and discover how our services can elevate your brand and engage your audience."
            buttons={[
              { text: 'Contact Us', href: '/contact' },
              { text: 'View Solutions', href: '/solutions' },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
