'use client';

import { createListController } from '@/hooks/api/list/createListController';
import { intentsQueryKeys } from '@/hooks/api/keys';
import { intentsService, type IntentListParams } from '@/services/intents/intents.service';
import type { IIntentBase } from '@/types/intents/intent.type';
import type { ApiResponse } from '@/types/common.types';

type Resp = ApiResponse<IIntentBase[]>;

const useGenericList = createListController<IntentListParams, Resp, IIntentBase>();

export function useIntentsController() {
  return useGenericList({
    url: {
      allowedKeys: ['page', 'limit', 'search', 'type', 'orderDirection'],
      defaults: { page: 1, limit: 10, orderDirection: 'DESC' },
      resetPageOn: ['search', 'type'],
    },
    query: {
      key: params => intentsQueryKeys.list(params),
      fetcher: (params, { signal }: { signal?: AbortSignal } = {}) => {
        const { orderDirection, ...rest } = params;
        return intentsService.getAll({ ...rest, orderDirection }, { signal });
      },
      select: res => ({
        items: res?.data ?? [],
        total: res?.pagination?.total ?? res?.data?.length ?? 0,
        pagination: res?.pagination ?? null,
      }),
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
    searchDebounceMs: 300,
    searchKey: 'search',
  });
}
