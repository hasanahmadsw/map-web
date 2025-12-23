'use client';

import { createListController } from '@/hooks/api/list/createListController';
import { equipmentCategoriesQueryKeys } from '@/hooks/api/keys';
import { equipmentCategoriesService } from '@/services/equipments/equipment-categories.service';
import type { EquipmentCategoryListParams } from '@/services/equipments/equipment-categories.service';
import type { IEquipmentCategory } from '@/types/equipments/equipment-category.type';
import type { ApiResponse } from '@/types/common.types';
import { useQuery } from '@tanstack/react-query';

type Resp = ApiResponse<IEquipmentCategory[]>;

type CompatibleCategoryListParams = EquipmentCategoryListParams & {
  [key: string]: string | number | boolean | undefined;
};

const useGenericList = createListController<CompatibleCategoryListParams, Resp, IEquipmentCategory>();

export function useEquipmentCategoriesController() {
  const controller = useGenericList({
    url: {
      allowedKeys: ['page', 'limit', 'search', 'type', 'isActive', 'orderDirection'],
      defaults: { page: 1, limit: 10, orderDirection: 'DESC' },
      resetPageOn: ['search', 'type', 'isActive'],
    },
    query: {
      key: params => equipmentCategoriesQueryKeys.list(params),
      fetcher: (params, { signal }: { signal?: AbortSignal } = {}) => {
        const { orderDirection, ...rest } = params;
        return equipmentCategoriesService.getAll({ ...rest, orderDirection }, { signal });
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

export function useCategoriesForFilter(params?: {
  limit?: number;
  type?: EquipmentCategoryListParams['type'];
  isActive?: boolean;
  search?: string;
}) {
  const q = useQuery({
    queryKey: [...equipmentCategoriesQueryKeys.lists(), 'filter', params],
    queryFn: ({ signal }) => equipmentCategoriesService.getAll(params, { signal }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    select: (res: ApiResponse<IEquipmentCategory[]>) => ({
      items: res?.data ?? [],
      total: res?.pagination?.total ?? res?.data?.length ?? 0,
    }),
  });

  return {
    categories: q.data?.items ?? [],
    total: q.data?.total ?? 0,
    error: (q.error as Error) ?? null,
    isPending: q.isPending,
    refetch: q.refetch,
  };
}
