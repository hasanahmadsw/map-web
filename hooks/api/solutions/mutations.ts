'use client';

import { useCrudMutations } from '@/hooks/api/mutations/useCrudMutations';
import { solutionsQueryKeys } from '@/hooks/api/keys';
import { solutionsService } from '@/services/solutions.service';
import type { StaffSolution } from '@/types/solutions.types';
import type { TCreateSolutionForm } from '@/validations/solutions/create-solution.schema';
import type { TUpdateSolutionForm } from '@/validations/solutions/update-solution.schema';

export function useSolutionMutations() {
  return useCrudMutations<StaffSolution, TCreateSolutionForm, Partial<TUpdateSolutionForm>, number>({
    keys: {
      all: solutionsQueryKeys.all,
      detail: id => solutionsQueryKeys.detail(id),
      lists: () => solutionsQueryKeys.lists(),
    },
    service: {
      create: data => solutionsService.create(data),
      update: (id, data) => solutionsService.update(id, data),
      delete: id => solutionsService.delete(id),
    },
    getId: item => item.id,
    optimistic: {
      insertIntoLists: true,
      updateInLists: true,
      removeFromLists: true,
    },
  });
}
