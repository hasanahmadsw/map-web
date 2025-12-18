'use client';

import { createListController } from '@/hooks/list/createListController';
import { equipmentCategoriesQueryKeys } from '@/hooks/keys';
import { equipmentCategoriesService } from '@/services/equipments/equipment-categories.service';
import type { EquipmentCategoryListParams } from '@/services/equipments/equipment-categories.service';
import type { IEquipmentCategory } from '@/types/equipments/equipment-category.type';
import type { ApiResponse } from '@/types/common.types';

type Resp = ApiResponse<IEquipmentCategory[]>;

const useGenericList = createListController<EquipmentCategoryListParams, Resp, IEquipmentCategory>();

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
