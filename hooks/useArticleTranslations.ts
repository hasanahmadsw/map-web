"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  TAutoTranslateArticleForm,
  TCreateArticleTranslationForm,
  TEditArticleTranslationForm,
} from "@/schemas/articles.schemas";
import { articlesService } from "@/services/articles.service";
import type { ArticleTranslation } from "@/types/articles.types";

const qk = {
  translations: (articleId: number) => ["articles", "translations", articleId] as const,
};

export function useArticleTranslations(articleId: number, enabled = true) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery<ArticleTranslation[]>({
    queryKey: qk.translations(articleId),
    queryFn: () => articlesService.getArticleTranslations(articleId),
    enabled: enabled && !!articleId,
    staleTime: 10_000,
    retry: 1,
  });

  // Helpers to write the cache locally
  const setList = (updater: (old?: ArticleTranslation[]) => ArticleTranslation[] | unknown) => {
    queryClient.setQueryData(qk.translations(articleId), updater);
  };

  // Create
  const createMutation = useMutation({
    mutationFn: (payload: TCreateArticleTranslationForm) =>
      articlesService.createArticleTranslation(articleId, payload),
    onSuccess: (created) => {
      setList((old) => {
        const cur = (old as ArticleTranslation[] | undefined) ?? [];
        return [created, ...cur];
      });
      // for confirmation
      queryClient.invalidateQueries({ queryKey: qk.translations(articleId) });
    },
  });

  // Update
  const updateMutation = useMutation({
    mutationFn: ({ translationId, payload }: { translationId: number; payload: TEditArticleTranslationForm }) =>
      articlesService.updateArticleTranslation(articleId, translationId, payload),
    onSuccess: (updated) => {
      setList((old) => {
        const cur = (old as ArticleTranslation[] | undefined) ?? [];
        return cur.map((t) => (t.id === updated.id ? { ...t, ...updated } : t));
      });
      queryClient.invalidateQueries({ queryKey: qk.translations(articleId) });
    },
  });

  // Delete
  const deleteMutation = useMutation({
    mutationFn: (translationId: number) => articlesService.deleteArticleTranslation(articleId, translationId),
    onSuccess: (_void, translationId) => {
      setList((old) => {
        const cur = (old as ArticleTranslation[] | undefined) ?? [];
        return cur.filter((t) => t.id !== translationId);
      });
      queryClient.invalidateQueries({ queryKey: qk.translations(articleId) });
    },
  });

  // Auto-translate
  const autoTranslateMutation = useMutation({
    mutationFn: (payload: TAutoTranslateArticleForm) => articlesService.autoTranslateArticle(articleId, payload),
    onSuccess: () => {
      // usually the server builds new translations → update from the source
      queryClient.invalidateQueries({ queryKey: qk.translations(articleId) });
    },
  });

  return {
    translations: data ?? [],
    isLoading,
    isError,
    error: (error as Error | undefined)?.message ?? null,
    refetch,

    createTranslation: (payload: TCreateArticleTranslationForm) => createMutation.mutateAsync(payload),
    updateTranslation: (translationId: number, payload: TEditArticleTranslationForm) =>
      updateMutation.mutateAsync({ translationId, payload }),
    deleteTranslation: (translationId: number) => deleteMutation.mutateAsync(translationId),
    autoTranslate: (payload: TAutoTranslateArticleForm) => autoTranslateMutation.mutateAsync(payload),

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isTranslating: autoTranslateMutation.isPending,

    createError: (createMutation.error as Error | undefined)?.message ?? null,
    updateError: (updateMutation.error as Error | undefined)?.message ?? null,
    deleteError: (deleteMutation.error as Error | undefined)?.message ?? null,
    translateError: (autoTranslateMutation.error as Error | undefined)?.message ?? null,
  };
}
