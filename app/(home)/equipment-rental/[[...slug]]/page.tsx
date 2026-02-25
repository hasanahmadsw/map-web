import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { intentsService } from '@/services/intents/intents.service';
import { equipmentCategoriesService } from '@/services/equipments/equipment-categories.service';
import { equipmentBrandsService } from '@/services/equipments/equipment-brands.service';
import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import { IntentBreadcrumb } from '@/components/website/intents/intent-breadcrumb';
import { IntentInternalLinks } from '@/components/website/intents/intent-internal-links';
import { IntentFAQ } from '@/components/website/intents/intent-faq';
import { IntentSmartBadges } from '@/components/website/intents/intent-smart-badges';
import { IntentEquipmentFilters } from '@/components/website/intents/intent-equipment-filters';
import { IntentEquipmentGrid } from '@/components/website/intents/intent-equipment-grid';
import { CTASection } from '@/components/website/common/cta-section';
import { Suspense } from 'react';
import { EquipmentGridSkeleton } from '@/components/website/equipments/equipment-grid-skeleton';
import SafeHtmlContent from '@/components/shared/safe-html-content';

interface Props {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ [key: string]: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const slugPart = slug?.[0];
  let intent;
  try {
    intent = slugPart ? await intentsService.getBySlug(slugPart) : await intentsService.getHub();
  } catch {
    return { title: 'Equipment Rental' };
  }
  const keywords = intent.metaKeywords
    ? (typeof intent.metaKeywords === 'string' ? intent.metaKeywords.split(',') : intent.metaKeywords)
    : [];
  return createEnhancedMetadata({
    title: intent.metaTitle || intent.h1 || 'Equipment Rental',
    description: intent.metaDescription || '',
    keywords: Array.isArray(keywords) ? keywords : [],
    pathname: slugPart ? `/equipment-rental/${slugPart}` : '/equipment-rental',
  });
}

export default async function EquipmentRentalIntentPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const search = await searchParams;
  const slugPart = slug?.[0];

  let intent;
  try {
    intent = slugPart ? await intentsService.getBySlug(slugPart) : await intentsService.getHub();
  } catch {
    notFound();
  }

  const searchParamsRecord = Object.fromEntries(
    Object.entries(search).filter(([, v]) => typeof v === 'string') as [string, string][],
  );

  const [{ data: categoriesData }, { data: brandsData }] = await Promise.all([
    equipmentCategoriesService.getAllPublic({ limit: 100 }),
    equipmentBrandsService.getAllPublic({ limit: 100 }),
  ]);
  const categoriesList = categoriesData || [];
  const brandsList = brandsData || [];

  return (
    <>
      <div className="pt-edge-nav-margin" />

      <section className="bg-background sticky top-0 z-40 mb-8 border-b py-2 md:py-0">
        <div className="container">
          <IntentEquipmentFilters categories={categoriesList} brands={brandsList} />
        </div>
      </section>

      <section className="relative z-10 container">
        <div className="mb-10 space-y-4">
          <IntentBreadcrumb breadcrumbs={intent.breadcrumbs} />
          <IntentSmartBadges smartBadges={intent.smartBadges} />
        </div>

        <div className="mb-6">
          {intent.h1 && (
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{intent.h1}</h1>
          )}
          {intent.subHeading && (
            <p className="mt-2 text-sm text-muted-foreground md:text-base">{intent.subHeading}</p>
          )}
        </div>

        <Suspense
          key={JSON.stringify({ ...intent.equipmentFilters, ...searchParamsRecord })}
          fallback={<EquipmentGridSkeleton />}
        >
          <IntentEquipmentGrid
            equipmentFilters={intent.equipmentFilters}
            searchParams={searchParamsRecord}
          />
        </Suspense>

        {intent.content && (
          <div>
            <SafeHtmlContent content={intent.content} className="mt-12 border-t pt-8" size='sm' />
          </div>
        )}

        {intent.internalLinks?.length > 0 && (
          <div className="mt-12 border-t pt-8">
            <h2 className="mb-4 text-lg font-semibold">Related</h2>
            <IntentInternalLinks internalLinks={intent.internalLinks} />
          </div>
        )}

        <IntentFAQ intent={intent} />
      </section>

      <div className="section-padding container">
        <CTASection
          title="Ready to Rent Your Equipment?"
          description="Get in touch with our team to discuss your equipment rental needs. We'll help you find the perfect equipment for your project."
          buttons={[
            { text: 'Contact Us', href: '/contact' },
            { text: 'View Equipment', href: '/equipment-rental' },
          ]}
        />
      </div>
    </>
  );
}
