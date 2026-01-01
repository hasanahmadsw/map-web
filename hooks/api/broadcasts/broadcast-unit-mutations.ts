'use client';

import { useCrudMutations } from '@/hooks/api/mutations/useCrudMutations';
import { broadcastUnitsQueryKeys } from '@/hooks/api/keys';
import { broadcastsService } from '@/services/broadcasts.service';
import type { BroadcastUnit } from '@/types/broadcasts/broadcasts.types';
import type { TCreateBroadcastUnitForm } from '@/validations/broadcasts/create-broadcast-unit.schema';
import type { TUpdateBroadcastUnitForm } from '@/validations/broadcasts/update-broadcast-unit.schema';

export function useBroadcastUnitMutations() {
  return useCrudMutations<BroadcastUnit, TCreateBroadcastUnitForm, Partial<TUpdateBroadcastUnitForm>, number>({
    keys: {
      all: broadcastUnitsQueryKeys.all,
      detail: id => broadcastUnitsQueryKeys.detail(id),
      lists: () => broadcastUnitsQueryKeys.lists(),
    },
    service: {
      create: data => broadcastsService.createUnit(data),
      update: (id, data) => broadcastsService.updateUnit(id, data),
      delete: id => broadcastsService.deleteUnit(id),
    },
    getId: item => item.id,
    optimistic: {
      insertIntoLists: true,
      updateInLists: true,
      removeFromLists: true,
    },
  });
}

