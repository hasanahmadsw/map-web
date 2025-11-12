"use client";

import { createListController } from "@/hooks/list/createListController";
import { staffQueryKeys } from "@/hooks/keys";
import { staffService } from "@/services/staff.service";
import type { Staff, IStaffParams } from "@/types/staff.types";
import type { ApiResponse } from "@/types/common.types";

type Resp = ApiResponse<Staff[]>;

const useGenericList = createListController<IStaffParams, Resp, Staff>();

export function useStaffController() {
  const controller = useGenericList({
    url: {
      allowedKeys: ["page", "limit", "search", "role", "orderDirection"],
      defaults: { page: 1, limit: 10, orderDirection: "DESC" },
      resetPageOn: ["search", "role"],
    },
    query: {
      key: (params) => staffQueryKeys.list(params),
      fetcher: (params, { signal }: { signal?: AbortSignal } = {}) => {
        return staffService.getAll({ ...params }, { signal });
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

