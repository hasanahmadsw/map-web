import { extractPathname } from '@/utils/filters/format-utils';
import { getStrategyKey, metadataStrategies } from './data';
import { capitalizeEachWord } from '@/utils/format';

// ============================== Generate Search Results Metadata
export async function generateSearchResultsMetadata(filters: string[], categories: string[]) {
  // =============== Extract filters
  const { type, category, brand, pathname, crumbs } = extractPathname(filters, categories);

  // =============== Generate title and description
  const { title, description } = generateEquipmentPageTitleAndDescription({ type, category, brand });

  return {
    title,
    description,
    keywords: [...pathname.split('/').filter(Boolean)],
    pathname,
    crumbs,
  };
}

// ============================== Generate title and description
export function generateEquipmentPageTitleAndDescription({
  type,
  category,
  brand,
}: {
  type: string;
  category: string;
  brand: string;
}) {
  const key = getStrategyKey(!!type, !!category, !!brand);

  const strategy = metadataStrategies[key];
  const typeText = type ? capitalizeEachWord(type.replace(/-/g, ' ')) : '';
  const categoryText = category ? capitalizeEachWord(category.replace(/-/g, ' ')) : '';
  const brandText = brand ? capitalizeEachWord(brand.replace(/-/g, ' ')) : '';

  return {
    title: strategy.title(typeText, categoryText, brandText),
    description: strategy.description(typeText, categoryText, brandText),
  };
}
