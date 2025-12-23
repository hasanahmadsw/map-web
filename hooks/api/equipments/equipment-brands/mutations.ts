'use client';

import { useCrudMutations } from '@/hooks/api/mutations/useCrudMutations';
import { equipmentBrandsQueryKeys } from '@/hooks/api/keys';
import { equipmentBrandsService } from '@/services/equipments/equipment-brands.service';
import type { IEquipmentBrand } from '@/types/equipments/equipment-brand.type';
import type { TCreateEquipmentBrandForm } from '@/validations/equipments/brands/create-equipment-brand.schema';
import type { TUpdateEquipmentBrandForm } from '@/validations/equipments/brands/update-equipment-brand.schema';

export function useEquipmentBrandMutations() {
  return useCrudMutations<
    IEquipmentBrand,
    TCreateEquipmentBrandForm,
    Partial<TUpdateEquipmentBrandForm>,
    number
  >({
    keys: {
      all: equipmentBrandsQueryKeys.all,
      detail: id => equipmentBrandsQueryKeys.detail(id),
      lists: () => equipmentBrandsQueryKeys.lists(),
    },
    service: {
      create: data => equipmentBrandsService.create(data),
      update: (id, data) => equipmentBrandsService.update(id, data),
      delete: id => equipmentBrandsService.delete(id),
    },
    getId: item => item.id,
    optimistic: {
      insertIntoLists: true,
      updateInLists: true,
      removeFromLists: true,
    },
  });
}
