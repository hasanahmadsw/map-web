'use client';

import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import EquipmentCategoryFormFields from './equipment-category-form-fields';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';

import { useEquipmentCategoryMutations } from '@/hooks/api/equipments/equipment-categories/mutations';

import {
  updateEquipmentCategorySchema,
  type TUpdateEquipmentCategoryForm,
} from '@/validations/equipments/categories/update-equipment-category.schema';
import { LoadingButton } from '@/components/shared/buttons/loading-button';
import type { IEquipmentCategory } from '@/types/equipments/equipment-category.type';
import { getChangedValues } from '@/utils/format';

interface EditEquipmentCategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  category: IEquipmentCategory;
}

function EditEquipmentCategoryForm({ isOpen, onClose, category }: EditEquipmentCategoryFormProps) {
  const { update } = useEquipmentCategoryMutations();

  const form = useForm<TUpdateEquipmentCategoryForm>({
    resolver: zodResolver(updateEquipmentCategorySchema()),
    defaultValues: {
      name: category.name,
      slug: category.slug,
      description: category.description,
      type: category.type as TUpdateEquipmentCategoryForm['type'],
      order: category.order,
      isActive: category.isActive,
    },
  });

  const onSubmit = async (data: TUpdateEquipmentCategoryForm) => {
    const changedValues = getChangedValues(
      form.formState.defaultValues as TUpdateEquipmentCategoryForm,
      data,
    );

    try {
      await update.mutateAsync({ id: category.id, data: changedValues });
      toast.success('Equipment category updated successfully');

      onClose();
    } catch (error) {
      const errorMessage = (update.error as Error)?.message || 'Failed to update equipment category';
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[600px] overflow-y-auto sm:max-h-[650px] sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-start">Edit Equipment Category</DialogTitle>
          <DialogDescription className="text-start">Update equipment category information.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <EquipmentCategoryFormFields />

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

export default EditEquipmentCategoryForm;
