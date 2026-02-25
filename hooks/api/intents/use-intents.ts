'use client';

import { useQuery } from '@tanstack/react-query';
import { intentsQueryKeys } from '@/hooks/api/keys';
import { intentsService } from '@/services/intents/intents.service';
import type { IIntentBase } from '@/types/intents/intent.type';

export function useIntentById(id: string | number, enabled = true) {
  const { data, isLoading, isError, error, refetch } = useQuery<IIntentBase>({
    queryKey: intentsQueryKeys.detail(id),
    queryFn: () => intentsService.getById(Number(id)),
    enabled: enabled && !!id,
  });

  return {
    intent: data,
    isLoading,
    isError,
    error: (error as Error | undefined)?.message ?? null,
    refetch,
  };
}

export function useIntentsForSelect() {
  const { data, isLoading, isError } = useQuery({
    queryKey: [...intentsQueryKeys.lists(), 'select'],
    queryFn: () => intentsService.getAll({ limit: 100, page: 1 }),
    staleTime: 5 * 60 * 1000,
  });

  // Backend returns { data: Intent[], pagination, meta } via TransformInterceptor
  const raw = data as { data?: IIntentBase[]; pagination?: { total?: number } } | undefined;
  let items: IIntentBase[] = [];
  if (Array.isArray(raw?.data)) {
    items = raw.data;
  } else if (Array.isArray(data)) {
    items = data as IIntentBase[];
  }
  return {
    intents: items,
    isLoading,
    isError,
  };
}
