'use client';

import { zodResolver } from '@hookform/resolvers/zod';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import EquipmentBrandFormFields from './equipment-brand-form-fields';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';

import { useEquipmentBrandMutations } from '@/hooks/api/equipments/equipment-brands/mutations';

import {
  createEquipmentBrandSchema,
  type TCreateEquipmentBrandForm,
} from '@/validations/equipments/brands/create-equipment-brand.schema';
import { LoadingButton } from '@/components/shared/buttons/loading-button';
import { Separator } from '@/components/ui/separator';
import ResponseError from '@/components/shared/response-error';

function AddEquipmentBrand({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { create } = useEquipmentBrandMutations();

  const form = useForm<TCreateEquipmentBrandForm>({
    resolver: zodResolver(createEquipmentBrandSchema()),
    defaultValues: {
      isActive: true,
    },
  });

  const onSubmit = async (data: TCreateEquipmentBrandForm) => {
    try {
      await create.mutateAsync(data);
      toast.success('Equipment brand created successfully');

      form.reset();
      onClose();
    } catch (error) {
      const errorMessage = (error as Error)?.message || 'Failed to create equipment brand';
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[500px] overflow-y-auto sm:max-h-[550px] sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-start">Add Equipment Brand</DialogTitle>
          <DialogDescription className="text-start">
            Add a new equipment brand to the system.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <EquipmentBrandFormFields />

            <Separator />

            {/* Response Error */}
            {<ResponseError error={create.error as Error} />}

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

export default AddEquipmentBrand;
