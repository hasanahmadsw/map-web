import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { servicesService } from '@/services/services.service';

import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import Image from 'next/image';
import DivHtml from '@/components/shared/div-html';
import { Badge } from '@/components/ui/badge';

import Link from 'next/link';
import type { SubService } from '@/types/services.types';
import { singleServiceSchema } from '@/utils/seo/schema/services/single-service-schema';

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await servicesService.getBySlug(slug);

  if (!service) {
    notFound();
  }

  const keywords = [
    service.name,
    ...(service.meta?.keywords || []),
    'media production',
    'broadcasting',
    'services',
  ].filter(Boolean);

  const metadata = createEnhancedMetadata({
    title: { absolute: `${service.name} | MAP Media Art Production` },
    description:
      service.shortDescription || service.meta?.description || `${service.name} - Media Production Services`,
    type: 'article',
    keywords,
    pathname: `/services/${service.slug}`,
    image: service.featuredImage || undefined,
    mainOverrides: {
      category: 'Media Production Services',
    },
    openGraphOverrides: {
      tags: keywords,
      publishedTime: service.createdAt,
      modifiedTime: service.updatedAt,
    },
  });

  return metadata;
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;

  const service = await servicesService.getBySlug(slug);

  if (!service) {
    notFound();
  }

  // Markup Schema
  const jsonLd = await singleServiceSchema(service);

  return (
    <div className="bg-background min-h-screen">
      {/* JSON-LD */}
      <script
        id="service-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      {/* Hero Section with Image */}
      <div className="pt-edge-nav-margin relative h-[60vh] w-full overflow-hidden md:h-[70vh]">
        {service.featuredImage && service.featuredImage.trim() !== '' ? (
          <>
            <Image
              src={service.featuredImage}
              alt={service.name}
              fill
              className="object-cover"
              priority
              unoptimized={service.featuredImage.includes('supabase.co')}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-transparent" />
          </>
        ) : (
          <div className="bg-muted absolute inset-0" />
        )}

        {/* Content Overlay */}
        <div className="relative z-10 container mx-auto flex h-full max-w-7xl flex-col justify-end px-6 py-10">
          <div className="space-y-4">
            {service.isFeatured && (
              <Badge variant="default" className="text-sm font-medium">
                Featured Service
              </Badge>
            )}

            <h1 className="max-w-3xl text-4xl font-semibold text-white md:text-5xl">{service.name}</h1>

            {service.shortDescription && (
              <p className="max-w-2xl text-lg text-white/90 md:text-xl">{service.shortDescription}</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto max-w-7xl px-6 py-10">
        {/* Description Section */}
        {service.description && (
          <section className="container max-w-7xl py-10">
            <div className="space-y-4">
              <h2 className="max-w-2xl text-3xl font-medium">About This Service</h2>
              <div className="text-muted-foreground max-w-4xl leading-relaxed">
                <DivHtml html={service.description} />
              </div>
            </div>
          </section>
        )}

        {/* Sub Services Section */}
        {service.subServices && service.subServices.length > 0 && (
          <section className="container max-w-7xl py-10">
            <div className="space-y-4">
              <h2 className="max-w-2xl text-3xl font-medium">Sub Services</h2>
              <p className="text-muted-foreground max-w-2xl pb-6">
                Detailed breakdown of services included in this offering
              </p>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {service.subServices.map((subService: SubService, index: number) => (
                  <div key={index} className="glass-card rounded-xl p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold">{subService.title}</h3>
                    </div>

                    {subService.description && (
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {subService.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Call to Action Section */}
        <section className="container max-w-7xl py-10">
          <div className="mx-auto max-w-2xl space-y-6 text-center">
            <h2 className="text-3xl font-medium">Interested in This Service?</h2>
            <p className="text-muted-foreground">
              Contact us to learn more about this service and how it can help your media production and
              broadcasting needs.
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
                href={`/services`}
              >
                View All Services
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
