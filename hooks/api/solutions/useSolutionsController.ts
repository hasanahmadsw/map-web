'use client';

import { createListController } from '@/hooks/api/list/createListController';
import { solutionsQueryKeys } from '@/hooks/api/keys';
import { solutionsService } from '@/services/solutions.service';
import type { StaffSolution, SolutionResponse, SolutionListParams } from '@/types/solutions.types';
import type { ApiResponse } from '@/types/common.types';
import { useQuery } from '@tanstack/react-query';

type StaffResp = ApiResponse<StaffSolution[]>;

const useStaffList = createListController<SolutionListParams, StaffResp, StaffSolution>();

export function useSolutionsController() {
  const controller = useStaffList({
    url: {
      allowedKeys: ['page', 'limit', 'search', 'isPublished', 'isFeatured', 'sort', 'orderDirection'],
      defaults: { page: 1, limit: 10, orderDirection: 'DESC' },
      resetPageOn: ['search', 'isPublished', 'isFeatured'],
    },
    query: {
      key: params => solutionsQueryKeys.list(params),
      fetcher: (params, { signal }: { signal?: AbortSignal } = {}) => {
        const { orderDirection, ...rest } = params;
        return solutionsService.getAllForStaff({ ...rest, orderDirection }, { signal });
      },
      select: res => ({
        items: res?.data ?? [],
        total: res?.pagination?.total ?? res?.data?.length ?? 0,
        pagination: res?.pagination ?? null,
      }),
    },
    searchDebounceMs: 300,
    searchKey: 'search',
  });

  return controller;
}

export function useSolutionsPublic(params?: {
  limit?: number;
  isPublished?: boolean;
  isFeatured?: boolean;
  search?: string;
  sort?: SolutionListParams['sort'];
}) {
  const q = useQuery({
    queryKey: [...solutionsQueryKeys.lists(), 'public', params],
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
