'use client';

import { useCrudMutations } from '@/hooks/api/mutations/useCrudMutations';
import { facilityUnitsQueryKeys } from '@/hooks/api/keys';
import { facilitiesService } from '@/services/facilities.service';
import type { FacilityUnit } from '@/types/facilities/facilities.types';
import type { TCreateFacilityUnitForm } from '@/validations/facilities/create-facility-unit.schema';
import type { TUpdateFacilityUnitForm } from '@/validations/facilities/update-facility-unit.schema';

export function useFacilityUnitMutations() {
  return useCrudMutations<FacilityUnit, TCreateFacilityUnitForm, Partial<TUpdateFacilityUnitForm>, number>({
    keys: {
      all: facilityUnitsQueryKeys.all,
      detail: id => facilityUnitsQueryKeys.detail(id),
      lists: () => facilityUnitsQueryKeys.lists(),
    },
    service: {
      create: data => facilitiesService.createUnit(data),
      update: (id, data) => facilitiesService.updateUnit(id, data),
      delete: id => facilitiesService.deleteUnit(id),
    },
    getId: item => item.id,
    optimistic: {
      insertIntoLists: true,
      updateInLists: true,
      removeFromLists: true,
    },
  });
}

