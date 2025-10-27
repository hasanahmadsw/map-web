"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  TAutoTranslateStaffDTO,
  TCreateStaffTranslationDTO,
  TUpdateStaffTranslationDTO,
} from "@/schemas/staff.schemas";
import { staffService } from "@/services/staff.service";
import type { StaffTranslation } from "@/types/staff.types";

const qk = {
  translations: (staffId: string | number) => ["staff", "translations", staffId] as const,
};

export function useStaffTranslations(staffId: string | number, enabled = true) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery<StaffTranslation[]>({
    queryKey: qk.translations(staffId),
    queryFn: () => staffService.getStaffTranslations(staffId),
    enabled: enabled && !!staffId,
    staleTime: 10_000,
    retry: 1,
  });

  // Helpers to write the cache locally
  const setList = (updater: (old?: StaffTranslation[]) => StaffTranslation[] | unknown) => {
    queryClient.setQueryData(qk.translations(staffId), updater);
  };

  // Create
  const createMutation = useMutation({
    mutationFn: (payload: TCreateStaffTranslationDTO) => staffService.createStaffTranslation(staffId, payload),
    onSuccess: (created) => {
      setList((old) => {
        const cur = (old as StaffTranslation[] | undefined) ?? [];
        return [created, ...cur];
      });
      // for confirmation
      queryClient.invalidateQueries({ queryKey: qk.translations(staffId) });
    },
  });

  // Update
  const updateMutation = useMutation({
    mutationFn: ({ translationId, payload }: { translationId: number; payload: TUpdateStaffTranslationDTO }) =>
      staffService.updateStaffTranslation(staffId, translationId, payload),
    onSuccess: (updated) => {
      setList((old) => {
        const cur = (old as StaffTranslation[] | undefined) ?? [];
        return cur.map((t) => (t.id === updated.id ? { ...t, ...updated } : t));
      });
      queryClient.invalidateQueries({ queryKey: qk.translations(staffId) });
    },
  });

  // Delete
  const deleteMutation = useMutation({
    mutationFn: (translationId: number) => staffService.deleteStaffTranslation(staffId, translationId),
    onSuccess: (_void, translationId) => {
      setList((old) => {
        const cur = (old as StaffTranslation[] | undefined) ?? [];
        return cur.filter((t) => t.id !== translationId);
      });
      queryClient.invalidateQueries({ queryKey: qk.translations(staffId) });
    },
  });

  // Auto-translate
  const autoTranslateMutation = useMutation({
    mutationFn: (payload: TAutoTranslateStaffDTO) => staffService.autoTranslateStaff(staffId, payload),
    onSuccess: () => {
      // usually the server builds new translations → update from the source
      queryClient.invalidateQueries({ queryKey: qk.translations(staffId) });
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
