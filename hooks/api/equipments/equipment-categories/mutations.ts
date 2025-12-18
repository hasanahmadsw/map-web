'use client';

import { useCrudMutations } from '@/hooks/mutations/useCrudMutations';
import { equipmentCategoriesQueryKeys } from '@/hooks/keys';
import { equipmentCategoriesService } from '@/services/equipments/equipment-categories.service';
import type { IEquipmentCategory } from '@/types/equipments/equipment-category.type';
import type { TCreateEquipmentCategoryForm } from '@/validations/equipments/categories/create-equipment-category.schema';
import type { TUpdateEquipmentCategoryForm } from '@/validations/equipments/categories/update-equipment-category.schema';

export function useEquipmentCategoryMutations() {
  return useCrudMutations<
    IEquipmentCategory,
    TCreateEquipmentCategoryForm,
    Partial<TUpdateEquipmentCategoryForm>,
    number
  >({
    keys: {
      all: equipmentCategoriesQueryKeys.all,
      detail: id => equipmentCategoriesQueryKeys.detail(id),
      lists: () => equipmentCategoriesQueryKeys.lists(),
    },
    service: {
      create: data => equipmentCategoriesService.create(data),
      update: (id, data) => equipmentCategoriesService.update(id, data),
      delete: id => equipmentCategoriesService.delete(id),
    },
    getId: item => item.id,
    optimistic: {
      insertIntoLists: true,
      updateInLists: true,
      removeFromLists: true,
    },
  });
}
