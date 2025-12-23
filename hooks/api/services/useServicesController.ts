'use client';

import { createListController } from '@/hooks/api/list/createListController';
import { servicesQueryKeys } from '@/hooks/api/keys';
import { servicesService } from '@/services/services.service';
import type { StaffService, IServiceParams } from '@/types/services.types';
import type { ApiResponse } from '@/types/common.types';

type Resp = ApiResponse<StaffService[]>;

const useGenericList = createListController<IServiceParams, Resp, StaffService>();

export function useServicesController() {
  const controller = useGenericList({
    url: {
      allowedKeys: ['page', 'limit', 'search', 'isPublished', 'isFeatured', 'sort', 'orderDirection'],
      defaults: { page: 1, limit: 10, orderDirection: 'DESC' },
      resetPageOn: ['search', 'isPublished', 'isFeatured'],
    },
    query: {
      key: params => servicesQueryKeys.list(params),
      fetcher: (params, { signal }: { signal?: AbortSignal } = {}) => {
        const { orderDirection, ...rest } = params;
        return servicesService.getAllForStaff({ ...rest, orderDirection }, { signal });
      },
      select: res => ({
        items: res?.data ?? [],
        total: res?.pagination?.total ?? res?.data?.length ?? 0,
        pagination: res?.pagination ?? null,
      }),
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
    searchDebounceMs: 300,
    searchKey: 'search',
  });

  return controller;
}
