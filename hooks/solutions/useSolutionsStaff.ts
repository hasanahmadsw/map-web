"use client";

import { useQuery } from "@tanstack/react-query";
import { solutionsQueryKeys } from "@/hooks/keys";
import { solutionsService } from "@/services/solutions.service";
import type { StaffSolution } from "@/types/solutions.types";
import type { ApiResponse } from "@/types/common.types";

interface UseSolutionsStaffOptions {
  page?: number;
  limit?: number;
  lang?: string;
  search?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  sort?: "createdAt" | "updatedAt" | "name" | "order";
  orderDirection?: "ASC" | "DESC";
  enabled?: boolean;
}

type StaffSolutionsPage = ApiResponse<StaffSolution[]>;

export function useSolutionsStaff(options: UseSolutionsStaffOptions = {}) {
  const {
    page = 1,
    limit = 10,
    lang,
    search,
    isPublished,
    isFeatured,
    sort,
    orderDirection,
    enabled = true,
  } = options;

  const { data, isLoading, isError, error, refetch } = useQuery<StaffSolutionsPage>({
    queryKey: solutionsQueryKeys.list({ page, limit, lang, search, isPublished, isFeatured, sort, orderDirection }),
    queryFn: () => {
      if (lang) {
        return solutionsService.getSolutionsByLanguage(lang);
      }
      return solutionsService.getAllForStaff({
        page,
        limit,
        search,
        isPublished,
        isFeatured,
        sort,
        orderDirection,
      });
    },
    enabled,
  });

  const solutionsData = data?.data;
  const solutions = Array.isArray(solutionsData) ? solutionsData : [];

  return {
    solutions,
    pagination: data?.pagination,
    totalPages: data?.pagination?.totalPages ?? 0,
    hasNextPage: !!data?.pagination?.hasNextPage,
    hasPrevPage: !!data?.pagination?.hasPrevPage,
    isLoading,
    isError,
    error: (error as Error | undefined)?.message ?? null,
    refetch,
  };
}

