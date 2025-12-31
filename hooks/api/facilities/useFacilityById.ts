'use client';

import { useQuery } from '@tanstack/react-query';
import { facilitiesQueryKeys } from '@/hooks/api/keys';
import { facilitiesService } from '@/services/facilities.service';
import type { Facility } from '@/types/facilities/facilities.types';

export function useFacilityById(id: string | number, enabled = true) {
  const { data, isLoading, isError, error, refetch } = useQuery<Facility>({
    queryKey: facilitiesQueryKeys.detail(id),
    queryFn: () => facilitiesService.getById(Number(id)),
    enabled: enabled && !!id,
  });

  return {
    facility: data,
    isLoading,
    isError,
    error: (error as Error | undefined)?.message ?? null,
    refetch,
  };
}
