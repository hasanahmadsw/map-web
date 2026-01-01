'use client';

import { createListController } from '@/hooks/api/list/createListController';
import { broadcastUnitsQueryKeys } from '@/hooks/api/keys';
import { broadcastsService } from '@/services/broadcasts.service';
import type { BroadcastUnitParams, BroadcastUnit } from '@/types/broadcasts/broadcasts.types';
import type { ApiResponse } from '@/types/common.types';
import { useQuery } from '@tanstack/react-query';

type StaffResp = ApiResponse<BroadcastUnit[]>;

const useStaffList = createListController<BroadcastUnitParams, StaffResp, BroadcastUnit>();

export function useBroadcastUnitsController() {
  const controller = useStaffList({
    url: {
      allowedKeys: ['page', 'limit', 'search', 'broadcastId', 'isPublished', 'type', 'orderDirection'],
      defaults: { page: 1, limit: 10, orderDirection: 'DESC' },
      resetPageOn: ['search', 'broadcastId', 'isPublished', 'type'],
    },
    query: {
      key: params => broadcastUnitsQueryKeys.list(params),
      fetcher: (params, { signal }: { signal?: AbortSignal } = {}) => {
        return broadcastsService.getAllUnits(params, { signal });
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

export function useBroadcastUnitsPublic(params?: { limit?: number; broadcastId?: number; search?: string }) {
  const q = useQuery({
    queryKey: [...broadcastUnitsQueryKeys.lists(), 'public', params],
    queryFn: ({ signal }) => broadcastsService.getAllUnitsPublic(params ?? {}, { signal }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    select: (res: ApiResponse<BroadcastUnit[]>) => ({
      items: res?.data ?? [],
      total: res?.pagination?.total ?? res?.data?.length ?? 0,
    }),
  });

  return {
    broadcastUnits: q.data?.items ?? [],
    total: q.data?.total ?? 0,
    error: (q.error as Error) ?? null,
    isPending: q.isPending,
    refetch: q.refetch,
  };
}
