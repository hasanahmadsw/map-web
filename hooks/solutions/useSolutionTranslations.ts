"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { solutionsService } from "@/services/solutions.service";
import type { SolutionTranslation } from "@/types/solutions.types";
import type { TranslationHooks } from "@/types/translations.types";

const qk = {
  translations: (solutionId: number) => ["solutions", "translations", solutionId] as const,
};

export function useSolutionTranslations(solutionId: number): TranslationHooks<SolutionTranslation> {
  const queryClient = useQueryClient();

  const {
    data: translations = [],
    isLoading,
    isError,
    error,
  } = useQuery<SolutionTranslation[]>({
    queryKey: qk.translations(solutionId),
    queryFn: () => solutionsService.getSolutionTranslations(solutionId),
    enabled: !!solutionId,
    retry: 1,
  });

  const createTranslationMutation = useMutation({
    mutationFn: (data: any) => solutionsService.createSolutionTranslation(solutionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.translations(solutionId) });
    },
  });

  const updateTranslationMutation = useMutation({
    mutationFn: ({ translationId, data }: { translationId: number; data: any }) =>
      solutionsService.updateSolutionTranslation(solutionId, translationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.translations(solutionId) });
    },
  });

  const deleteTranslationMutation = useMutation({
    mutationFn: (translationId: number) => solutionsService.deleteSolutionTranslation(solutionId, translationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.translations(solutionId) });
    },
  });

  const autoTranslateMutation = useMutation({
    mutationFn: (data: any) => solutionsService.autoTranslateSolution(solutionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.translations(solutionId) });
    },
  });

  return {
    translations,
    isLoading,
    createTranslation: createTranslationMutation.mutateAsync,
    updateTranslation: (translationId: number, data: any) =>
      updateTranslationMutation.mutateAsync({ translationId, data }),
    deleteTranslation: deleteTranslationMutation.mutateAsync,
    autoTranslate: autoTranslateMutation.mutateAsync,
    isCreating: createTranslationMutation.isPending,
    isUpdating: updateTranslationMutation.isPending,
    isDeleting: deleteTranslationMutation.isPending,
    isTranslating: autoTranslateMutation.isPending,
  };
}