"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { TCreateArticleForm, TEditArticleForm } from "@/schemas/articles.schemas";
import { articlesService } from "@/services/articles.service";
import type { ArticleStaffResponse } from "@/types/articles.types";
import type { PaginatedResponse } from "@/types/common.types";

const qk = {
  list: (page: number, limit: number, lang?: string) => ["articles", "staff", { page, limit, lang }] as const,
  byId: (id: number) => ["articles", "staff", id] as const,
};

type StaffArticlesPage = PaginatedResponse<ArticleStaffResponse>;

const sameId = (a: string | number, b: string | number) => String(a) === String(b);

interface UseArticlesStaffOptions {
  page?: number;
  limit?: number;
  lang?: string; // if you use /articles/staff/language/:lang
  enabled?: boolean;
}

interface UseArticlesStaffReturn {
  articles: ArticleStaffResponse[];
  pagination: StaffArticlesPage["pagination"] | undefined;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;

  isLoading: boolean;
  isError: boolean;
  error: string | null;

  getById: (id: number) => Promise<ArticleStaffResponse>;
  createArticle: (payload: TCreateArticleForm) => Promise<ArticleStaffResponse>;
  updateArticle: (id: number, payload: TEditArticleForm) => Promise<ArticleStaffResponse>;
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
  const { page = 1, limit = 10, lang, enabled = true } = options;
  const [currentPage, setCurrentPage] = useState(page);
  const queryClient = useQueryClient();

  const fetchList = () =>
    lang ? articlesService.getArticlesByLanguage(lang) : articlesService.getAllForStaff({ page: currentPage, limit });

  const {
    data: pageData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<StaffArticlesPage>({
    queryKey: qk.list(currentPage, limit, lang),
    queryFn: fetchList,
    enabled,
    placeholderData: (previousData) => previousData,
    staleTime: 10_000,
    gcTime: 5 * 60_000,
    retry: 1,
  });

  const writeList = (updater: (old?: StaffArticlesPage) => StaffArticlesPage | unknown) => {
    queryClient.setQueriesData({ queryKey: ["articles", "staff"] }, updater);
  };

  const upsertItemInCaches = (item: ArticleStaffResponse) => {
    writeList((old) => {
      const cur = old as StaffArticlesPage | undefined;
      if (!cur?.data) return old;
      const idx = cur.data.findIndex((t) => sameId(t.id, item.id));
      const newData = idx === -1 ? [item, ...cur.data] : cur.data.map((t, i) => (i === idx ? { ...t, ...item } : t));
      return { ...cur, data: newData, meta: cur.meta };
    });
    queryClient.setQueryData(qk.byId(item.id), item);
  };

  const removeItemFromCaches = (id: number) => {
    writeList((old) => {
      const cur = old as StaffArticlesPage | undefined;
      if (!cur?.data) return old;
      const newData = cur.data.filter((t) => !sameId(t.id, id));
      return {
        ...cur,
        data: newData,
        pagination: {
          ...cur.pagination,
          total: Math.max(0, (cur.pagination?.total ?? newData.length) - 1),
        },
        meta: cur.meta,
      };
    });
    queryClient.removeQueries({ queryKey: qk.byId(id) });
  };

  // CRUD mutations
  const createMutation = useMutation({
    mutationFn: (payload: TCreateArticleForm) => articlesService.create(payload),
    onSuccess: (created) => {
      upsertItemInCaches(created);
      queryClient.invalidateQueries({ queryKey: ["articles", "staff"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: TEditArticleForm }) => articlesService.update(id, payload),
    onSuccess: (updated) => {
      upsertItemInCaches(updated);
      queryClient.invalidateQueries({ queryKey: ["articles", "staff"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => articlesService.delete(id),
    onSuccess: (_void, id) => {
      removeItemFromCaches(id);
      queryClient.invalidateQueries({ queryKey: ["articles", "staff"] });
    },
  });

  const hasNextPage = !!pageData?.pagination?.hasNextPage;
  const hasPrevPage = !!pageData?.pagination?.hasPrevPage;
  const totalPages = pageData?.pagination?.totalPages ?? 0;

  return {
    articles: pageData?.data ?? [],
    pagination: pageData?.pagination,
    totalPages,
    hasNextPage,
    hasPrevPage,
    setPage: setCurrentPage,
    nextPage: () => hasNextPage && setCurrentPage((p) => p + 1),
    prevPage: () => hasPrevPage && setCurrentPage((p) => Math.max(1, p - 1)),

    isLoading,
    isError,
    error: (error as Error | undefined)?.message ?? null,

    getById: (id) => articlesService.getById(id),
    createArticle: (payload) => createMutation.mutateAsync(payload),
    updateArticle: (id, payload) => updateMutation.mutateAsync({ id, payload }),
    deleteArticle: (id) => deleteMutation.mutateAsync(id),

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
  const { data, isLoading, isError, error, refetch } = useQuery<ArticleStaffResponse>({
    queryKey: qk.byId(id),
    queryFn: () => articlesService.getById(id),
    enabled: enabled && !!id,
    retry: 1,
  });
  return { data, isLoading, isError, error, refetch };
}
