"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { settingsService } from "@/services/settings.service";
import type { SettingsWithTranslations, SettingsTranslation } from "@/types/settings.types";
import type { TUpdateSettingsTranslationDTO } from "@/schemas/settings.schemas";

interface UseSettingsTranslationsOptions {
  lang?: string;
  enabled?: boolean;
}

interface UseSettingsTranslationsReturn {
  data: SettingsWithTranslations | undefined;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  
  updateTranslation: (translationId: number, payload: TUpdateSettingsTranslationDTO) => Promise<SettingsWithTranslations>;
  isUpdating: boolean;
  updateError: string | null;
  
  refetch: () => void;
}

export function useSettingsTranslations({ lang, enabled = true }: UseSettingsTranslationsOptions = {}): UseSettingsTranslationsReturn {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["settings-translations", lang],
    queryFn: () => settingsService.getSettingsWithTranslations({ lang }),
    enabled,
    select: (data) => data.data as SettingsWithTranslations,
  });

  const updateMutation = useMutation({
    mutationFn: ({ translationId, payload }: { translationId: number; payload: TUpdateSettingsTranslationDTO }) => 
      settingsService.updateSettingsTranslation(translationId, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(["settings-translations", lang], (old: any) => ({
        ...old,
        data: updated,
      }));
      queryClient.invalidateQueries({ queryKey: ["settings-translations"] });
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });

  return {
    data,
    isLoading,
    isError,
    error: (error as Error | undefined)?.message ?? null,
    
    updateTranslation: (translationId, payload) => updateMutation.mutateAsync({ translationId, payload }),
    isUpdating: updateMutation.isPending,
    updateError: (updateMutation.error as Error | undefined)?.message ?? null,
    
    refetch,
  };
}
