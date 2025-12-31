'use client';

import { useCrudMutations } from '@/hooks/api/mutations/useCrudMutations';
import { facilitiesQueryKeys } from '@/hooks/api/keys';
import { facilitiesService } from '@/services/facilities.service';
import type { Facility } from '@/types/facilities/facilities.types';
import type { TCreateFacilityForm } from '@/validations/facilities/create-facility.schema';
import type { TUpdateFacilityForm } from '@/validations/facilities/update-facility.schema';

export function useFacilityMutations() {
  return useCrudMutations<Facility, TCreateFacilityForm, Partial<TUpdateFacilityForm>, number>({
    keys: {
      all: facilitiesQueryKeys.all,
      detail: id => facilitiesQueryKeys.detail(id),
      lists: () => facilitiesQueryKeys.lists(),
    },
    service: {
      create: data => facilitiesService.create(data),
      update: (id, data) => facilitiesService.update(id, data),
      delete: id => facilitiesService.delete(id),
    },
    getId: item => item.id,
    optimistic: {
      insertIntoLists: true,
      updateInLists: true,
      removeFromLists: true,
    },
  });
}

