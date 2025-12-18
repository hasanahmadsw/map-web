'use client';

import { useCrudMutations } from '@/hooks/mutations/useCrudMutations';
import { equipmentsQueryKeys } from '@/hooks/keys';
import { equipmentsService } from '@/services/equipments/equipments.service';
import type { IEquipment } from '@/types/equipments/equipment.type';
import type { TCreateEquipmentForm } from '@/validations/equipments/create-equipment.schema';
import type { TUpdateEquipmentForm } from '@/validations/equipments/update-equipment.schema';

export function useEquipmentMutations() {
  return useCrudMutations<IEquipment, TCreateEquipmentForm, Partial<TUpdateEquipmentForm>, number>({
    keys: {
      all: equipmentsQueryKeys.all,
      detail: id => equipmentsQueryKeys.detail(id),
      lists: () => equipmentsQueryKeys.lists(),
    },
    service: {
      create: data => equipmentsService.create(data),
      update: (id, data) => equipmentsService.update(id, data),
      delete: id => equipmentsService.delete(id),
    },
    getId: item => item.id,
    optimistic: {
      insertIntoLists: true,
      updateInLists: true,
      removeFromLists: true,
    },
  });
}
