import { queryClient } from '@/providers/query-provider';
import { mediaService } from '@/services/media.service';
import { MediaParams } from '@/types/media.types';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';

export const mediaKeys = {
  all: ['media'] as const,
  lists: () => [...mediaKeys.all, 'list'] as const,
  list: (params: MediaParams) => [...mediaKeys.lists(), params] as const,
  infinite: (params: MediaParams) => [...mediaKeys.all, 'infinite', params] as const,
  tree: (folder?: string) => [...mediaKeys.all, 'tree', folder || ''] as const,
};

// media list (paginated)
export function useMedia(params: MediaParams = { orderDir: 'desc', type: 'all' }) {
  return useQuery({
    queryKey: mediaKeys.list(params),
    queryFn: () => mediaService.getAllMedia(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// tree: folders + files directly in the current folder
export function useMediaTree(folder?: string) {
  return useQuery({
    queryKey: mediaKeys.tree(folder),
    queryFn: () => mediaService.getMediaTree(folder),
    staleTime: 5 * 60 * 1000,
  });
}

// infinite scroll
export function useMediaInfinite(
  params: Omit<MediaParams, 'page'> = { orderDir: 'desc', type: 'all', limit: 24 },
) {
  return useInfiniteQuery({
    queryKey: mediaKeys.infinite(params),
    queryFn: ({ pageParam = 1 }) => mediaService.getAllMedia({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      const currentPage = lastPage.pagination?.currentPage || 1;
      const totalPages = lastPage.pagination?.totalPages || 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// upload media mutation
type UploadMediaArgs = {
  files: File[];
  folder?: string;
};

export function useUploadMedia() {
  return useMutation({
    mutationFn: ({ files, folder }: UploadMediaArgs) => mediaService.uploadMedia(files, folder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });
    },
  });
}

// delete media mutation
export function useDeleteMedia() {
  return useMutation({
    mutationFn: (paths: string[]) => mediaService.deleteMedia(paths),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });
    },
  });
}

export function useCreateFolder() {
  return useMutation({
    mutationFn: (folderPath: string) => mediaService.createFolder(folderPath),
    onSuccess: () => {
      // reload the tree + lists
      queryClient.invalidateQueries({ queryKey: mediaKeys.all });
    },
  });
}
