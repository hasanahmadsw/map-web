import { usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

import useExtractPathname from './useExtractPathname';

export function useUpdatePathname(categories: string[]) {
  const router = useRouter();
  const pathname = usePathname();

  const { lang, type, category, brand, searchParams: currentSearchParams } = useExtractPathname(categories);

  console.log(type, category, brand);

  const debouncedPush = useDebouncedCallback(
    (url: string, searchParams: URLSearchParams = currentSearchParams) => {
      if (searchParams.has('page')) searchParams.delete('page');

      router.push(`${url}?${searchParams.toString()}`, { scroll: false });
    },
    300,
  );

  const handleChangeType = (newBodyType: string) => {
    const slug = buildSlug(type, category, newBodyType);

    debouncedPush(`/${lang}/equipments/${slug}`);
  };

  const handleChangeCategory = (newCategory: string) => {
    const slug = buildSlug(type, newCategory, brand);

    debouncedPush(`/${lang}/equipments/${slug}`);
  };

  const handleChangeBrand = (newBrand: string) => {
    const slug = buildSlug(type, category, newBrand);

    debouncedPush(`/${lang}/equipments/${slug}`);
  };

  const handleChangeSearchParams = (
    params: { key: string; value: string } | Array<{ key: string; value: string }>,
  ) => {
    const entries = Array.isArray(params) ? params : [params];

    entries.forEach(({ key, value }) => {
      if (!value) currentSearchParams.delete(key);
      else currentSearchParams.set(key, value);
    });

    debouncedPush(`${pathname}`, currentSearchParams);
  };

  return {
    params: {
      lang,
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

  console.log(parts);
  return parts.join('/');
}
