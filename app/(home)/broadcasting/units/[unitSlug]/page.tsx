import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { broadcastsService } from '@/services/broadcasts.service';
import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';
import type { BroadcastUnit, BroadcastUnitItem } from '@/types/broadcasts/broadcasts.types';
import { singleBroadcastSchema } from '@/utils/seo/schema/broadcasts/single-broadcast-schema';
import { getTypeBroadcastingUrl, getTypeParentLabel } from '@/components/website/broadcasts/unit/unit-utils';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { UnitQuickStats } from '@/components/website/broadcasts/unit/unit-quick-stats';
import { UnitGallery } from '@/components/website/broadcasts/unit/unit-gallery';
import { UnitItems } from '@/components/website/broadcasts/unit/unit-items';
import { UnitSpecifications } from '@/components/website/broadcasts/unit/unit-specifications';
import DivHtml from '@/components/shared/div-html';

interface BroadcastUnitPageProps {
  params: Promise<{ unitSlug: string }>;
}

export async function generateMetadata({ params }: BroadcastUnitPageProps): Promise<Metadata> {
  const { unitSlug } = await params;
  const unit: BroadcastUnit = await broadcastsService.getUnitBySlug(unitSlug);

  if (!unit) {
    return {};
  }

  const keywords = unit.metaKeywords
    ? unit.metaKeywords.split(/[,،]/).map(k => k.trim()).filter(Boolean)
    : [
        unit.title || unit.slug,
        'broadcast unit',
        'media production',
        'broadcasting',
        getTypeParentLabel(unit.type),
      ].filter(Boolean);

  const metadata = createEnhancedMetadata({
    title: unit.metaTitle ? { absolute: unit.metaTitle } : { absolute: `${unit.title || unit.slug} | MAP Media Art Production` },
    description:
      unit.metaDescription ||
      unit.summary ||
      `${unit.title || unit.slug} - Professional media production broadcast unit`,
    type: 'article',
    keywords,
    pathname: `/broadcasting/units/${unit.slug}`,
    image: unit.gallery?.[0]?.path || undefined,
    mainOverrides: {
      category: 'Broadcasting Unit',
    },
    openGraphOverrides: {
      tags: keywords,
      section: 'Broadcasting Unit',
      publishedTime: unit.createdAt,
      modifiedTime: unit.updatedAt,
    },
  });

  return metadata;
}

export default async function BroadcastUnitPage({ params }: BroadcastUnitPageProps) {
  const { unitSlug } = await params;

  const unit: BroadcastUnit = await broadcastsService.getUnitBySlug(unitSlug);

  if (!unit) {
    notFound();
  }

  const parentUrl = getTypeBroadcastingUrl(unit.type);
  const parentLabel = getTypeParentLabel(unit.type);

  const groupedItems: Record<string, BroadcastUnitItem[]> = unit.items.reduce(
    (acc, item) => {
      const group = item.group || 'OTHER';
      if (!acc[group]) acc[group] = [];
      acc[group].push(item);
      return acc;
    },
    {} as Record<string, BroadcastUnitItem[]>,
  );

  const jsonLd = await singleBroadcastSchema(unit);

  return (
    <>
      <script
        id="broadcast-unit-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />

      <div className="bg-background min-h-screen">
        {/* Hero */}
        <section className="pt-edge-nav-margin">
          <div className="container mx-auto max-w-6xl px-6 py-10 md:py-14">
            <Breadcrumb className="mb-5">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/broadcasting">Broadcasting</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={parentUrl}>{parentLabel}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{unit.title || unit.slug}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {unit.title || unit.slug}
            </h1>
            {unit.summary && (
              <div className="text-muted-foreground mt-4 max-w-2xl text-sm md:text-base leading-relaxed">
                <DivHtml html={unit.summary} />
              </div>
            )}
            <UnitQuickStats unit={unit} className="mt-5" />
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/contact?subject=broadcasting">
                  Request This Unit
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link href={parentUrl}>
                  <ArrowLeft className="mr-2 size-4" />
                  Back to {parentLabel}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Main content – two-column layout */}
        <div className="container mx-auto max-w-6xl px-6">
          {/* Left: Main content */}
          <div className="py-6 md:py-10">
            {unit.gallery && unit.gallery.length > 0 && (
              <div className="border-t border-border/60 pt-10">
                <UnitGallery
                  gallery={unit.gallery}
                  unitTitle={unit.title || ''}
                  unitSlug={unit.slug}
                />
              </div>
            )}

            {unit.items && unit.items.length > 0 && (
              <div className="border-t border-border/60 pt-10">
                <UnitItems groupedItems={groupedItems} />
              </div>
            )}

            {unit.specs && Object.keys(unit.specs).length > 0 && (
              <div className="border-t border-border/60 pt-10">
                <UnitSpecifications specs={unit.specs} />
              </div>
            )}
          </div>


          {/* Bottom CTA */}
          <section className="border-t border-border/60 py-14 md:py-16">
            <div className="flex flex-col gap-8 rounded-2xl border border-border/60 bg-muted/20 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-12 md:py-12">
              <div className="max-w-xl space-y-2">
                <h2 className="text-xl font-semibold md:text-2xl">
                  Ready to book {unit.title || unit.slug}?
                </h2>
                <p className="text-muted-foreground text-sm md:text-base">
                  Get in touch for detailed information, availability, and custom configurations tailored to your production.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Button asChild size="lg" className="rounded-full">
                  <Link href="/contact">
                    Contact Us
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full">
                  <Link href={parentUrl}>View More {parentLabel}</Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
