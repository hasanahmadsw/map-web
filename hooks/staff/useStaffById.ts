"use client";

import { useQuery } from "@tanstack/react-query";
import { staffQueryKeys } from "@/hooks/keys";
import { staffService } from "@/services/staff.service";
import type { Staff } from "@/types/staff.types";

export function useStaffById(id: string | number, enabled = true) {
  const { data, isLoading, isError, error, refetch } = useQuery<Staff>({
    queryKey: staffQueryKeys.detail(id),
    queryFn: () => staffService.getById(id),
    enabled: enabled && !!id,
  });

  return {
    staff: data,
    isLoading,
    isError,
    error: (error as Error | undefined)?.message ?? null,
    refetch,
  };
}

