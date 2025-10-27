"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  TAutoTranslateServiceForm,
  TCreateServiceTranslationForm,
  TEditServiceTranslationForm,
} from "@/schemas/services.schemas";
import { servicesService } from "@/services/services.service";
import type { ServiceTranslation } from "@/types/services.types";

const qk = {
  translations: (serviceId: number) => ["services", "translations", serviceId] as const,
};

export function useServiceTranslations(serviceId: number, enabled = true) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery<ServiceTranslation[]>({
    queryKey: qk.translations(serviceId),
    queryFn: () => servicesService.getServiceTranslations(serviceId),
    enabled: enabled && !!serviceId,
    staleTime: 10_000,
    retry: 1,
  });

  // Helpers to write the cache locally
  const setList = (updater: (old?: ServiceTranslation[]) => ServiceTranslation[] | unknown) => {
    queryClient.setQueryData(qk.translations(serviceId), updater);
  };

  // Create
  const createMutation = useMutation({
    mutationFn: (payload: TCreateServiceTranslationForm) =>
      servicesService.createServiceTranslation(serviceId, payload),
    onSuccess: (created) => {
      setList((old) => {
        const cur = (old as ServiceTranslation[] | undefined) ?? [];
        return [created, ...cur];
      });
      // for confirmation
      queryClient.invalidateQueries({ queryKey: qk.translations(serviceId) });
    },
  });

  // Update
  const updateMutation = useMutation({
    mutationFn: ({ translationId, payload }: { translationId: number; payload: TEditServiceTranslationForm }) =>
      servicesService.updateServiceTranslation(serviceId, translationId, payload),
    onSuccess: (updated) => {
      setList((old) => {
        const cur = (old as ServiceTranslation[] | undefined) ?? [];
        return cur.map((t) => (t.id === updated.id ? { ...t, ...updated } : t));
      });
      queryClient.invalidateQueries({ queryKey: qk.translations(serviceId) });
    },
  });

  // Delete
  const deleteMutation = useMutation({
    mutationFn: (translationId: number) => servicesService.deleteServiceTranslation(serviceId, translationId),
    onSuccess: (_void, translationId) => {
      setList((old) => {
        const cur = (old as ServiceTranslation[] | undefined) ?? [];
        return cur.filter((t) => t.id !== translationId);
      });
      queryClient.invalidateQueries({ queryKey: qk.translations(serviceId) });
    },
  });

  // Auto-translate
  const autoTranslateMutation = useMutation({
    mutationFn: (payload: TAutoTranslateServiceForm) => servicesService.autoTranslateService(serviceId, payload),
    onSuccess: () => {
      // usually the server builds new translations → update from the source
      queryClient.invalidateQueries({ queryKey: qk.translations(serviceId) });
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
