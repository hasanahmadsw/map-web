"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { languagesService } from "@/services/languages.service";
import type { ApiErrorDetail } from "@/types/common.types";
import type { CreateLanguageDTO, Language } from "@/types/language.types";

const qk = {
  list: ["languages"] as const,
  byCode: (code: string) => ["languages", code] as const,
};

// Helpers
function getErrorMessage(err: unknown): string | null {
  if (!err) return null;
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message ?? null;
  try {
    const maybe = err as ApiErrorDetail;
    return maybe?.message ?? null;
  } catch {
    return null;
  }
}

const ONE_HOUR = 60 * 60 * 1000;

// Types
interface UseLanguagesOptions {
  enabled?: boolean;
}

interface UseLanguagesReturn {
  languages: Language[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: string | null;

  createLanguage: (data: CreateLanguageDTO) => Promise<Language>;
  updateLanguage: (code: string, data: Partial<Language>) => Promise<Language>;
  deleteLanguage: (code: string) => Promise<void>;

  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  createError: string | null;
  updateError: string | null;
  deleteError: string | null;

  refetch: () => void;
}

export function useLanguages(options: UseLanguagesOptions = {}): UseLanguagesReturn {
  const { enabled = true } = options;
  const queryClient = useQueryClient();

  const {
    data: languages,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Language[]>({
    queryKey: qk.list,
    queryFn: () => languagesService.getLanguages(),
    enabled,
    staleTime: ONE_HOUR,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Mutation: create (optimistic add + rollback)
  const createMutation = useMutation({
    mutationFn: (data: CreateLanguageDTO) => languagesService.create(data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: qk.list });
      const prev = queryClient.getQueryData<Language[]>(qk.list);

      // Temporary optimistic insertion (based on the code coming from the DTO)
      queryClient.setQueryData<Language[]>(qk.list, (old) => {
        const list = old ?? [];
        const temp: Language = {
          id: Date.now(), // Temporary ID for optimistic update
          code: data.code,
          name: (data as any).name ?? data.code, // In case the DTO does not contain name, make it code
          nativeName: (data as any).nativeName ?? data.code,
          isDefault: (data as any).isDefault ?? false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...(data as any),
        };
        // If it already exists, do not repeat
        const exists = list.some((l) => l.code === temp.code);
        return exists ? list : [temp, ...list];
      });

      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(qk.list, ctx.prev);
    },
    onSuccess: (created) => {
      // Set the final element in the list and in byCode
      queryClient.setQueryData<Language[]>(qk.list, (old) => {
        const list = old ?? [];
        const withoutTemp = list.filter((l) => l.code !== created.code);
        return [created, ...withoutTemp];
      });
      queryClient.setQueryData(qk.byCode(created.code), created);
    },
    onSettled: () => {
      // One invalidation is enough for the server to match
      queryClient.invalidateQueries({ queryKey: qk.list });
    },
  });

  // Mutation: update (optimistic update + rollback + handle code change)
  const updateMutation = useMutation({
    mutationFn: ({ code, data }: { code: string; data: Partial<Language> }) => languagesService.update(code, data),
    onMutate: async ({ code, data }) => {
      await queryClient.cancelQueries({ queryKey: qk.list });
      const prevList = queryClient.getQueryData<Language[]>(qk.list);
      const prevByCode = queryClient.getQueryData<Language>(qk.byCode(code));

      // Temporary update in the list
      queryClient.setQueryData<Language[]>(qk.list, (old) =>
        (old ?? []).map((l) => (l.code === code ? ({ ...l, ...data } as Language) : l)),
      );

      // Temporary update in byCode
      if (prevByCode) {
        queryClient.setQueryData<Language>(qk.byCode(code), {
          ...prevByCode,
          ...data,
        } as Language);
      }

      return { prevList, prevByCode, oldCode: code };
    },
    onError: (_err, _vars, ctx) => {
      // rollback
      if (ctx?.prevList) queryClient.setQueryData(qk.list, ctx.prevList);
      if (ctx?.prevByCode && ctx.oldCode) {
        queryClient.setQueryData(qk.byCode(ctx.oldCode), ctx.prevByCode);
      }
    },
    onSuccess: (updated, _vars, ctx) => {
      // Set the final version in the list
      queryClient.setQueryData<Language[]>(qk.list, (old) =>
        (old ?? []).map((l) => (l.code === (ctx?.oldCode ?? updated.code) ? updated : l)),
      );

      // Set the final version in byCode
      queryClient.setQueryData(qk.byCode(updated.code), updated);

      // If the code changes, move the cache from the old key to the new one
      if (ctx?.oldCode && ctx.oldCode !== updated.code) {
        queryClient.removeQueries({ queryKey: qk.byCode(ctx.oldCode) });
        queryClient.setQueryData(qk.byCode(updated.code), updated);
      }
    },
    onSettled: (_data, _err, vars) => {
      // One invalidation is enough for the server to match
      queryClient.invalidateQueries({ queryKey: qk.list });
      // Refetch the individual element to ensure accuracy
      if (vars?.code) queryClient.invalidateQueries({ queryKey: qk.byCode(vars.code) });
    },
  });

  // Mutation: delete (optimistic removal + rollback)
  const deleteMutation = useMutation({
    mutationFn: (code: string) => languagesService.delete(code),
    onMutate: async (code) => {
      await queryClient.cancelQueries({ queryKey: qk.list });
      const prev = queryClient.getQueryData<Language[]>(qk.list);

      queryClient.setQueryData<Language[]>(qk.list, (old) => (old ?? []).filter((l) => l.code !== code));

      return { prev, code };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(qk.list, ctx.prev);
    },
    onSuccess: (_void, code) => {
      // Clear the cache for byCode
      queryClient.removeQueries({ queryKey: qk.byCode(code) });
    },
    onSettled: (_data, _err, code) => {
      queryClient.invalidateQueries({ queryKey: qk.list });
      if (code) queryClient.invalidateQueries({ queryKey: qk.byCode(code) });
    },
  });

  // API wrappers
  const createLanguage = useCallback((data: CreateLanguageDTO) => createMutation.mutateAsync(data), [createMutation]);

  const updateLanguage = useCallback(
    (code: string, data: Partial<Language>) => updateMutation.mutateAsync({ code, data }),
    [updateMutation],
  );

  const deleteLanguage = useCallback((code: string) => deleteMutation.mutateAsync(code), [deleteMutation]);

  // Unified error message for the list query
  const errorMessage = useMemo(() => getErrorMessage(error), [error]);

  return {
    languages,
    isLoading,
    isError,
    error: errorMessage,

    createLanguage,
    updateLanguage,
    deleteLanguage,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    createError: getErrorMessage(createMutation.error),
    updateError: getErrorMessage(updateMutation.error),
    deleteError: getErrorMessage(deleteMutation.error),

    refetch,
  };
}

// By Code Hook
export function useLanguageByCode(code: string, enabled = true) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery<Language>({
    queryKey: qk.byCode(code),
    queryFn: () => languagesService.getLanguageByCode(code),
    enabled: enabled && !!code,
    staleTime: ONE_HOUR,
    retry: 1,
    refetchOnWindowFocus: false,
    // Improve UX: get initial value from the list if it exists to reduce flickering
    placeholderData: () => {
      const list = queryClient.getQueryData<Language[]>(qk.list);
      return list?.find((l) => l.code === code);
    },
  });

  return {
    language: data,
    isLoading,
    isError,
    error: getErrorMessage(error),
    refetch,
  };
}
