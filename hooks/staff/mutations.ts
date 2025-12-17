'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCrudMutations } from '@/hooks/mutations/useCrudMutations';
import { staffQueryKeys } from '@/hooks/keys';
import { staffService } from '@/services/staff.service';
import type { Staff } from '@/types/staff.types';
import { TEditStaffForm } from '@/validations/staff/edit-staff.schema';
import { TCreateStaffForm } from '@/validations/staff/create-staff.schema';
import type { TUpdateMeForm } from '@/validations/staff/update-me.schema';

export function useStaffMutations() {
  return useCrudMutations<Staff, TCreateStaffForm, Partial<TEditStaffForm> | FormData, number>({
    keys: {
      all: staffQueryKeys.all,
      detail: id => staffQueryKeys.detail(id),
      lists: () => staffQueryKeys.lists(),
    },
    service: {
      create: data => staffService.create(data),
      update: (id, data) => staffService.update(id, data as Partial<TEditStaffForm> | FormData),
      delete: id => staffService.delete(id),
    },
    getId: item => item.id,
    optimistic: {
      insertIntoLists: true,
      updateInLists: true,
      removeFromLists: true,
    },
  });
}

export function useUpdateMeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateMePayload) => staffService.updateMe(payload),
    onSuccess: updated => {
      queryClient.setQueryData(staffQueryKeys.detail('me'), updated);
      queryClient.invalidateQueries({ queryKey: staffQueryKeys.all });
    },
  });
}

type UpdateMePayload = Partial<Omit<TUpdateMeForm, 'confirmPassword'>>;
