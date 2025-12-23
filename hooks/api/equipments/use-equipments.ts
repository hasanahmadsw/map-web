'use client';

import { useQuery } from '@tanstack/react-query';
import { equipmentsQueryKeys } from '@/hooks/api/keys';
import { equipmentsService } from '@/services/equipments/equipments.service';
import type { IEquipment } from '@/types/equipments/equipment.type';

export function useEquipmentById(id: string | number, enabled = true) {
  const { data, isLoading, isError, error, refetch } = useQuery<IEquipment>({
    queryKey: equipmentsQueryKeys.detail(id),
    queryFn: () => equipmentsService.getById(Number(id)),
    enabled: enabled && !!id,
  });

  return {
    equipment: data,
    isLoading,
    isError,
    error: (error as Error | undefined)?.message ?? null,
    refetch,
  };
}
export function useEquipmentBySlug(slug: string, enabled = true) {
  const { data, isLoading, isError, error, refetch } = useQuery<IEquipment>({
    queryKey: equipmentsQueryKeys.bySlug(slug),
    queryFn: () => equipmentsService.getBySlug(slug),
    enabled: enabled && !!slug,
  });

  return {
    equipment: data,
    isLoading,
    isError,
    error: (error as Error | undefined)?.message ?? null,
    refetch,
  };
}
