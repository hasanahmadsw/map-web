import { queryClient } from "@/providers/query-provider";
import { mediaService } from "@/services/media.service";
import { MediaParams } from "@/types/media.types";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

// Query keys
export const mediaKeys = {
  all: ["media"] as const,
  lists: () => [...mediaKeys.all, "list"] as const,
  list: (params: MediaParams) => [...mediaKeys.lists(), params] as const,
  infinite: (params: MediaParams) => [...mediaKeys.all, "infinite", params] as const,
}

// Get media list
export function useMedia(params: MediaParams = { orderDir: 'desc', type: 'all' }) {
  return useQuery({
    queryKey: mediaKeys.list(params),
    queryFn: () => mediaService.getAllMedia(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get media list with infinite scroll
export function useMediaInfinite(params: Omit<MediaParams, 'page'> = { orderDir: 'desc', type: 'all', limit: 24 }) {
  return useInfiniteQuery({
    queryKey: mediaKeys.infinite(params),
    queryFn: ({ pageParam = 1 }) => 
      mediaService.getAllMedia({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.pagination?.currentPage || 1;
      const totalPages = lastPage.pagination?.totalPages || 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Upload media mutation
export function useUploadMedia() {
  return useMutation({
    mutationFn: ({ 
      files, 
      onProgress 
    }: { 
      files: File[]; 
      onProgress?: (progress: number) => void;
    }) => mediaService.uploadMedia(files, onProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() })
      queryClient.invalidateQueries({ queryKey: mediaKeys.all })
    },
  })
}

// Delete media mutation
export function useDeleteMedia() {
  return useMutation({
    mutationFn: (paths: string[]) => mediaService.deleteMedia(paths),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() })
      queryClient.invalidateQueries({ queryKey: mediaKeys.all })
    },
  })
}

