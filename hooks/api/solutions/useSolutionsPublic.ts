'use client';

import { useQuery } from '@tanstack/react-query';
import { solutionsService } from '@/services/solutions.service';
import type { SolutionResponse, SolutionListParams } from '@/types/solutions.types';
import type { ApiResponse } from '@/types/common.types';

export function useSolutionsPublic(params?: {
  limit?: number;
  isPublished?: boolean;
  isFeatured?: boolean;
  search?: string;
  sort?: SolutionListParams['sort'];
}) {
  const q = useQuery({
    queryKey: ['solutions', 'public', params],
    queryFn: ({ signal }) => solutionsService.getAll(params, { signal }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    select: (res: ApiResponse<SolutionResponse[]>) => ({
      items: res?.data ?? [],
      total: res?.pagination?.total ?? res?.data?.length ?? 0,
    }),
  });

  return {
    solutions: q.data?.items ?? [],
    total: q.data?.total ?? 0,
    error: (q.error as Error) ?? null,
    isPending: q.isPending,
    refetch: q.refetch,
  };
}
