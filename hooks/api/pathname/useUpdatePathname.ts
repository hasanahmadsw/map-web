import { useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

import useExtractPathname from './useExtractPathname';

export function useUpdatePathname(categories: string[]) {
  const router = useRouter();

  const { type, category, brand, searchParams: currentSearchParams } = useExtractPathname(categories);

  const debouncedPush = useDebouncedCallback(
    (slug: string, searchParams: URLSearchParams = currentSearchParams) => {
      if (searchParams.has('page')) searchParams.delete('page');

      router.push(`/rental/${slug}?${searchParams.toString()}`, { scroll: false });
    },
    300,
  );

  const handleChangeType = (newBodyType: string) => {
    const slug = buildSlug(newBodyType, category, brand);

    debouncedPush(slug);
  };

  const handleChangeCategory = (newCategory: string) => {
    const slug = buildSlug(type, newCategory, brand);

    debouncedPush(slug);
  };

  const handleChangeBrand = (newBrand: string) => {
    const slug = buildSlug(type, category, newBrand);

    debouncedPush(slug);
  };

  const handleChangeSearchParams = (
    params: { key: string; value: string } | Array<{ key: string; value: string }>,
  ) => {
    const entries = Array.isArray(params) ? params : [params];

    entries.forEach(({ key, value }) => {
      if (!value) currentSearchParams.delete(key);
      else currentSearchParams.set(key, value);
    });

    debouncedPush('', currentSearchParams);
  };

  return {
    params: {
      type,
      category,
      brand,
      searchParams: currentSearchParams,
    },
    handleChangeType,
    handleChangeCategory,
    handleChangeBrand,
    handleChangeSearchParams,
  };
}

function buildSlug(type?: string, category?: string, brand?: string): string {
  const parts = [type, category, brand].filter(Boolean);

  return parts.join('/');
}
