"use client";

import { useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export type BaseListParams = {
  page?: number;
  limit?: number;
  search?: string;
  orderDirection?: "ASC" | "DESC";
  // Add any other filters here:
  [key: string]: string | number | boolean | undefined;
};

export type UrlStateConfig<P extends BaseListParams> = {
  /** Allowed keys in the URL (to avoid weird things) */
  allowedKeys: (keyof P)[];
  /** Default values */
  defaults: Required<Pick<P, "page" | "limit" | "orderDirection">> & Partial<P>;
  /** Reset page to 1 when any of these keys change */
  resetPageOn?: (keyof P)[];
};

export function useListUrlState<P extends BaseListParams>(config: UrlStateConfig<P>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { allowedKeys, defaults, resetPageOn = ["search"] as (keyof P)[] } = config;

  const urlState = useMemo(() => {
    const obj: any = {};
    for (const k of allowedKeys) {
      const v = searchParams.get(String(k));
      if (v == null) continue;
      if (k === "page" || k === "limit" || k === "orderDirection") {
        const n = Number(v);
        if (!Number.isNaN(n) && n > 0) obj[k] = n;
      } else {
        obj[k] = v;
      }
    }
    return {
      ...defaults,
      ...obj,
    } as Required<P>;
  }, [searchParams, allowedKeys, defaults]);

  const updateUrlState = useCallback(
    (updates: Partial<P>) => {
      const next = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (!allowedKeys.includes(key as keyof P)) return;
        if (value === undefined || value === "" || value === null) next.delete(key);
        else next.set(key, String(value));
      });

      // Reset page if any key in resetPageOn changed and page was not explicitly set
      const didChangeFilter = resetPageOn.some((k) => updates[k] !== undefined);
      if (!("page" in updates) && didChangeFilter) {
        next.set("page", "1");
      }

      router.push(`?${next.toString()}`, { scroll: false });
    },
    [searchParams, router, allowedKeys, resetPageOn],
  );

  const clearAll = useCallback(() => {
    const next = new URLSearchParams();
    next.set("page", String(defaults.page));
    next.set("limit", String(defaults.limit));
    next.set("orderDirection", String(defaults.orderDirection));
    router.push(`?${next.toString()}`, { scroll: false });
  }, [router, defaults]);

  const hasActiveFilters = useMemo(() => {
    const baseline = new URLSearchParams();
    baseline.set("page", String(defaults.page));
    baseline.set("limit", String(defaults.limit));
    baseline.set("orderDirection", String(defaults.orderDirection));
    // If there is anything more than the defaults, consider it a filter
    for (const [k, v] of searchParams.entries()) {
      if (k === "page" && v === String(defaults.page)) continue;
      if (k === "limit" && v === String(defaults.limit)) continue;
      if (k === "orderDirection" && v === String(defaults.orderDirection)) continue;
      return true;
    }
    return false;
  }, [searchParams, defaults]);

  return { urlState, updateUrlState, clearAll, hasActiveFilters } as const;
}
