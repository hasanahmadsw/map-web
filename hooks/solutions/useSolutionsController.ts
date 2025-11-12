"use client";

import { createListController } from "@/hooks/list/createListController";
import { solutionsQueryKeys } from "@/hooks/keys";
import { solutionsService } from "@/services/solutions.service";
import type { StaffSolution, ISolutionParams } from "@/types/solutions.types";
import type { ApiResponse } from "@/types/common.types";

type Resp = ApiResponse<StaffSolution[]>;

const useGenericList = createListController<ISolutionParams, Resp, StaffSolution>();

export function useSolutionsController() {
  const controller = useGenericList({
    url: {
      allowedKeys: ["page", "limit", "search", "isPublished", "isFeatured", "sort", "orderDirection"],
      defaults: { page: 1, limit: 10, orderDirection: "DESC" },
      resetPageOn: ["search", "isPublished", "isFeatured"],
    },
    query: {
      key: (params) => solutionsQueryKeys.list(params),
      fetcher: (params, { signal }: { signal?: AbortSignal } = {}) => {
        const { orderDirection, ...rest } = params;
        return solutionsService.getAllForStaff({ ...rest, orderDirection }, { signal });
      },
      select: (res) => ({
        items: res?.data ?? [],
        total: res?.pagination?.total ?? res?.data?.length ?? 0,
        pagination: res?.pagination ?? null,
      }),
    },
    searchDebounceMs: 300,
    searchKey: "search",
  });

  return controller;
}

