"use client";

import { useQuery } from "@tanstack/react-query";
import { staffQueryKeys } from "@/hooks/keys";
import { staffService } from "@/services/staff.service";
import type { Staff } from "@/types/staff.types";

export function useStaffMe(enabled = true) {
  const { data, isLoading, isError, error, refetch } = useQuery<Staff>({
    queryKey: staffQueryKeys.detail("me"),
    queryFn: () => staffService.getById("me"),
    enabled,
  });

  return {
    currentStaff: data,
    isLoading,
    isError,
    error: (error as Error | undefined)?.message ?? null,
    refetch,
  };
}

