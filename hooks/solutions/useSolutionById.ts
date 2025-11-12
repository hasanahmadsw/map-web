"use client";

import { useQuery } from "@tanstack/react-query";
import { solutionsQueryKeys } from "@/hooks/keys";
import { solutionsService } from "@/services/solutions.service";
import type { StaffSolution } from "@/types/solutions.types";

export function useSolutionById(id: string | number, enabled = true) {
  const { data, isLoading, isError, error, refetch } = useQuery<StaffSolution>({
    queryKey: solutionsQueryKeys.detail(id),
    queryFn: () => solutionsService.getById(Number(id)),
    enabled: enabled && !!id,
  });

  return {
    solution: data,
    isLoading,
    isError,
    error: (error as Error | undefined)?.message ?? null,
    refetch,
  };
}

