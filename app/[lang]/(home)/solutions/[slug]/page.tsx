import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { solutionsService } from '@/services/solutions.service';
import { getTranslations, Lang } from '@/utils/dictionary-utils';
import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import Image from 'next/image';
import DivHtml from '@/components/shared/div-html';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ServiceCard } from '@/components/website/home/service-card';
import type { ServiceResponse } from '@/types/services.types';

interface SolutionPageProps {
  params: Promise<{
    slug: string;
    lang: string;
  }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: SolutionPageProps): Promise<Metadata> {
  const { slug, lang } = await params;
  const solution = await solutionsService.getBySlug(slug);

  if (!solution) {
    notFound();
  }

  const t = await getTranslations(lang as Lang);
  const siteURL = process.env.NEXT_PUBLIC_SITE_URL!;

  const keywords = [
    solution.name,
    ...(solution.meta?.keywords || []),
    'media production',
    'broadcasting',
    'solutions',
  ].filter(Boolean);

  const metadata = createEnhancedMetadata({
    lang: lang as Lang,
    title: { absolute: solution.name },
    description:
      solution.shortDescription ||
      solution.meta?.description ||
      `${solution.name} - Professional media production solution`,
    type: 'website',
    keywords,
    pathname: `/solutions/${solution.slug}`,
    image: solution.featuredImage || undefined,
    openGraphOverrides: {
      type: 'website',
      title: solution.name,
      description: solution.shortDescription || solution.meta?.description || '',
      url: `${siteURL}/${lang}/solutions/${solution.slug}`,
      images: solution.featuredImage ? [{ url: solution.featuredImage }] : undefined,
    },
    twitterOverrides: {
      card: 'summary_large_image',
      title: solution.name,
      description: solution.shortDescription || solution.meta?.description || '',
    },
  });

  return metadata;
}

export default async function SolutionPage({ params }: SolutionPageProps) {
  const { slug, lang } = await params;
  const t = await getTranslations(lang as Lang);
  const solution = await solutionsService.getBySlug(slug);

  if (!solution) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section with Image */}
      <div className="relative h-[60vh] w-full overflow-hidden md:h-[70vh]">
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          </>
        ) : (
          <div className="bg-muted absolute inset-0" />
        )}

        {/* Content Overlay */}
        <div className="relative z-10 container mx-auto flex h-full max-w-7xl flex-col justify-end py-10">
          <div className="space-y-4">
            <Link
              href={`/${lang}/solutions`}
              className="glass-button flex w-fit items-center gap-2 rounded-full px-4 py-2 text-white hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Solutions
            </Link>

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
      <div className="bg-background mx-auto max-w-7xl">
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
              <h2 className="max-w-2xl text-3xl font-medium">{t.services?.title || 'Our Services'}</h2>
              <p className="text-muted-foreground max-w-2xl pb-6">
                {t.services?.description ||
                  'Comprehensive services included in this solution to meet your media production and broadcasting needs'}
              </p>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {solution.services.map((service: ServiceResponse) => (
                  <ServiceCard key={service.id} service={service} lang={lang} />
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
                href={`/${lang}/contact`}
              >
                Contact Us
              </Link>
              <Link
                className="glass-button cursor-pointer rounded-full px-8 py-4 text-base font-medium"
                href={`/${lang}/solutions`}
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
