"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  TAutoTranslateSolutionForm,
  TCreateSolutionTranslationForm,
  TEditSolutionTranslationForm,
} from "@/schemas/solutions.schemas";
import { solutionsService } from "@/services/solutions.service";
import { solutionsQueryKeys } from "@/hooks/keys";
import type { SolutionTranslation } from "@/types/solutions.types";

export function useSolutionTranslations(solutionId: number, enabled = true) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery<SolutionTranslation[]>({
    queryKey: solutionsQueryKeys.detail(solutionId).concat(["translations"]),
    queryFn: () => solutionsService.getSolutionTranslations(solutionId),
    enabled: enabled && !!solutionId,
  });

  // Create
  const createMutation = useMutation({
    mutationFn: (payload: TCreateSolutionTranslationForm) =>
      solutionsService.createSolutionTranslation(solutionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: solutionsQueryKeys.detail(solutionId).concat(["translations"]) });
    },
  });

  // Update
  const updateMutation = useMutation({
    mutationFn: ({ translationId, payload }: { translationId: number; payload: TEditSolutionTranslationForm }) =>
      solutionsService.updateSolutionTranslation(solutionId, translationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: solutionsQueryKeys.detail(solutionId).concat(["translations"]) });
    },
  });

  // Delete
  const deleteMutation = useMutation({
    mutationFn: (translationId: number) => solutionsService.deleteSolutionTranslation(solutionId, translationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: solutionsQueryKeys.detail(solutionId).concat(["translations"]) });
    },
  });

  // Auto-translate
  const autoTranslateMutation = useMutation({
    mutationFn: (payload: TAutoTranslateSolutionForm) => solutionsService.autoTranslateSolution(solutionId, payload),
    onSuccess: () => {
      // usually the server builds new translations → update from the source
      queryClient.invalidateQueries({ queryKey: solutionsQueryKeys.detail(solutionId).concat(["translations"]) });
    },
  });

  return {
    translations: data ?? [],
    isLoading,
    isError,
    error: (error as Error | undefined)?.message ?? null,
    refetch,

    createTranslation: (payload: TCreateSolutionTranslationForm) => createMutation.mutateAsync(payload),
    updateTranslation: (translationId: number, payload: TEditSolutionTranslationForm) =>
      updateMutation.mutateAsync({ translationId, payload }),
    deleteTranslation: (translationId: number) => deleteMutation.mutateAsync(translationId),
    autoTranslate: (payload: TAutoTranslateSolutionForm) => autoTranslateMutation.mutateAsync(payload),

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