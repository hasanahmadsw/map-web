'use client';

import { createListController } from '@/hooks/list/createListController';
import { equipmentsQueryKeys } from '@/hooks/keys';
import { equipmentsService } from '@/services/equipments/equipments.service';
import type { EquipmentListParams } from '@/services/equipments/equipments.service';
import type { IEquipment } from '@/types/equipments/equipment.type';
import type { ApiResponse } from '@/types/common.types';

type Resp = ApiResponse<IEquipment[]>;

const useGenericList = createListController<EquipmentListParams, Resp, IEquipment>();

export function useEquipmentsController() {
  const controller = useGenericList({
    url: {
      allowedKeys: [
        'page',
        'limit',
        'search',
        'categoryId',
        'brandId',
        'equipmentType',
        'isPublished',
        'isFeatured',
        'orderDirection',
      ],
      defaults: { page: 1, limit: 10, orderDirection: 'DESC' },
      resetPageOn: ['search', 'categoryId', 'brandId', 'equipmentType', 'isPublished', 'isFeatured'],
    },
    query: {
      key: params => equipmentsQueryKeys.list(params),
      fetcher: (params, { signal }: { signal?: AbortSignal } = {}) => {
        const { orderDirection, ...rest } = params;
        return equipmentsService.getAll({ ...rest, orderDirection }, { signal });
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
