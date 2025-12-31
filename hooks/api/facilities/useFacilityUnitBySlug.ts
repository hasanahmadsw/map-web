'use client';

import { useQuery } from '@tanstack/react-query';
import { facilityUnitsQueryKeys } from '@/hooks/api/keys';
import { facilitiesService } from '@/services/facilities.service';
import type { FacilityUnit } from '@/types/facilities/facilities.types';

export function useFacilityUnitBySlug(slug: string, enabled = true) {
  const { data, isLoading, isError, error, refetch } = useQuery<FacilityUnit>({
    queryKey: facilityUnitsQueryKeys.bySlug(slug),
    queryFn: () => facilitiesService.getUnitBySlug(slug),
    enabled: enabled && !!slug,
  });

  return {
    facilityUnit: data,
    isLoading,
    isError,
    error: (error as Error | undefined)?.message ?? null,
    refetch,
  };
}
