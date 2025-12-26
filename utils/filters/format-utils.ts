import { EquipmentType } from '@/types/equipments/equipment.enum';
import { capitalizeEachWord } from '../format';

export function formatText(text: string) {
  return text
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function extractPathname(
  filters: string[] = [],
  categories: string[] = [],
  currentSearchParams?: URLSearchParams,
) {
  const normalizedFilters = Array.isArray(filters) ? filters.filter(Boolean) : [];
  // =============== Extract filters
  let type = '',
    category = '',
    brand = '';
  const searchParams = new URLSearchParams(currentSearchParams || '');

  // console.log('categories===', categories);
  // console.log('normalizedFilters', normalizedFilters);

  if (normalizedFilters.length === 3) {
    [type, category, brand] = normalizedFilters;
  } else if (normalizedFilters.length < 3) {
    normalizedFilters.forEach(filter => {
      if (categories.includes(filter)) category = filter;
      else if (Object.values(EquipmentType).includes(filter as EquipmentType)) type = filter;
      else brand = filter;
    });
  }

  // =============== Pathname without language
  const pathname = normalizedFilters.reduce((acc, curr) => (curr ? (acc += `/${curr}`) : acc), '');

  const base = pathname.split('/');
  const crumbs =
    base.map((path, index) => ({
      name: capitalizeEachWord(path.replace(/-/g, ' ')),
      url: `${base.slice(0, index + 1).join('/')}`,
    })) || [];

  return {
    type,
    category,
    brand,
    searchParams,
    pathname,
    crumbs,
  };
}

// ============================== Generate breadcrumb label
export function generateBreadcrumbLabel(dict: Record<string, string>, label: string) {
  if (label.includes('-')) {
    const newLabel = label
      .split('-')
      .map(word => dict?.[word] || word)
      .join(' ');
    return newLabel;
  }

  return dict?.[label] || label;
}
