import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { facilitiesService } from '@/services/facilities.service';

import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import Image from 'next/image';
import DivHtml from '@/components/shared/div-html';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { FacilityUnit } from '@/types/facilities/facilities.types';
import { FacilityType } from '@/types/facilities/facility.enums';

interface FacilityPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function formatFacilityType(type: FacilityType): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

export async function generateMetadata({ params }: FacilityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const facility = await facilitiesService.getBySlug(slug);

  if (!facility) {
    notFound();
  }

  const keywords = [
    facility.title || facility.slug,
    formatFacilityType(facility.type),
    'media production',
    'broadcasting',
    'facilities',
  ].filter(Boolean);

  const metadata = createEnhancedMetadata({
    title: { absolute: facility.title || facility.slug },
    description:
      facility.summary ||
      facility.description ||
      `${facility.title || facility.slug} - Professional media production facility`,
    type: 'article',
    keywords,
    pathname: `/facilities/${facility.slug}`,
    image: facility.coverImage || undefined,
    mainOverrides: {
      category: 'Media Production Facility',
    },
    openGraphOverrides: {
      tags: keywords,
      publishedTime: facility.createdAt,
      modifiedTime: facility.updatedAt,
    },
  });

  return metadata;
}

export default async function FacilityPage({ params }: FacilityPageProps) {
  const { slug } = await params;

  const facility = await facilitiesService.getBySlug(slug);

  if (!facility) {
    notFound();
  }

  // Note: Assuming units come in the same request as mentioned by user
  // If not, we'll need to fetch them separately
  const units = (facility as any).units || [];

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section with Image */}
      <div className="pt-edge-nav-margin relative h-[60vh] w-full overflow-hidden md:h-[70vh]">
        {facility.coverImage ? (
          <>
            <Image
              src={facility.coverImage}
              alt={facility.title || facility.slug}
              fill
              className="object-cover"
              priority
              unoptimized={facility.coverImage.includes('supabase.co')}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-transparent" />
          </>
        ) : (
          <div className="bg-muted absolute inset-0" />
        )}

        {/* Content Overlay */}
        <div className="relative z-10 container mx-auto flex h-full max-w-7xl flex-col justify-end px-6 py-10">
          <div className="space-y-4">
            <Badge variant="default" className="text-sm font-medium">
              {formatFacilityType(facility.type)}
            </Badge>

            <h1 className="max-w-3xl text-4xl font-semibold text-white md:text-5xl">
              {facility.title || facility.slug}
            </h1>

            {facility.summary && (
              <p className="max-w-2xl text-lg text-white/90 md:text-xl">{facility.summary}</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto max-w-7xl px-6 py-10">
        {/* Description Section */}
        {facility.description && (
          <section className="container max-w-7xl py-10">
            <div className="space-y-4">
              <h2 className="max-w-2xl text-3xl font-medium">About This Facility</h2>
              <div className="text-muted-foreground max-w-4xl leading-relaxed">
                <DivHtml html={facility.description} />
              </div>
            </div>
          </section>
        )}

        {/* Gallery Section */}
        {facility.gallery && Array.isArray(facility.gallery) && facility.gallery.length > 0 && (
          <section className="container max-w-7xl py-10">
            <div className="space-y-4">
              <h2 className="max-w-2xl text-3xl font-medium">Gallery</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {facility.gallery.map((image: string, index: number) => (
                  <div key={index} className="relative aspect-video overflow-hidden rounded-lg">
                    <Image
                      src={image}
                      alt={`${facility.title || facility.slug} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized={image.includes('supabase.co')}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Units Section */}
        {units && units.length > 0 && (
          <section className="container max-w-7xl py-10">
            <div className="space-y-4">
              <h2 className="max-w-2xl text-3xl font-medium">Available Units</h2>
              <p className="text-muted-foreground max-w-2xl pb-6">
                Explore the units available in this facility, each equipped with professional-grade equipment
                and configurations.
              </p>

              <div className="space-y-6">
                {units.map((unit: FacilityUnit) => (
                  <div
                    key={unit.id}
                    className="glass-card group overflow-hidden rounded-xl border transition-all hover:shadow-lg"
                  >
                    <Link href={`/facilities/${facility.slug}/units/${unit.slug}`} className="block">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
                        {/* Cover Image */}
                        {unit.coverImage && (
                          <div className="relative aspect-video overflow-hidden rounded-lg md:col-span-1">
                            <Image
                              src={unit.coverImage}
                              alt={unit.title || unit.slug}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              unoptimized={unit.coverImage.includes('supabase.co')}
                            />
                          </div>
                        )}

                        {/* Content */}
                        <div
                          className={`flex flex-col ${unit.coverImage ? 'md:col-span-2 lg:col-span-3' : 'md:col-span-3'}`}
                        >
                          <div className="flex-1 space-y-4 p-6">
                            {/* Title and Summary */}
                            <div className="space-y-2">
                              <h3 className="text-foreground group-hover:text-primary text-2xl font-semibold transition-colors">
                                {unit.title || unit.slug}
                              </h3>
                              {unit.summary && (
                                <div className="text-muted-foreground text-sm leading-relaxed">
                                  <DivHtml html={unit.summary} />
                                </div>
                              )}
                            </div>

                            {/* Specifications */}
                            {unit.specs && Object.keys(unit.specs).length > 0 && (
                              <div className="space-y-3">
                                <h4 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
                                  Main Specifications
                                </h4>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                  {Object.entries(unit.specs)
                                    .slice(0, 6)
                                    .map(([key, value]) => {
                                      const formattedKey = key
                                        .replace(/([A-Z])/g, ' $1')
                                        .replace(/^./, str => str.toUpperCase())
                                        .trim();
                                      const displayValue =
                                        typeof value === 'object' && value !== null
                                          ? JSON.stringify(value)
                                          : String(value);

                                      return (
                                        <div key={key} className="space-y-1">
                                          <p className="text-muted-foreground text-xs font-medium">
                                            {formattedKey}
                                          </p>
                                          <p className="text-sm font-medium">
                                            {typeof value === 'object' && value !== null ? (
                                              <span className="text-muted-foreground font-mono text-xs">
                                                {displayValue.length > 50
                                                  ? `${displayValue.slice(0, 50)}...`
                                                  : displayValue}
                                              </span>
                                            ) : (
                                              displayValue
                                            )}
                                          </p>
                                        </div>
                                      );
                                    })}
                                </div>
                                {Object.keys(unit.specs).length > 6 && (
                                  <p className="text-muted-foreground text-xs italic">
                                    +{Object.keys(unit.specs).length - 6} more specifications
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Items Count */}
                            {unit.items && unit.items.length > 0 && (
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-muted-foreground">
                                  {unit.items.length} {unit.items.length === 1 ? 'item' : 'items'} included
                                </span>
                              </div>
                            )}

                            {/* View Details Link */}
                            <div className="text-primary border-border/50 flex items-center border-t pt-4 text-sm font-medium">
                              <span>View Full Details</span>
                              <svg
                                className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
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
              Contact us to learn more about this facility and how it can support your media production and
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
                href={`/facilities`}
              >
                View All Facilities
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
