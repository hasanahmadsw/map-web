import { extractPathname } from '@/utils/filters/format-utils';

import { useParams, useSearchParams } from 'next/navigation';

export interface IParams {
  filters: string[];
}

function useExtractPathname(categories: string[]) {
  const searchParams = useSearchParams();
  const { filters } = useParams() as unknown as IParams;

  return extractPathname(filters, categories, searchParams);
}

export default useExtractPathname;
