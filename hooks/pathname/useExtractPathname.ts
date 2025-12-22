import { type Lang } from '@/utils/dictionary-utils';
import { extractPathname } from '@/utils/filters/format-utils';

import { useParams, useSearchParams } from 'next/navigation';

export interface IParams {
  lang: Lang;
  filters: string[];
}

function useExtractPathname(categories: string[]) {
  const searchParams = useSearchParams();
  const { lang, filters } = useParams() as unknown as IParams;

  return extractPathname(lang, filters, categories, searchParams);
}

export default useExtractPathname;
