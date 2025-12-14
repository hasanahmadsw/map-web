"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { settingsService } from "@/services/settings.service";
import type { Settings } from "@/types/settings.types";
import type { TUpdateSettingsDTO } from "@/schemas/settings.schemas";

interface UseSettingsOptions {
  enabled?: boolean;
}

interface UseSettingsReturn {
  data: Settings | undefined;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  
  updateSettings: (payload: TUpdateSettingsDTO) => Promise<Settings>;
  isUpdating: boolean;
  updateError: string | null;
  
  refetch: () => void;
}

export function useSettings({ enabled = true }: UseSettingsOptions = {}): UseSettingsReturn {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["settings"],
    queryFn: () => settingsService.getSettings(),
    enabled,
    select: (data) => data.data as Settings,
  });

  const updateMutation = useMutation({
    mutationFn: ({ payload }: { payload: TUpdateSettingsDTO }) => 
      settingsService.updateSettings(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(["settings"], (old: any) => ({
        ...old,
        data: updated,
      }));
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });

  return {
    data,
    isLoading,
    isError,
    error: (error as Error | undefined)?.message ?? null,
    
    updateSettings: (payload) => updateMutation.mutateAsync({ payload }),
    isUpdating: updateMutation.isPending,
    updateError: (updateMutation.error as Error | undefined)?.message ?? null,
    
    refetch,
  };
}
