import { EquipmentGrid, EquipmentGridSkeleton } from '@/components/sections/equipments/equipment-grid';
import { EquipmentFiltersEnhanced } from '@/components/sections/equipments/equipment-filters-enhanced';
import { equipmentCategoriesService } from '@/services/equipments/equipment-categories.service';

import { EquipmentParams } from '@/types/equipments/equipment.type';
import { Lang } from '@/utils/dictionary-utils';

import { extractPathname } from '@/utils/filters/format-utils';

import { Suspense } from 'react';

interface Props {
  params: Promise<{
    lang: Lang;
    filters: string[];
  }>;
  searchParams: Promise<{
    [key: string]: string;
  }>;
}

// export async function generateMetadata(props: Props) {
//   const { lang, filters = [] } = await props.params;

//   const dict = await getDictionary(lang);

//   const { title, description, keywords, pathnameWithoutLang } = await generateSearchResultsMetadata(
//     dict,
//     lang,
//     variant,
//     filters,
//   );

//   const metaData = createMeta({
//     lang,
//     title,
//     description,
//     keywords,
//     pathname: pathnameWithoutLang,
//   });

//   return metaData;
// }

export default async function CarsPage({ params, searchParams }: Props) {
  const { lang, filters = [] } = await params;
  const search = await searchParams;

  const normalizedSearchParams = new URLSearchParams(
    Object.entries(search).filter(([, value]) => typeof value === 'string') as Array<[string, string]>,
  );

  const { data: categoriesData } = await equipmentCategoriesService.getAllPublic({ limit: 100 });
  const categories = categoriesData?.map(category => category.name) || [];
  const categoriesList = categoriesData || [];

  const { type, category, brand } = extractPathname(lang, filters, categories, normalizedSearchParams);

  const equipmentParams = extractEquipmentParams(search, type, category, brand);

  return (
    <>
      {/* Filters */}
      <section className="bg-background sticky top-16 z-50 mb-8 border-b px-6 py-2 md:py-0">
        <div className="container mx-auto">
          <EquipmentFiltersEnhanced lang={lang} categories={categoriesList} />
        </div>
      </section>

      <section className="relative z-10 container mx-auto mb-8 px-6">
        {/* Breadcrumb */}
        {/* <FiltersBreadcrumb lang={lang} variant={variant} filters={filters} /> */}

        {/* Search Results Heading */}
        {/* <SearchResultsHeading lang={lang} variant={variant} filters={filters} /> */}

        {/* Results */}
        <Suspense key={JSON.stringify(search)} fallback={<EquipmentGridSkeleton />}>
          <EquipmentGrid lang={lang} equipmentParams={equipmentParams} />
        </Suspense>
      </section>
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
    q: search.q as string,
    type: type,
    category: category,
    brand,
    isFeatured,
  };
}
