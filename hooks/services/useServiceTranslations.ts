"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  TAutoTranslateServiceForm,
  TCreateServiceTranslationForm,
  TEditServiceTranslationForm,
} from "@/schemas/services.schemas";
import { servicesService } from "@/services/services.service";
import { servicesQueryKeys } from "@/hooks/keys";
import type { ServiceTranslation } from "@/types/services.types";

export function useServiceTranslations(serviceId: number, enabled = true) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery<ServiceTranslation[]>({
    queryKey: servicesQueryKeys.detail(serviceId).concat(["translations"]),
    queryFn: () => servicesService.getServiceTranslations(serviceId),
    enabled: enabled && !!serviceId,
  });

  // Create
  const createMutation = useMutation({
    mutationFn: (payload: TCreateServiceTranslationForm) =>
      servicesService.createServiceTranslation(serviceId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: servicesQueryKeys.detail(serviceId).concat(["translations"]) });
    },
  });

  // Update
  const updateMutation = useMutation({
    mutationFn: ({ translationId, payload }: { translationId: number; payload: TEditServiceTranslationForm }) =>
      servicesService.updateServiceTranslation(serviceId, translationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: servicesQueryKeys.detail(serviceId).concat(["translations"]) });
    },
  });

  // Delete
  const deleteMutation = useMutation({
    mutationFn: (translationId: number) => servicesService.deleteServiceTranslation(serviceId, translationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: servicesQueryKeys.detail(serviceId).concat(["translations"]) });
    },
  });

  // Auto-translate
  const autoTranslateMutation = useMutation({
    mutationFn: (payload: TAutoTranslateServiceForm) => servicesService.autoTranslateService(serviceId, payload),
    onSuccess: () => {
      // usually the server builds new translations → update from the source
      queryClient.invalidateQueries({ queryKey: servicesQueryKeys.detail(serviceId).concat(["translations"]) });
    },
  });

  return {
    translations: data ?? [],
    isLoading,
    isError,
    error: (error as Error | undefined)?.message ?? null,
    refetch,

    createTranslation: (payload: TCreateServiceTranslationForm) => createMutation.mutateAsync(payload),
    updateTranslation: (translationId: number, payload: TEditServiceTranslationForm) =>
      updateMutation.mutateAsync({ translationId, payload }),
    deleteTranslation: (translationId: number) => deleteMutation.mutateAsync(translationId),
    autoTranslate: (payload: TAutoTranslateServiceForm) => autoTranslateMutation.mutateAsync(payload),

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
