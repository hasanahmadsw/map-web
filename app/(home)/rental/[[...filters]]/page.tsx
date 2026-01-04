import { EquipmentGrid, EquipmentGridSkeleton } from '@/components/website/equipments/equipment-grid';
import { EquipmentFiltersEnhanced } from '@/components/website/equipments/filters/equipment-filters-enhanced';
import { equipmentCategoriesService } from '@/services/equipments/equipment-categories.service';

import { EquipmentParams } from '@/types/equipments/equipment.type';

import { extractPathname } from '@/utils/filters/format-utils';

import { Suspense } from 'react';
import { createEnhancedMetadata } from '@/utils/seo/meta/enhanced-meta';
import { generateSearchResultsMetadata } from '@/utils/seo/meta/equipment-meta/build-equipment-meta';
import FiltersBreadcrumb from '@/components/website/equipments/layout/filters-breadcrumb';
import SearchResultsHeading from '@/components/website/equipments/layout/search-results-heading';
import { equipmentBrandsService } from '@/services/equipments/equipment-brands.service';
import { CTASection } from '@/components/website/common/cta-section';
interface Props {
  params: Promise<{
    filters: string[];
  }>;
  searchParams: Promise<{
    [key: string]: string;
  }>;
}

export async function generateMetadata(props: Props) {
  const { filters = [] } = await props.params;

  const { data: categoriesData } = await equipmentCategoriesService.getAllPublic({ limit: 100 });
  const categories = categoriesData?.map(category => category.slug) || [];

  const { title, description, keywords, pathname } = await generateSearchResultsMetadata(filters, categories);

  const metaData = createEnhancedMetadata({
    title,
    description,
    keywords,
    pathname,
  });

  return metaData;
}

export default async function EquipmentsPage({ params, searchParams }: Props) {
  const { filters = [] } = await params;
  const search = await searchParams;

  const normalizedSearchParams = new URLSearchParams(
    Object.entries(search).filter(([, value]) => typeof value === 'string') as Array<[string, string]>,
  );

  const [{ data: categoriesData }, { data: brandsData }] = await Promise.all([
    equipmentCategoriesService.getAllPublic({ limit: 100 }),
    equipmentBrandsService.getAllPublic({ limit: 100 }),
  ]);

  const categories = categoriesData?.map(category => category.slug) || [];
  const categoriesList = categoriesData || [];
  const brandsList = brandsData || [];

  const { type, category, brand } = extractPathname(filters, categories, normalizedSearchParams);

  const equipmentParams = extractEquipmentParams(search, type, category, brand);

  return (
    <>
      <div className="pt-edge-nav-margin" />

      {/* Filters */}
      <section className="bg-background sticky top-0 z-40 mb-8 border-b py-2 md:py-0">
        <div className="container">
          <EquipmentFiltersEnhanced categories={categoriesList} brands={brandsList} />
        </div>
      </section>

      <section className="relative z-10 container">
        <div className="mb-10 space-y-4">
          {/* Breadcrumb */}
          <FiltersBreadcrumb filters={filters} categories={categories} />

          {/* Search Results Heading */}
          <SearchResultsHeading filters={filters} categories={categories} />
        </div>

        {/* Results */}
        <Suspense key={JSON.stringify(equipmentParams)} fallback={<EquipmentGridSkeleton />}>
          <EquipmentGrid equipmentParams={equipmentParams} filters={filters} categories={categories} />
        </Suspense>
      </section>

      {/* CTA Section */}
      <div className="section-padding container">
        <CTASection
          title="Want to Learn More?"
          description="Explore our services and solutions to discover how we can help transform your media production and broadcasting needs. Get in touch with our team for personalized guidance."
          buttons={[
            { text: 'Contact Us', href: '/contact' },
            { text: 'View Services', href: '/services' },
          ]}
        />
      </div>
    </>
  );
}

function extractEquipmentParams(
  search: Record<string, unknown>,
  type?: string,
  category?: string,
  brand?: string,
  isFeatured?: string,
): EquipmentParams {
  return {
    page: parseInt((search?.page as string) || '1'),
    limit: parseInt((search?.limit as string) || '12'),
    search: search.search as string,
    equipmentType: type,
    category: category,
    brand,
    isFeatured,
  };
}
