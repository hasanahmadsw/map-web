'use client';

import { createListController } from '@/hooks/api/list/createListController';
import { articlesQueryKeys } from '@/hooks/api/keys';
import { articlesService } from '@/services/articles.service';
import type { Article, ArticleListParams } from '@/types/articles.types';
import type { ApiResponse } from '@/types/common.types';

type Resp = ApiResponse<Article[]>;

const useGenericList = createListController<ArticleListParams, Resp, Article>();

export function useArticlesController() {
  const controller = useGenericList({
    url: {
      allowedKeys: ['page', 'limit', 'search', 'isPublished', 'isFeatured', 'orderDirection'],
      defaults: { page: 1, limit: 10, orderDirection: 'DESC' },
      resetPageOn: ['search', 'isPublished', 'isFeatured'],
    },
    query: {
      key: params => articlesQueryKeys.list(params),
      fetcher: (params, { signal }: { signal?: AbortSignal } = {}) => {
        const { orderDirection, ...rest } = params;
        return articlesService.getAllForStaff({ ...rest, orderDirection }, { signal });
      },
      select: res => ({
        items: res?.data ?? [],
        total: res?.pagination?.total ?? res?.data?.length ?? 0,
        pagination: res?.pagination ?? null,
      }),
    },
    searchDebounceMs: 300,
    searchKey: 'search',
  });

  return controller;
}
