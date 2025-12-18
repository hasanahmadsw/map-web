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
  updateEquipmentBrandSchema,
  type TUpdateEquipmentBrandForm,
} from '@/validations/equipments/brands/update-equipment-brand.schema';
import { LoadingButton } from '@/components/shared/buttons/loading-button';
import type { IEquipmentBrand } from '@/types/equipments/equipment-brand.type';
import { getChangedValues } from '@/utils/format';
import { Separator } from '@/components/ui/separator';
import ResponseError from '@/components/shared/response-error';

interface EditEquipmentBrandFormProps {
  isOpen: boolean;
  onClose: () => void;
  brand: IEquipmentBrand;
}

function EditEquipmentBrandForm({ isOpen, onClose, brand }: EditEquipmentBrandFormProps) {
  const { update } = useEquipmentBrandMutations();

  const form = useForm<TUpdateEquipmentBrandForm>({
    resolver: zodResolver(updateEquipmentBrandSchema()),
    defaultValues: {
      name: brand.name,
      slug: brand.slug,
      order: brand.order,
      isActive: brand.isActive,
    },
  });

  const onSubmit = async (data: TUpdateEquipmentBrandForm) => {
    const changedValues = getChangedValues(form.formState.defaultValues as TUpdateEquipmentBrandForm, data);

    if (!Object.keys(changedValues).length) {
      toast.error('No changes to update');
      return;
    }

    try {
      await update.mutateAsync({ id: brand.id, data: changedValues });
      toast.success('Equipment brand updated successfully');

      onClose();
    } catch (error) {
      const errorMessage = (update.error as Error)?.message || 'Failed to update equipment brand';
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[500px] overflow-y-auto sm:max-h-[550px] sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-start">Edit Equipment Brand</DialogTitle>
          <DialogDescription className="text-start">Update equipment brand information.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <EquipmentBrandFormFields />

            <Separator />

            {/* Response Error */}
            {<ResponseError error={update.error as Error} />}

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

export default EditEquipmentBrandForm;
