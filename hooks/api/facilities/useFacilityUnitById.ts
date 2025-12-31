'use client';

import { useQuery } from '@tanstack/react-query';
import { facilityUnitsQueryKeys } from '@/hooks/api/keys';
import { facilitiesService } from '@/services/facilities.service';
import type { FacilityUnit } from '@/types/facilities/facilities.types';

export function useFacilityUnitById(id: string | number, enabled = true) {
  const { data, isLoading, isError, error, refetch } = useQuery<FacilityUnit>({
    queryKey: facilityUnitsQueryKeys.detail(id),
    queryFn: () => facilitiesService.getUnitById(Number(id)),
    enabled: enabled && !!id,
  });

  return {
    facilityUnit: data,
    isLoading,
    isError,
    error: (error as Error | undefined)?.message ?? null,
    refetch,
  };
}

