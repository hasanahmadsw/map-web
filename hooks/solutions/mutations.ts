"use client";

import { useCrudMutations } from "@/hooks/mutations/useCrudMutations";
import { solutionsQueryKeys } from "@/hooks/keys";
import { solutionsService } from "@/services/solutions.service";
import type { StaffSolution } from "@/types/solutions.types";
import type { TCreateSolutionForm, TEditSolutionForm } from "@/schemas/solutions.schemas";

export function useSolutionMutations() {
  return useCrudMutations<StaffSolution, TCreateSolutionForm, TEditSolutionForm, number>({
    keys: {
      all: solutionsQueryKeys.all,
      detail: (id) => solutionsQueryKeys.detail(id),
      lists: () => solutionsQueryKeys.lists(),
    },
    service: {
      create: (data) => solutionsService.create(data),
      update: (id, data) => solutionsService.update(id, data),
      delete: (id) => solutionsService.delete(id),
    },
    getId: (item) => item.id,
    optimistic: {
      insertIntoLists: true,
      updateInLists: true,
      removeFromLists: true,
    },
  });
}

