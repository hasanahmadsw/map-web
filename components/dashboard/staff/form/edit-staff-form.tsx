'use client';

import { zodResolver } from '@hookform/resolvers/zod';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import StaffFormFields from './staff-form-fields';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';

import { useStaffMutations } from '@/hooks/api/staff/mutations';

import { editStaffSchema, TEditStaffForm } from '@/validations/staff/edit-staff.schema';
import { LoadingButton } from '@/components/shared/buttons/loading-button';
import { Staff } from '@/types/staff.types';
import { getChangedValues } from '@/utils/format';

interface EditStaffFormProps {
  isOpen: boolean;
  onClose: () => void;
  staff: Staff;
}

function EditStaffForm({ isOpen, onClose, staff }: EditStaffFormProps) {
  const { update } = useStaffMutations();

  const [open, setOpen] = useState(isOpen);

  const form = useForm<TEditStaffForm>({
    resolver: zodResolver(editStaffSchema()),
    defaultValues: {
      name: staff.name,
      email: staff.email,
      role: staff.role as TEditStaffForm['role'],
      bio: staff.bio || '',
      image: staff.image || undefined,
    },
  });

  const onSubmit = async (data: TEditStaffForm) => {
    const { confirmPassword, ...rest } = data;

    const changedValues = getChangedValues(form.formState.defaultValues as TEditStaffForm, rest);

    try {
      await update.mutateAsync({ id: staff.id, data: changedValues });
      toast.success('Staff updated successfully');

      setOpen(false);
      onClose();
    } catch (error) {
      const errorMessage = (error as Error)?.message || 'Failed to update staff';
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[500px] overflow-y-auto sm:max-h-[550px] sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-start">Edit Staff</DialogTitle>
          <DialogDescription className="text-start">Update staff member information.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <StaffFormFields />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={update.isPending}>
                Cancel
              </Button>
              <LoadingButton isLoading={update.isPending} loadingText="Updating..." defaultText="Update" />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditStaffForm;
