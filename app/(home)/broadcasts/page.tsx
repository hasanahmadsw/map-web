import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import SectionHeader from '@/components/website/common/section-header';
import {
  Building2,
  Radio,
  ArrowRight,
  Truck,
  Briefcase,
  Satellite,
  Wifi,
  MoreHorizontal,
  CheckCircle2,
  Award,
  Users,
  Clock,
  Shield,
  Zap,
  Settings,
  HeadphonesIcon,
} from 'lucide-react';
import { CTASection } from '@/components/website/common/cta-section';
import { BroadcastType } from '@/types/broadcasts/broadcast.enums';
import { broadcastsSchema } from '@/utils/seo/schema/broadcasts/broadcasts-schema';

interface Props {
  searchParams?: Promise<{
    search?: string;
    page?: string;
    limit?: string;
    type?: string;
  }>;
}

const broadcastTypes = [
  {
    type: BroadcastType.OBVAN,
    slug: 'obvan',
    label: 'OBVAN',
    icon: Truck,
    description:
      'State-of-the-art mobile broadcast vans designed for live events, sports coverage, and on-location production. Fully equipped with professional-grade equipment for seamless remote broadcasting.',
    features: ['Mobile Production', 'Live Event Coverage', 'Multi-Camera Setup', 'Real-time Broadcasting'],
  },
  {
    type: BroadcastType.FLIGHT_CASE,
    slug: 'flight-case',
    label: 'Flight Cases',
    icon: Briefcase,
    description:
      'Portable and compact broadcast equipment cases perfect for travel and remote productions. Engineered for durability and quick deployment in any location.',
    features: ['Portable Design', 'Quick Setup', 'Durable Construction', 'Travel-Friendly'],
  },
  {
    type: BroadcastType.SNG,
    slug: 'sng',
    label: 'SNG',
    icon: Satellite,
    description:
      'Satellite News Gathering units equipped with advanced transmission technology for reliable satellite communication and remote broadcasting from anywhere in the world.',
    features: ['Satellite Transmission', 'Global Coverage', 'Reliable Connectivity', 'Remote Broadcasting'],
  },
  // {
  //   type: BroadcastType.INTERNET_BROADCAST,
  //   slug: 'internet-broadcast',
  //   label: 'Internet Broadcast',
  //   icon: Wifi,
  //   description:
  //     'Professional solutions for online streaming and digital broadcasting. Perfect for webinars, live streaming, and digital content creation with high-quality output.',
  //   features: ['Online Streaming', 'Digital Broadcasting', 'Webinar Support', 'High-Quality Output'],
  // },
  // {
  //   type: BroadcastType.OTHER,
  //   slug: 'other',
  //   label: 'Other Solutions',
  //   icon: MoreHorizontal,
  //   description:
  //     'Specialized broadcast solutions tailored to unique production requirements. Custom configurations and specialized equipment for specific broadcasting needs.',
  //   features: ['Custom Solutions', 'Specialized Equipment', 'Tailored Configurations', 'Flexible Options'],
  // },
];

export function generateMetadata() {
  return createEnhancedMetadata({
    title: 'Broadcast Solutions | MAP Media Art Production',
    description:
      'Explore our comprehensive range of professional broadcast solutions including OBVAN units, Flight Cases, SNG systems, and Internet Broadcasting solutions designed for modern media production.',
    pathname: '/broadcasts',
    mainOverrides: {
      category: 'Media Production Broadcasts',
    },
  });
}

export default async function BroadcastsPage(props: Props) {
  const jsonLd = await broadcastsSchema(broadcastTypes);

  return (
    <>
      {/* JSON-LD */}
      <script
        id="broadcasts-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <div className="bg-background min-h-screen">
        {/* Hero Section with Background Image */}
        <div className="pt-edge-nav-margin relative h-[70vh] w-full overflow-hidden md:h-[80vh]">
          <Image
            src="/hero.webp"
            alt="Professional Broadcast Solutions"
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
                  <span className="text-sm font-medium text-white">Broadcast Solutions</span>
                </div>

                <h1 className="text-4xl font-semibold text-white md:text-5xl lg:text-6xl">
                  Professional Media{' '}
                  <span className="from-primary to-primary/80 bg-linear-to-r bg-clip-text text-transparent">
                    Broadcast Systems
                  </span>
                </h1>

                <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/90 md:text-xl">
                  Comprehensive broadcast solutions designed for modern media production. From mobile OBVAN
                  units to portable flight cases, we provide cutting-edge technology for every broadcasting
                  need.
                </p>

                <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/80">
                  At MAP, we specialize in providing state-of-the-art broadcast equipment and solutions for
                  professional media production. Our diverse range of broadcast systems ensures you have the
                  right tools for any production scenario.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <section className="container space-y-16 py-16">
          {/* Broadcast Types Grid */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-semibold md:text-4xl">Our Broadcast Solutions</h2>
              <p className="text-muted-foreground mt-2 text-base md:text-lg">
                Choose the perfect broadcast system for your production needs
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {broadcastTypes.map(broadcast => {
                const Icon = broadcast.icon;
                return (
                  <Link
                    key={broadcast.type}
                    href={`/broadcasts/${broadcast.slug}`}
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
                        {broadcast.label}
                      </h3>

                      <p className="text-muted-foreground mb-4 line-clamp-3 flex-1 text-sm leading-relaxed">
                        {broadcast.description}
                      </p>

                      {/* Features */}
                      <div className="mb-4 space-y-2">
                        {broadcast.features.slice(0, 2).map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs">
                            <Radio className="text-primary h-3 w-3 shrink-0" />
                            <span className="text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      <div className="text-primary border-border/50 mt-auto flex items-center border-t pt-4 text-sm font-medium">
                        <span>Explore {broadcast.label}</span>
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
              <h2 className="text-3xl font-semibold md:text-4xl">Why Choose Our Broadcast Solutions?</h2>
              <p className="text-muted-foreground mt-2 text-base md:text-lg">
                Professional-grade equipment and expertise for every production
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Award,
                  title: 'Professional Grade',
                  description: 'Industry-standard equipment trusted by broadcast professionals worldwide',
                  color: 'text-blue-500',
                },
                {
                  icon: Shield,
                  title: 'Reliable Performance',
                  description: 'Tested and proven systems designed for demanding production environments',
                  color: 'text-green-500',
                },
                {
                  icon: Settings,
                  title: 'Flexible Solutions',
                  description: 'Customizable configurations to meet your specific production requirements',
                  color: 'text-purple-500',
                },
                {
                  icon: HeadphonesIcon,
                  title: 'Expert Support',
                  description: 'Comprehensive technical support and training from our experienced team',
                  color: 'text-orange-500',
                },
                {
                  icon: Zap,
                  title: 'Quick Deployment',
                  description: 'Rapid setup and deployment capabilities for time-sensitive productions',
                  color: 'text-yellow-500',
                },
                {
                  icon: CheckCircle2,
                  title: 'Quality Assurance',
                  description: 'Rigorous testing and quality control ensuring flawless broadcast delivery',
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
                  Trusted by broadcast professionals across the region
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                {[
                  { value: '500+', label: 'Productions', icon: Building2 },
                  { value: '50+', label: 'Broadcast Units', icon: Radio },
                  { value: '100+', label: 'Satisfied Clients', icon: Users },
                  { value: '24/7', label: 'Support Available', icon: Clock },
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
                Simple steps to get your broadcast production started
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  step: '01',
                  title: 'Consultation',
                  description: 'Discuss your production requirements and objectives with our expert team',
                },
                {
                  step: '02',
                  title: 'Customization',
                  description: 'We tailor the perfect broadcast solution to match your specific needs',
                },
                {
                  step: '03',
                  title: 'Deployment',
                  description: 'Rapid setup and deployment with full technical support throughout',
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
                  Our broadcast solutions excel in various production scenarios
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                  'Live Sports Events',
                  'Breaking News Coverage',
                  'Corporate Conferences',
                  'Music Festivals',
                  'Political Broadcasts',
                  'Religious Ceremonies',
                  'Educational Webinars',
                  'Product Launches',
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
              title="Ready to Start Your Next Production?"
              description="Contact our team to discuss your broadcast requirements and discover how our solutions can elevate your media production capabilities."
              buttons={[
                { text: 'Contact Us', href: '/contact' },
                { text: 'View Solutions', href: '/solutions' },
              ]}
            />
          </div>
        </section>
      </div>
    </>
  );
}
