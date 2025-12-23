'use client';

import { useCrudMutations } from '@/hooks/api/mutations/useCrudMutations';
import { servicesQueryKeys } from '@/hooks/api/keys';
import { servicesService } from '@/services/services.service';
import type { StaffService } from '@/types/services.types';
import type { TCreateServiceForm } from '@/validations/services/create-service.schema';
import { TEditServiceForm } from '@/validations/services/edit-service.schema';

export function useServiceMutations() {
  return useCrudMutations<StaffService, TCreateServiceForm, Partial<TEditServiceForm>, number>({
    keys: {
      all: servicesQueryKeys.all,
      detail: id => servicesQueryKeys.detail(id),
      lists: () => servicesQueryKeys.lists(),
    },
    service: {
      create: data => servicesService.create(data),
      update: (id, data) => servicesService.update(id, data),
      delete: id => servicesService.delete(id),
    },
    getId: item => item.id,
    optimistic: {
      insertIntoLists: true,
      updateInLists: true,
      removeFromLists: true,
    },
  });
}
