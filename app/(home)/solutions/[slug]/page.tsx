import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { solutionsService } from '@/services/solutions.service';

import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import Image from 'next/image';
import DivHtml from '@/components/shared/div-html';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ServiceCard } from '@/components/website/home/service-card';
import type { ServiceResponse } from '@/types/services.types';
import { singleSolutionSchema } from '@/utils/seo/schema/solutions/single-solution-schema';

interface SolutionPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: SolutionPageProps): Promise<Metadata> {
  const { slug } = await params;
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

  const solution = await solutionsService.getBySlug(slug);

  if (!solution) {
    notFound();
  }

  // Markup Schema
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
              Contact us to learn more about this solution and how it can help transform your media production
              and broadcasting needs.
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
