import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { broadcastsService } from '@/services/broadcasts.service';

import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import Image from 'next/image';
import DivHtml from '@/components/shared/div-html';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { BroadcastUnitItemGroup, BroadcastType } from '@/types/broadcasts/broadcast.enums';
import type {
  BroadcastUnit,
  BroadcastUnitItem,
  BroadCastUnitSpecs,
} from '@/types/broadcasts/broadcasts.types';
import type { GalleryItem } from '@/types/common.types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, CheckCircle2, Info, ArrowLeft, Calendar, Users, Settings, Radio } from 'lucide-react';
import { CTASection } from '@/components/website/common/cta-section';

interface BroadcastUnitPageProps {
  params: Promise<{
    type: string;
    unitSlug: string;
  }>;
}

function formatGroup(group: BroadcastUnitItemGroup): string {
  return group.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

function formatBroadcastType(type: BroadcastType | `${BroadcastType}`): string {
  return String(type)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

function getTypeFromSlug(slug: string): BroadcastType | null {
  const typeMap: Record<string, BroadcastType> = {
    obvan: BroadcastType.OBVAN,
    'flight-case': BroadcastType.FLIGHT_CASE,
    sng: BroadcastType.SNG,
    'internet-broadcast': BroadcastType.INTERNET_BROADCAST,
    other: BroadcastType.OTHER,
  };
  return typeMap[slug.toLowerCase()] || null;
}

export async function generateMetadata({ params }: BroadcastUnitPageProps): Promise<Metadata> {
  const { unitSlug } = await params;
  const unit: BroadcastUnit = await broadcastsService.getUnitBySlug(unitSlug);

  if (!unit) {
    notFound();
  }

  const keywords = [
    unit.title || unit.slug,
    'broadcast unit',
    'media production',
    'broadcasting',
    'equipment',
    formatBroadcastType(unit.type),
  ].filter(Boolean);

  const typeSlug = unit.type.toLowerCase().replace(/_/g, '-');

  const metadata = createEnhancedMetadata({
    title: { absolute: `${unit.title || unit.slug} | MAP Media Art Production` },
    description:
      unit.summary ||
      unit.description ||
      `${unit.title || unit.slug} - Professional media production broadcast unit`,
    type: 'article',
    keywords,
    pathname: `/broadcasts/${typeSlug}/${unit.slug}`,
    image: unit.coverImage || undefined,
    mainOverrides: {
      category: 'Media Production Broadcast Unit',
    },
    openGraphOverrides: {
      tags: keywords,
      publishedTime: unit.createdAt,
      modifiedTime: unit.updatedAt,
    },
  });

  return metadata;
}

export default async function BroadcastUnitPage({ params }: BroadcastUnitPageProps) {
  const { type, unitSlug } = await params;

  const unit: BroadcastUnit = await broadcastsService.getUnitBySlug(unitSlug);

  if (!unit) {
    notFound();
  }

  // Verify the type matches
  const expectedType = getTypeFromSlug(type);
  if (expectedType && unit.type !== expectedType) {
    notFound();
  }

  const typeSlug = unit.type.toLowerCase().replace(/_/g, '-');

  // Group items by group if they have one
  const groupedItems: Record<string, BroadcastUnitItem[]> = unit.items.reduce(
    (acc, item) => {
      const group = item.group || 'OTHER';
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(item);
      return acc;
    },
    {} as Record<string, BroadcastUnitItem[]>,
  );

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
                href={`/broadcasts/${typeSlug}`}
                className="text-sm text-white/80 transition-colors hover:text-white"
              >
                {formatBroadcastType(unit.type)}
              </Link>
              <span className="text-white/60">/</span>
              <span className="text-sm text-white">{unit.title || unit.slug}</span>
            </div>

            <Badge variant="default" className="text-sm font-medium">
              {formatBroadcastType(unit.type)}
            </Badge>

            <h1 className="max-w-3xl text-4xl font-semibold text-white md:text-5xl">
              {unit.title || unit.slug}
            </h1>

            {unit.summary && <p className="max-w-2xl text-lg text-white/90 md:text-xl">{unit.summary}</p>}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto max-w-7xl px-6 py-10">
        {/* Quick Stats Section */}
        <section className="mt-8 mb-12">
          <div className="glass-card grid grid-cols-2 gap-4 rounded-xl border p-6 md:grid-cols-4">
            {unit.items && unit.items.length > 0 && (
              <div className="text-center">
                <div className="bg-primary/10 mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full">
                  <Package className="text-primary h-6 w-6" />
                </div>
                <div className="text-foreground mb-1 text-2xl font-bold">{unit.items.length}</div>
                <div className="text-muted-foreground text-xs font-medium">
                  {unit.items.length === 1 ? 'Item' : 'Items'} Included
                </div>
              </div>
            )}
            {unit.specs && Object.keys(unit.specs).length > 0 && (
              <div className="text-center">
                <div className="bg-primary/10 mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full">
                  <Settings className="text-primary h-6 w-6" />
                </div>
                <div className="text-foreground mb-1 text-2xl font-bold">
                  {Object.keys(unit.specs).length}
                </div>
                <div className="text-muted-foreground text-xs font-medium">
                  {Object.keys(unit.specs).length === 1 ? 'Specification' : 'Specifications'}
                </div>
              </div>
            )}
            {unit.gallery && unit.gallery.length > 0 && (
              <div className="text-center">
                <div className="bg-primary/10 mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full">
                  <Info className="text-primary h-6 w-6" />
                </div>
                <div className="text-foreground mb-1 text-2xl font-bold">{unit.gallery.length}</div>
                <div className="text-muted-foreground text-xs font-medium">
                  {unit.gallery.length === 1 ? 'Image' : 'Images'} Available
                </div>
              </div>
            )}
            <div className="text-center">
              <div className="bg-primary/10 mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full">
                <Radio className="text-primary h-6 w-6" />
              </div>
              <div className="text-foreground mb-1 text-2xl font-bold">{formatBroadcastType(unit.type)}</div>
              <div className="text-muted-foreground text-xs font-medium">Broadcast Type</div>
            </div>
          </div>
        </section>

        {/* Description Section */}
        {unit.description && (
          <section className="mb-16">
            <div className="space-y-6">
              <div>
                <h2 className="mb-2 text-3xl font-semibold md:text-4xl">About This Unit</h2>
                <p className="text-muted-foreground text-base md:text-lg">
                  Comprehensive overview of this professional broadcast unit
                </p>
              </div>
              <div className="glass-card rounded-xl border p-8 md:p-10">
                <div className="text-muted-foreground max-w-4xl leading-relaxed">
                  <DivHtml html={unit.description} />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Gallery Section */}
        {unit.gallery && unit.gallery.length > 0 && (
          <section className="mb-16">
            <div className="space-y-6">
              <div>
                <h2 className="mb-2 text-3xl font-semibold md:text-4xl">Gallery</h2>
                <p className="text-muted-foreground text-base md:text-lg">
                  Visual showcase of this broadcast unit
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {unit.gallery
                  .sort((a, b) => a.order - b.order)
                  .map((item: GalleryItem, index) => (
                    <div
                      key={`${item.path}-${item.order}`}
                      className="group relative aspect-video overflow-hidden rounded-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                    >
                      <Image
                        src={item.path}
                        alt={`${unit.title || unit.slug} - Image ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        unoptimized={item.path.includes('supabase.co')}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* Items Section */}
        {unit.items && unit.items.length > 0 && (
          <section className="mb-16">
            <div className="space-y-6">
              <div>
                <h2 className="mb-2 text-3xl font-semibold md:text-4xl">Equipment & Items</h2>
                <p className="text-muted-foreground text-base md:text-lg">
                  Complete list of equipment and items included in this unit
                </p>
              </div>

              <div className="space-y-8">
                {Object.entries(groupedItems).map(([group, items]) => (
                  <div key={group} className="space-y-4">
                    {group !== 'OTHER' && (
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                          <CheckCircle2 className="text-primary h-5 w-5" />
                        </div>
                        <h3 className="text-xl font-semibold md:text-2xl">
                          {formatGroup(group as BroadcastUnitItemGroup)}
                        </h3>
                      </div>
                    )}
                    <div className="glass-card overflow-hidden rounded-xl border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[70%]">Item</TableHead>
                            <TableHead className="w-[30%] text-center">Quantity</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {items.map((item, index) => (
                            <TableRow key={index} className="hover:bg-muted/50 transition-colors">
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <div className="bg-primary/10 h-1.5 w-1.5 shrink-0 rounded-full" />
                                  {item.title}
                                </div>
                                {item.notes && (
                                  <p className="text-muted-foreground mt-1 text-xs">{item.notes}</p>
                                )}
                              </TableCell>
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
          <section className="mb-16">
            <div className="space-y-6">
              <div>
                <h2 className="mb-2 text-3xl font-semibold md:text-4xl">Specifications</h2>
                <p className="text-muted-foreground text-base md:text-lg">
                  Technical specifications and details of this broadcast unit
                </p>
              </div>
              <div className="glass-card overflow-hidden rounded-xl border">
                <div className="divide-y">
                  {(Object.entries(unit.specs) as [keyof BroadCastUnitSpecs, unknown][]).map(
                    ([key, value]) => {
                      const formattedKey = key
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, str => str.toUpperCase())
                        .trim();

                      const formatSpecValue = (val: unknown): string => {
                        if (Array.isArray(val)) {
                          return val.join(', ');
                        }
                        if (typeof val === 'object' && val !== null) {
                          return JSON.stringify(val, null, 2);
                        }
                        return String(val);
                      };

                      const displayValue = formatSpecValue(value);
                      const isArrayValue = Array.isArray(value);

                      return (
                        <div key={key} className="hover:bg-muted/30 p-6 transition-colors md:p-8">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="md:col-span-1">
                              <div className="flex items-center gap-2">
                                <div className="bg-primary/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                                  <Info className="text-primary h-4 w-4" />
                                </div>
                                <p className="text-foreground font-semibold">{formattedKey}</p>
                              </div>
                            </div>
                            <div className="md:col-span-2">
                              {isArrayValue && value.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                  {(value as string[]).map((item, idx) => (
                                    <Badge key={idx} variant="secondary" className="font-normal">
                                      {item}
                                    </Badge>
                                  ))}
                                </div>
                              ) : typeof value === 'object' && value !== null && !isArrayValue ? (
                                <pre className="text-muted-foreground bg-muted/50 rounded-lg p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                                  {displayValue}
                                </pre>
                              ) : (
                                <p className="text-foreground text-sm leading-relaxed md:text-base">
                                  {displayValue}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Navigation Section */}
        <section className="mb-12">
          <Link
            href={`/broadcasts/${typeSlug}`}
            className="group text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            Back to {formatBroadcastType(unit.type)} Units
          </Link>
        </section>

        {/* Call to Action Section */}
        <section className="section-padding">
          <CTASection
            title="Interested in This Unit?"
            description="Contact us to learn more about this broadcast unit and how it can support your media production needs. Our team is ready to provide detailed information and answer any questions."
            buttons={[
              { text: 'Contact Us', href: '/contact' },
              {
                text: `View More ${formatBroadcastType(unit.type)} Units`,
                href: `/broadcasts/${typeSlug}`,
              },
            ]}
          />
        </section>
      </div>
    </div>
  );
}
