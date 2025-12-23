import {
  useQuery,
  keepPreviousData,
  queryOptions,
} from "@tanstack/react-query";

type Fetcher<P, R> = (params: P, opts?: { signal?: AbortSignal }) => Promise<R>;

export function useListQuery<P, R, TItem>(
  params: P,
  cfg: {
    key: (params: P) => readonly unknown[];
    fetcher: Fetcher<P, R>;
    select: (res: R) => {
      items: TItem[];
      total: number;
      pagination?: unknown | null;
    };
    staleTime?: number;
    gcTime?: number;
    refetchOnWindowFocus?: boolean;
    refetchOnReconnect?: boolean;
  },
) {
  const {
    key,
    fetcher,
    select,
    staleTime = 300_000,
    gcTime = 600_000,
    refetchOnWindowFocus = false,
    refetchOnReconnect = false,
  } = cfg;

  return useQuery(
    queryOptions({
      queryKey: key(params),
      queryFn: ({ signal }) => fetcher(params, { signal }),
      select,
      placeholderData: keepPreviousData,
      staleTime,
      gcTime,
      refetchOnWindowFocus,
      refetchOnReconnect,
      retry: 1,
    }),
  );
}
