'use client';

import { createListController } from '@/hooks/api/list/createListController';
import { facilitiesQueryKeys } from '@/hooks/api/keys';
import { facilitiesService } from '@/services/facilities.service';
import type { FacilityParams, Facility } from '@/types/facilities/facilities.types';
import type { ApiResponse } from '@/types/common.types';
import { useQuery } from '@tanstack/react-query';

type StaffResp = ApiResponse<Facility[]>;

const useStaffList = createListController<FacilityParams, StaffResp, Facility>();

export function useFacilitiesController() {
  const controller = useStaffList({
    url: {
      allowedKeys: ['page', 'limit', 'search', 'solutionId', 'type', 'isPublished', 'slug', 'orderDirection'],
      defaults: { page: 1, limit: 10, orderDirection: 'DESC' },
      resetPageOn: ['search', 'solutionId', 'type', 'isPublished'],
    },
    query: {
      key: params => facilitiesQueryKeys.list(params),
      fetcher: (params, { signal }: { signal?: AbortSignal } = {}) => {
        return facilitiesService.getAllForStaff(params, { signal });
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

export function useFacilitiesPublic(params?: {
  limit?: number;
  solutionId?: number;
  type?: FacilityParams['type'];
  search?: string;
}) {
  const q = useQuery({
    queryKey: [...facilitiesQueryKeys.lists(), 'public', params],
    queryFn: ({ signal }) => facilitiesService.getAll(params ?? {}, { signal }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    select: (res: ApiResponse<Facility[]>) => ({
      items: res?.data ?? [],
      total: res?.pagination?.total ?? res?.data?.length ?? 0,
    }),
  });

  return {
    facilities: q.data?.items ?? [],
    total: q.data?.total ?? 0,
    error: (q.error as Error) ?? null,
    isPending: q.isPending,
    refetch: q.refetch,
  };
}

