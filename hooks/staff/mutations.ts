"use client";

import { useCrudMutations } from "@/hooks/mutations/useCrudMutations";
import { staffQueryKeys } from "@/hooks/keys";
import { staffService } from "@/services/staff.service";
import type { Staff } from "@/types/staff.types";
import type { TCreateStaffDTO, TEditStaffDTO } from "@/schemas/staff.schemas";

export function useStaffMutations() {
  return useCrudMutations<Staff, TCreateStaffDTO, TEditStaffDTO | FormData, number>({
    keys: {
      all: staffQueryKeys.all,
      detail: (id) => staffQueryKeys.detail(id),
      lists: () => staffQueryKeys.lists(),
    },
    service: {
      create: (data) => staffService.create(data),
      update: (id, data) => staffService.update(id, data as TEditStaffDTO | FormData),
      delete: (id) => staffService.delete(id),
    },
    getId: (item) => item.id,
    optimistic: {
      insertIntoLists: true,
      updateInLists: true,
      removeFromLists: true,
    },
  });
}

