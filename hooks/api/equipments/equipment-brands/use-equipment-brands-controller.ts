'use client';

import { createListController } from '@/hooks/list/createListController';
import { equipmentBrandsQueryKeys } from '@/hooks/keys';
import { equipmentBrandsService } from '@/services/equipments/equipment-brands.service';
import type { EquipmentBrandListParams } from '@/services/equipments/equipment-brands.service';
import type { IEquipmentBrand } from '@/types/equipments/equipment-brand.type';
import type { ApiResponse } from '@/types/common.types';
import { useQuery } from '@tanstack/react-query';

type Resp = ApiResponse<IEquipmentBrand[]>;

type CompatibleBrandListParams = EquipmentBrandListParams & {
  [key: string]: string | number | boolean | undefined;
};

const useGenericList = createListController<CompatibleBrandListParams, Resp, IEquipmentBrand>();

export function useEquipmentBrandsController() {
  const controller = useGenericList({
    url: {
      allowedKeys: ['page', 'limit', 'search', 'isActive', 'orderDirection'],
      defaults: { page: 1, limit: 10, orderDirection: 'DESC' },
      resetPageOn: ['search', 'isActive'],
    },
    query: {
      key: params => equipmentBrandsQueryKeys.list(params),
      fetcher: (params, { signal }: { signal?: AbortSignal } = {}) => {
        const { orderDirection, ...rest } = params;
        return equipmentBrandsService.getAll({ ...rest, orderDirection }, { signal });
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

export function useBrandsForFilter(params?: { limit?: number; isActive?: boolean; search?: string }) {
  const q = useQuery({
    queryKey: [...equipmentBrandsQueryKeys.lists(), 'filter', params],
    queryFn: ({ signal }) => equipmentBrandsService.getAll(params, { signal }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    select: (res: ApiResponse<IEquipmentBrand[]>) => ({
      items: res?.data ?? [],
      total: res?.pagination?.total ?? res?.data?.length ?? 0,
    }),
  });

  return {
    brands: q.data?.items ?? [],
    total: q.data?.total ?? 0,
    error: (q.error as Error) ?? null,
    isPending: q.isPending,
    refetch: q.refetch,
  };
}
