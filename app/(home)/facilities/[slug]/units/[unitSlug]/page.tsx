import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { facilitiesService } from '@/services/facilities.service';

import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import Image from 'next/image';
import DivHtml from '@/components/shared/div-html';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { FacilityUnitItemGroup } from '@/types/facilities/facility.enums';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface FacilityUnitPageProps {
  params: Promise<{
    slug: string;
    unitSlug: string;
  }>;
}

function formatGroup(group: FacilityUnitItemGroup): string {
  return group.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

export async function generateMetadata({ params }: FacilityUnitPageProps): Promise<Metadata> {
  const { unitSlug } = await params;
  const unit = await facilitiesService.getUnitBySlug(unitSlug);

  if (!unit) {
    notFound();
  }

  const keywords = [
    unit.title || unit.slug,
    'facility unit',
    'media production',
    'broadcasting',
    'equipment',
  ].filter(Boolean);

  const metadata = createEnhancedMetadata({
    title: { absolute: unit.title || unit.slug },
    description:
      unit.summary ||
      unit.description ||
      `${unit.title || unit.slug} - Professional media production facility unit`,
    type: 'article',
    keywords,
    pathname: `/facilities/${unit.facilityId}/units/${unit.slug}`,
    image: unit.coverImage || undefined,
    mainOverrides: {
      category: 'Media Production Facility Unit',
    },
    openGraphOverrides: {
      tags: keywords,
      publishedTime: unit.createdAt,
      modifiedTime: unit.updatedAt,
    },
  });

  return metadata;
}

export default async function FacilityUnitPage({ params }: FacilityUnitPageProps) {
  const { slug, unitSlug } = await params;

  const unit = await facilitiesService.getUnitBySlug(unitSlug);

  if (!unit) {
    notFound();
  }

  // Fetch facility to get its slug for navigation
  const facility = await facilitiesService.getById(unit.facilityId);

  // Group items by group if they have one
  const groupedItems =
    unit.items?.reduce(
      (acc, item) => {
        const group = item.group || 'OTHER';
        if (!acc[group]) {
          acc[group] = [];
        }
        acc[group].push(item);
        return acc;
      },
      {} as Record<string, typeof unit.items>,
    ) || {};

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section with Image */}
      <div className="pt-edge-nav-margin relative h-[60vh] w-full overflow-hidden md:h-[70vh]">
        {unit.coverImage ? (
          <>
            <Image
              src={unit.coverImage}
              alt={unit.title || unit.slug}
              fill
              className="object-cover"
              priority
              unoptimized={unit.coverImage.includes('supabase.co')}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/50 to-transparent" />
          </>
        ) : (
          <div className="bg-muted absolute inset-0" />
        )}

        {/* Content Overlay */}
        <div className="relative z-10 container mx-auto flex h-full max-w-7xl flex-col justify-end px-6 py-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Link
                href={`/facilities/${facility.slug}`}
                className="text-sm text-white/80 transition-colors hover:text-white"
              >
                {facility.title || facility.slug}
              </Link>
              <span className="text-white/60">/</span>
              <span className="text-sm text-white">{unit.title || unit.slug}</span>
            </div>

            <h1 className="max-w-3xl text-4xl font-semibold text-white md:text-5xl">
              {unit.title || unit.slug}
            </h1>

            {unit.summary && <p className="max-w-2xl text-lg text-white/90 md:text-xl">{unit.summary}</p>}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto max-w-7xl px-6 py-10">
        {/* Description Section */}
        {unit.description && (
          <section className="container max-w-7xl py-10">
            <div className="space-y-4">
              <h2 className="max-w-2xl text-3xl font-medium">About This Unit</h2>
              <div className="text-muted-foreground max-w-4xl leading-relaxed">
                <DivHtml html={unit.description} />
              </div>
            </div>
          </section>
        )}

        {/* Gallery Section */}
        {unit.gallery && Array.isArray(unit.gallery) && unit.gallery.length > 0 && (
          <section className="container max-w-7xl py-10">
            <div className="space-y-4">
              <h2 className="max-w-2xl text-3xl font-medium">Gallery</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {unit.gallery.map((image: string, index: number) => (
                  <div key={index} className="relative aspect-video overflow-hidden rounded-lg">
                    <Image
                      src={image}
                      alt={`${unit.title || unit.slug} - Image ${index + 1}`}
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

        {/* Items Section */}
        {unit.items && unit.items.length > 0 && (
          <section className="container max-w-7xl py-10">
            <div className="space-y-6">
              <h2 className="max-w-2xl text-3xl font-medium">Equipment & Items</h2>
              <p className="text-muted-foreground max-w-2xl pb-6">
                Complete list of equipment and items included in this unit.
              </p>

              <div className="space-y-8">
                {Object.entries(groupedItems).map(([group, items]) => (
                  <div key={group} className="space-y-4">
                    {group !== 'OTHER' && (
                      <h3 className="text-xl font-semibold">{formatGroup(group as FacilityUnitItemGroup)}</h3>
                    )}
                    <div className="glass-card overflow-hidden rounded-lg border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[70%]">Item</TableHead>
                            <TableHead className="w-[30%] text-center">Quantity</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {items.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{item.title}</TableCell>
                              <TableCell className="text-center">
                                {item.qty ? (
                                  <Badge variant="outline" className="font-normal">
                                    {item.qty}
                                  </Badge>
                                ) : (
                                  <span className="text-muted-foreground text-sm">—</span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Specs Section */}
        {unit.specs && Object.keys(unit.specs).length > 0 && (
          <section className="container max-w-7xl py-10">
            <div className="space-y-4">
              <h2 className="max-w-2xl text-3xl font-medium">Specifications</h2>
              <div className="glass-card overflow-hidden rounded-lg border">
                <div className="divide-y">
                  {Object.entries(unit.specs).map(([key, value], index) => {
                    const formattedKey = key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, str => str.toUpperCase())
                      .trim();
                    const displayValue =
                      typeof value === 'object' && value !== null
                        ? JSON.stringify(value, null, 2)
                        : String(value);

                    return (
                      <div key={key} className="p-4">
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                          <div className="md:col-span-1">
                            <p className="text-muted-foreground text-sm font-medium">{formattedKey}</p>
                          </div>
                          <div className="md:col-span-2">
                            {typeof value === 'object' && value !== null ? (
                              <pre className="text-muted-foreground font-mono text-sm whitespace-pre-wrap">
                                {displayValue}
                              </pre>
                            ) : (
                              <p className="text-sm">{displayValue}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Call to Action Section */}
        <section className="container max-w-7xl py-10">
          <div className="mx-auto max-w-2xl space-y-6 text-center">
            <h2 className="text-3xl font-medium">Interested in This Unit?</h2>
            <p className="text-muted-foreground">
              Contact us to learn more about this facility unit and how it can support your media production
              needs.
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
                href={`/facilities/${facility.slug}`}
              >
                Back to Facility
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
