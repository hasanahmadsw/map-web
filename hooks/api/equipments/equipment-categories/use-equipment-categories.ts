'use client';

import { useQuery } from '@tanstack/react-query';
import { equipmentCategoriesQueryKeys } from '@/hooks/keys';
import { equipmentCategoriesService } from '@/services/equipments/equipment-categories.service';
import type { IEquipmentCategory } from '@/types/equipments/equipment-category.type';

export function useEquipmentCategoryById(id: string | number, enabled = true) {
  const { data, isLoading, isError, error, refetch } = useQuery<IEquipmentCategory>({
    queryKey: equipmentCategoriesQueryKeys.detail(id),
    queryFn: () => equipmentCategoriesService.getById(Number(id)),
    enabled: enabled && !!id,
  });

  return {
    category: data,
    isLoading,
    isError,
    error: (error as Error | undefined)?.message ?? null,
    refetch,
  };
}
