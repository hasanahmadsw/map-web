import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { broadcastsService } from '@/services/broadcasts.service';

import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import { BroadcastType } from '@/types/broadcasts/broadcast.enums';
import type { BroadcastUnit, BroadcastUnitItem } from '@/types/broadcasts/broadcasts.types';
import { CTASection } from '@/components/website/common/cta-section';
import { singleBroadcastSchema } from '@/utils/seo/schema/broadcasts/single-broadcast-schema';
import { getTypeFromSlug } from '@/components/website/broadcasts/data-utils';
import { formatBroadcastType, getTypeSlug } from '@/components/website/broadcasts/unit/unit-utils';
import { UnitHero } from '@/components/website/broadcasts/unit/unit-hero';
import { UnitQuickStats } from '@/components/website/broadcasts/unit/unit-quick-stats';
import { UnitDescription } from '@/components/website/broadcasts/unit/unit-description';
import { UnitGallery } from '@/components/website/broadcasts/unit/unit-gallery';
import { UnitItems } from '@/components/website/broadcasts/unit/unit-items';
import { UnitSpecifications } from '@/components/website/broadcasts/unit/unit-specifications';
import { UnitNavigation } from '@/components/website/broadcasts/unit/unit-navigation';

interface BroadcastUnitPageProps {
  params: Promise<{
    type: string;
    unitSlug: string;
  }>;
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

  const typeSlug = getTypeSlug(unit.type);

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
      section: 'Media Production Broadcast Unit',
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

  const typeSlug = getTypeSlug(unit.type);

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

  const jsonLd = await singleBroadcastSchema(unit);

  return (
    <>
      {/* JSON-LD */}
      <script
        id="broadcast-unit-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <div className="bg-background min-h-screen">
        <UnitHero unit={unit} />

        {/* Main Content */}
        <div className="relative z-10 container mx-auto max-w-7xl px-6 py-10">
          <UnitQuickStats unit={unit} />

          {unit.description && <UnitDescription description={unit.description} />}

          {unit.gallery && unit.gallery.length > 0 && (
            <UnitGallery gallery={unit.gallery} unitTitle={unit.title || ''} unitSlug={unit.slug} />
          )}

          {unit.items && unit.items.length > 0 && <UnitItems groupedItems={groupedItems} />}

          {unit.specs && Object.keys(unit.specs).length > 0 && <UnitSpecifications specs={unit.specs} />}

          <UnitNavigation type={unit.type} />

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
    </>
  );
}
