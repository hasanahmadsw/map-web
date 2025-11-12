"use client";

import { useCrudMutations } from "@/hooks/mutations/useCrudMutations";
import { servicesQueryKeys } from "@/hooks/keys";
import { servicesService } from "@/services/services.service";
import type { StaffService } from "@/types/services.types";
import type { TCreateServiceForm, TEditServiceForm } from "@/schemas/services.schemas";

export function useServiceMutations() {
  return useCrudMutations<StaffService, TCreateServiceForm, TEditServiceForm, number>({
    keys: {
      all: servicesQueryKeys.all,
      detail: (id) => servicesQueryKeys.detail(id),
      lists: () => servicesQueryKeys.lists(),
    },
    service: {
      create: (data) => servicesService.create(data),
      update: (id, data) => servicesService.update(id, data),
      delete: (id) => servicesService.delete(id),
    },
    getId: (item) => item.id,
    optimistic: {
      insertIntoLists: true,
      updateInLists: true,
      removeFromLists: true,
    },
  });
}

