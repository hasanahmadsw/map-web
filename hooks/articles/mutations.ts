'use client';

import { useCrudMutations } from '@/hooks/mutations/useCrudMutations';
import { articlesQueryKeys } from '@/hooks/keys';
import { articlesService } from '@/services/articles.service';
import type { Article } from '@/types/articles.types';
import type { TCreateArticleForm } from '@/validations/articles/create-article.schema';
import type { TUpdateArticleForm } from '@/validations/articles/update-article.schema';

export function useArticleMutations() {
  return useCrudMutations<Article, TCreateArticleForm, TUpdateArticleForm, number>({
    keys: {
      all: articlesQueryKeys.all,
      detail: id => articlesQueryKeys.detail(id),
      lists: () => articlesQueryKeys.lists(),
    },
    service: {
      create: data => articlesService.create(data),
      update: (id, data) => articlesService.update(id, data),
      delete: id => articlesService.delete(id),
    },
    getId: item => item.id,
    optimistic: {
      insertIntoLists: true,
      updateInLists: true,
      removeFromLists: true,
    },
  });
}
