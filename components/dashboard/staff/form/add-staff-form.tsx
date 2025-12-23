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

import { createStaffSchema, TCreateStaffForm } from '@/validations/staff/create-staff.schema';
import { LoadingButton } from '@/components/shared/buttons/loading-button';

function AddStaffMember({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { create } = useStaffMutations();

  const [open, setOpen] = useState(isOpen);

  const form = useForm<TCreateStaffForm>({
    resolver: zodResolver(createStaffSchema()),
  });

  const onSubmit = async (data: TCreateStaffForm) => {
    const { confirmPassword, ...rest } = data;

    try {
      await create.mutateAsync(rest as TCreateStaffForm);
      toast.success('Staff created successfully');

      onClose();
    } catch (error) {
      const errorMessage = (create.error as Error)?.message || 'Failed to create staff';
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[500px] overflow-y-auto sm:max-h-[550px] sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-start">Add Staff</DialogTitle>
          <DialogDescription className="text-start">Add a new staff member to the system.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <StaffFormFields />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={create.isPending}>
                Cancel
              </Button>
              <LoadingButton isLoading={create.isPending} loadingText="Adding..." defaultText="Add" />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddStaffMember;
