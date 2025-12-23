import { useMemo, useCallback } from "react";
import { useDebouncedValue } from "@/utils/useDebouncedValue";
import {
  useListUrlState,
  type BaseListParams,
  type UrlStateConfig,
} from "./useListUrlState";
import { useListQuery } from "./useListQuery";

export function createListController<P extends BaseListParams, R, TItem>() {
  return function useListController(opts: {
    url: UrlStateConfig<P>;
    query: {
      key: (params: P) => readonly unknown[];
      fetcher: (params: P, opts?: { signal?: AbortSignal }) => Promise<R>;
      select: (res: R) => {
        items: TItem[];
        total: number;
        pagination?: unknown | null;
      };
      staleTime?: number;
      gcTime?: number;
      refetchOnWindowFocus?: boolean;
      refetchOnReconnect?: boolean;
    };
    searchDebounceMs?: number;
    searchKey?: keyof P;
  }) {
    const {
      url,
      query,
      searchDebounceMs = 300,
      searchKey = "search" as keyof P,
    } = opts;
    const { urlState, updateUrlState, clearAll, hasActiveFilters } =
      useListUrlState<P>(url);
    const debouncedSearch = useDebouncedValue(
      urlState[searchKey] as unknown as string,
      searchDebounceMs,
    );

    const queryParams = useMemo(
      () => ({ ...urlState, [searchKey]: debouncedSearch }) as P,
      [urlState, debouncedSearch, searchKey],
    );

    const q = useListQuery<P, R, TItem>(queryParams, query);

    const total = q.data?.total ?? 0;
    const limit = Number(urlState.limit) || 10;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    const setSearch = useCallback(
      (v: string) => updateUrlState({ [searchKey]: v } as Partial<P>),
      [updateUrlState, searchKey],
    );
    const setPage = useCallback(
      (page: number) => updateUrlState({ page } as Partial<P>),
      [updateUrlState],
    );
    const setPageSize = useCallback(
      (size: number) => updateUrlState({ limit: size } as Partial<P>),
      [updateUrlState],
    );
    const setFilter = useCallback(
      <K extends keyof P>(k: K, v: P[K]) =>
        updateUrlState({ [k]: v } as unknown as Partial<P>),
      [updateUrlState],
    );

    return {
      items: q.data?.items ?? [],
      total,
      totalPages,
      error: (q.error as Error) ?? null,
      isPending: q.isPending,
      refetch: q.refetch,

      urlState,
      hasActiveFilters,
      currentPage: Number(urlState.page) || 1,
      pageSize: limit,
      searchTerm: String(urlState[searchKey] ?? ""),

      setSearch,
      setPage,
      setPageSize,
      setFilter,
      clearAll,
    } as const;
  };
}
