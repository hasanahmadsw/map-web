'use client';

import { useQuery } from '@tanstack/react-query';
import { equipmentBrandsQueryKeys } from '@/hooks/keys';
import { equipmentBrandsService } from '@/services/equipments/equipment-brands.service';
import type { IEquipmentBrand } from '@/types/equipments/equipment-brand.type';

export function useEquipmentBrandById(id: string | number, enabled = true) {
  const { data, isLoading, isError, error, refetch } = useQuery<IEquipmentBrand>({
    queryKey: equipmentBrandsQueryKeys.detail(id),
    queryFn: () => equipmentBrandsService.getById(Number(id)),
    enabled: enabled && !!id,
  });

  return {
    brand: data,
    isLoading,
    isError,
    error: (error as Error | undefined)?.message ?? null,
    refetch,
  };
}
