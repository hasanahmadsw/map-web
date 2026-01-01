'use client';

import { useQuery } from '@tanstack/react-query';
import { broadcastUnitsQueryKeys } from '@/hooks/api/keys';
import { broadcastsService } from '@/services/broadcasts.service';
import type { BroadcastUnit } from '@/types/broadcasts/broadcasts.types';

export function useBroadcastUnitById(id: string | number, enabled = true) {
  const { data, isLoading, isError, error, refetch } = useQuery<BroadcastUnit>({
    queryKey: broadcastUnitsQueryKeys.detail(id),
    queryFn: () => broadcastsService.getUnitById(Number(id)),
    enabled: enabled && !!id,
  });

  return {
    broadcastUnit: data,
    isLoading,
    isError,
    error: (error as Error | undefined)?.message ?? null,
    refetch,
  };
}
