'use client';

import { createListController } from '@/hooks/api/list/createListController';
import { facilityUnitsQueryKeys } from '@/hooks/api/keys';
import { facilitiesService } from '@/services/facilities.service';
import type { FacilityUnitParams, FacilityUnit } from '@/types/facilities/facilities.types';
import type { ApiResponse } from '@/types/common.types';
import { useQuery } from '@tanstack/react-query';

type StaffResp = ApiResponse<FacilityUnit[]>;

const useStaffList = createListController<FacilityUnitParams, StaffResp, FacilityUnit>();

export function useFacilityUnitsController() {
  const controller = useStaffList({
    url: {
      allowedKeys: ['page', 'limit', 'search', 'facilityId', 'isPublished', 'orderDirection'],
      defaults: { page: 1, limit: 10, orderDirection: 'DESC' },
      resetPageOn: ['search', 'facilityId', 'isPublished'],
    },
    query: {
      key: params => facilityUnitsQueryKeys.list(params),
      fetcher: (params, { signal }: { signal?: AbortSignal } = {}) => {
        return facilitiesService.getAllUnits(params, { signal });
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

export function useFacilityUnitsPublic(params?: { limit?: number; facilityId?: number; search?: string }) {
  const q = useQuery({
    queryKey: [...facilityUnitsQueryKeys.lists(), 'public', params],
    queryFn: ({ signal }) => facilitiesService.getAllUnitsPublic(params ?? {}, { signal }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    select: (res: ApiResponse<FacilityUnit[]>) => ({
      items: res?.data ?? [],
      total: res?.pagination?.total ?? res?.data?.length ?? 0,
    }),
  });

  return {
    facilityUnits: q.data?.items ?? [],
    total: q.data?.total ?? 0,
    error: (q.error as Error) ?? null,
    isPending: q.isPending,
    refetch: q.refetch,
  };
}
