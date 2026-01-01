import { CTASection } from '@/components/website/common/cta-section';
import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import SectionHeader from '@/components/website/common/section-header';
import {
  Lightbulb,
  CheckCircle2,
  Award,
  Shield,
  Settings,
  Users,
  Clock,
  Zap,
  ArrowRight,
  Building2,
  Radio,
} from 'lucide-react';
import { StaticSolutionCard } from '@/components/website/solutions/static-solution-card';
import { allSolutionKeys } from '@/utils/solution-key-mapping';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function generateMetadata() {
  return createEnhancedMetadata({
    title: 'Creative Media Solutions for Brands & Businesses | MAP',
    description:
      'Discover tailored media solutions including video production, photography, and events management designed to elevate brands and engage audiences.',
    pathname: '/solutions',
    mainOverrides: {
      category: 'Media Production Solutions',
    },
  });
}

export default async function SolutionsPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section with Background Image */}
      <div className="pt-edge-nav-margin relative h-[70vh] w-full overflow-hidden md:h-[80vh]">
        <Image
          src="/hero.webp"
          alt="Professional Media Solutions"
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
                <Lightbulb className="h-4 w-4 text-white" />
                <span className="text-sm font-medium text-white">Media Solutions</span>
              </div>

              <h1 className="text-4xl font-semibold text-white md:text-5xl lg:text-6xl">
                Creative Media{' '}
                <span className="from-primary to-primary/80 bg-linear-to-r bg-clip-text text-transparent">
                  Solutions
                </span>
              </h1>

              <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/90 md:text-xl">
                Comprehensive media solutions designed to elevate your brand and engage your audience. From
                video production to photography and events management, we provide end-to-end solutions for
                your media needs.
              </p>

              <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/80">
                At MAP, we specialize in delivering tailored media solutions that combine creativity,
                technology, and expertise. Our diverse range of solutions ensures you have the right tools for
                any media production scenario.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="container space-y-16 py-16">
        {/* Solutions Grid */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold md:text-4xl">Our Solutions</h2>
            <p className="text-muted-foreground mt-2 text-base md:text-lg">
              Choose the perfect solution for your media production needs
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {allSolutionKeys.map(solutionKey => {
              const Icon = solutionKey.icon;
              return (
                <Link
                  key={solutionKey.key}
                  href={`/solutions/${solutionKey.slug}`}
                  className={cn(
                    'group glass-card relative block overflow-hidden rounded-xl p-6',
                    'flex min-h-[320px] flex-col transition-all duration-300',
                    'hover:scale-[1.02] hover:shadow-lg',
                  )}
                >
                  {/* Icon */}
                  <div className="mb-4">
                    <div className="bg-primary/10 group-hover:bg-primary/20 inline-flex h-14 w-14 items-center justify-center rounded-xl transition-colors">
                      <Icon className="text-primary h-7 w-7" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col">
                    <h3 className="text-foreground group-hover:text-primary mb-3 text-xl font-semibold transition-colors">
                      {solutionKey.title}
                    </h3>

                    <p className="text-muted-foreground mb-4 line-clamp-3 flex-1 text-sm leading-relaxed">
                      {solutionKey.description}
                    </p>

                    {/* Features */}
                    <div className="mb-4 space-y-2">
                      {solutionKey.keywords.slice(0, 2).map((keyword, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <Radio className="text-primary h-3 w-3 shrink-0" />
                          <span className="text-muted-foreground">{keyword}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="text-primary border-border/50 mt-auto flex items-center border-t pt-4 text-sm font-medium">
                      <span>Explore {solutionKey.title}</span>
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 will-change-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Features Section */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold md:text-4xl">Why Choose Our Solutions?</h2>
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
                  'Dependable solutions built to perform flawlessly in critical production environments.',
                color: 'text-green-500',
              },
              {
                icon: Settings,
                title: 'Tailored Flexibility',
                description: 'Customizable solutions that adapt to your unique project requirements.',
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
              Simple steps to get your media solution started
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
                title: 'Customization',
                description: 'We tailor the perfect solution to match your specific needs and goals',
              },
              {
                step: '03',
                title: 'Execution',
                description: 'Professional delivery with full support throughout the project lifecycle',
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
                Our solutions excel in various business scenarios
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
            description="Contact our team to discuss your media solution requirements and discover how our solutions can elevate your brand and engage your audience."
            buttons={[
              { text: 'Contact Us', href: '/contact' },
              { text: 'View Services', href: '/services' },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
