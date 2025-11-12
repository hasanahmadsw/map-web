"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  TAutoTranslateStaffDTO,
  TCreateStaffTranslationDTO,
  TUpdateStaffTranslationDTO,
} from "@/schemas/staff.schemas";
import { staffService } from "@/services/staff.service";
import { staffQueryKeys } from "@/hooks/keys";
import type { StaffTranslation } from "@/types/staff.types";

export function useStaffTranslations(staffId: string | number, enabled = true) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery<StaffTranslation[]>({
    queryKey: staffQueryKeys.detail(staffId).concat(["translations"]),
    queryFn: () => staffService.getStaffTranslations(staffId),
    enabled: enabled && !!staffId,
  });

  // Create
  const createMutation = useMutation({
    mutationFn: (payload: TCreateStaffTranslationDTO) => staffService.createStaffTranslation(staffId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffQueryKeys.detail(staffId).concat(["translations"]) });
    },
  });

  // Update
  const updateMutation = useMutation({
    mutationFn: ({ translationId, payload }: { translationId: number; payload: TUpdateStaffTranslationDTO }) =>
      staffService.updateStaffTranslation(staffId, translationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffQueryKeys.detail(staffId).concat(["translations"]) });
    },
  });

  // Delete
  const deleteMutation = useMutation({
    mutationFn: (translationId: number) => staffService.deleteStaffTranslation(staffId, translationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffQueryKeys.detail(staffId).concat(["translations"]) });
    },
  });

  // Auto-translate
  const autoTranslateMutation = useMutation({
    mutationFn: (payload: TAutoTranslateStaffDTO) => staffService.autoTranslateStaff(staffId, payload),
    onSuccess: () => {
      // usually the server builds new translations → update from the source
      queryClient.invalidateQueries({ queryKey: staffQueryKeys.detail(staffId).concat(["translations"]) });
    },
  });

  return {
    translations: data ?? [],
    isLoading,
    isError,
    error: (error as Error | undefined)?.message ?? null,
    refetch,

    createTranslation: (payload: TCreateStaffTranslationDTO) => createMutation.mutateAsync(payload),
    updateTranslation: (translationId: number, payload: TUpdateStaffTranslationDTO) =>
      updateMutation.mutateAsync({ translationId, payload }),
    deleteTranslation: (translationId: number) => deleteMutation.mutateAsync(translationId),
    autoTranslate: (payload: TAutoTranslateStaffDTO) => autoTranslateMutation.mutateAsync(payload),

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

