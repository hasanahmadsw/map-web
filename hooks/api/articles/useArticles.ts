'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { articlesService } from '@/services/articles.service';
import type { Article } from '@/types/articles.types';
import type { ApiResponse } from '@/types/common.types';
import { TCreateArticleForm } from '@/validations/articles/create-article.schema';
import { TUpdateArticleForm } from '@/validations/articles/update-article.schema';

const qk = {
  list: (page: number, limit: number) => ['articles', 'staff', { page, limit }] as const,
  byId: (id: number) => ['articles', 'staff', id] as const,
};

type StaffArticlesPage = ApiResponse<Article[]>;

const sameId = (a: string | number, b: string | number) => String(a) === String(b);

interface UseArticlesStaffOptions {
  page?: number;
  limit?: number;
  enabled?: boolean;
}

interface UseArticlesStaffReturn {
  articles: Article[];
  pagination: StaffArticlesPage['pagination'];
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;

  isLoading: boolean;
  isError: boolean;
  error: string | null;

  getById: (id: number) => Promise<Article>;
  createArticle: (payload: TCreateArticleForm) => Promise<Article>;
  updateArticle: (id: number, payload: Partial<TUpdateArticleForm>) => Promise<Article>;
  deleteArticle: (id: number) => Promise<void>;

  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  createError: string | null;
  updateError: string | null;
  deleteError: string | null;

  refetch: () => void;
}

export function useArticlesStaff(options: UseArticlesStaffOptions = {}): UseArticlesStaffReturn {
  const { page = 1, limit = 10, enabled = true } = options;
  const [currentPage, setCurrentPage] = useState(page);
  const queryClient = useQueryClient();

  const {
    data: pageData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<StaffArticlesPage>({
    queryKey: qk.list(currentPage, limit),
    queryFn: () => articlesService.getAllForStaff({ page: currentPage, limit }),
    enabled,
    placeholderData: previousData => previousData,
    staleTime: 10_000,
    gcTime: 5 * 60_000,
    retry: 1,
  });

  const writeList = (updater: (old?: StaffArticlesPage) => StaffArticlesPage | unknown) => {
    queryClient.setQueriesData({ queryKey: ['articles', 'staff'] }, updater);
  };

  const upsertItemInCaches = (item: Article) => {
    writeList(old => {
      const cur = old as StaffArticlesPage | undefined;
      if (!cur?.data) return old;
      const idx = cur.data.findIndex(t => sameId(t.id, item.id));
      const newData =
        idx === -1 ? [item, ...cur.data] : cur.data.map((t, i) => (i === idx ? { ...t, ...item } : t));
      return { ...cur, data: newData };
    });
    queryClient.setQueryData(qk.byId(item.id), item);
  };

  const removeItemFromCaches = (id: number) => {
    writeList(old => {
      const cur = old as StaffArticlesPage | undefined;
      if (!cur?.data) return old;
      const newData = cur.data.filter(t => !sameId(t.id, id));
      return {
        ...cur,
        data: newData,
        pagination: cur.pagination
          ? {
              ...cur.pagination,
              total: Math.max(0, (cur.pagination.total ?? newData.length) - 1),
            }
          : undefined,
      };
    });
    queryClient.removeQueries({ queryKey: qk.byId(id) });
  };

  // CRUD mutations
  const createMutation = useMutation({
    mutationFn: (payload: TCreateArticleForm) => articlesService.create(payload),
    onSuccess: created => {
      upsertItemInCaches(created);
      queryClient.invalidateQueries({ queryKey: ['articles', 'staff'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<TUpdateArticleForm> }) =>
      articlesService.update(id, payload),
    onSuccess: updated => {
      upsertItemInCaches(updated);
      queryClient.invalidateQueries({ queryKey: ['articles', 'staff'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => articlesService.delete(id),
    onSuccess: (_void, id) => {
      removeItemFromCaches(id);
      queryClient.invalidateQueries({ queryKey: ['articles', 'staff'] });
    },
  });

  const hasNextPage = !!pageData?.pagination?.hasNextPage;
  const hasPrevPage = !!pageData?.pagination?.hasPrevPage;
  const totalPages = pageData?.pagination?.totalPages ?? 0;

  // Ensure articles is always an array
  const articlesData = pageData?.data;
  const articles = Array.isArray(articlesData) ? articlesData : [];

  return {
    articles,
    pagination: pageData?.pagination,
    totalPages,
    hasNextPage,
    hasPrevPage,
    setPage: setCurrentPage,
    nextPage: () => hasNextPage && setCurrentPage(p => p + 1),
    prevPage: () => hasPrevPage && setCurrentPage(p => Math.max(1, p - 1)),

    isLoading,
    isError,
    error: (error as Error | undefined)?.message ?? null,

    getById: id => articlesService.getById(id),
    createArticle: payload => createMutation.mutateAsync(payload),
    updateArticle: (id, payload) => updateMutation.mutateAsync({ id, payload }),
    deleteArticle: id => deleteMutation.mutateAsync(id),

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    createError: (createMutation.error as Error | undefined)?.message ?? null,
    updateError: (updateMutation.error as Error | undefined)?.message ?? null,
    deleteError: (deleteMutation.error as Error | undefined)?.message ?? null,

    refetch,
  };
}
export function useArticleStaffById(id: number, enabled = true) {
  const { data, isLoading, isError, error, refetch } = useQuery<Article>({
    queryKey: qk.byId(id),
    queryFn: () => articlesService.getById(id),
    enabled: enabled && !!id,
    retry: 1,
  });
  return { data, isLoading, isError, error, refetch };
}
