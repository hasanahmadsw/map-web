'use client';

import { useCrudMutations } from '@/hooks/api/mutations/useCrudMutations';
import { intentsQueryKeys } from '@/hooks/api/keys';
import { intentsService } from '@/services/intents/intents.service';
import type { IIntentBase } from '@/types/intents/intent.type';
import type { TCreateIntentForm } from '@/validations/intents/create-intent.schema';
import type { TUpdateIntentForm } from '@/validations/intents/update-intent.schema';

export function useIntentMutations() {
  return useCrudMutations<
    IIntentBase,
    TCreateIntentForm,
    Partial<TUpdateIntentForm>,
    number
  >({
    keys: {
      all: intentsQueryKeys.all,
      detail: id => intentsQueryKeys.detail(id),
      lists: () => intentsQueryKeys.lists(),
    },
    service: {
      create: data => intentsService.create(data),
      update: (id, data) => intentsService.update(id, data),
      delete: id => intentsService.delete(id),
    },
    getId: item => item.id,
    optimistic: {
      insertIntoLists: true,
      updateInLists: true,
      removeFromLists: true,
    },
  });
}
