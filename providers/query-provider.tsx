"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const fiveMinutesStaleTime = 5 * 60 * 1000;
const retry = 1;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: fiveMinutesStaleTime,
      gcTime: fiveMinutesStaleTime,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
    mutations: {
      retry: retry,
    },
  },
});

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default ReactQueryProvider;
