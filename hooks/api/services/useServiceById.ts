'use client';

import { useQuery } from '@tanstack/react-query';
import { servicesQueryKeys } from '@/hooks/api/keys';
import { servicesService } from '@/services/services.service';
import type { StaffService } from '@/types/services.types';

export function useServiceById(id: string | number, enabled = true) {
  const { data, isLoading, isError, error, refetch } = useQuery<StaffService>({
    queryKey: servicesQueryKeys.detail(id),
    queryFn: () => servicesService.getById(Number(id)),
    enabled: enabled && !!id,
  });

  return {
    service: data,
    isLoading,
    isError,
    error: (error as Error | undefined)?.message ?? null,
    refetch,
  };
}
