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
  createEquipmentCategorySchema,
  type TCreateEquipmentCategoryForm,
} from '@/validations/equipments/categories/create-equipment-category.schema';
import { LoadingButton } from '@/components/shared/buttons/loading-button';

function AddEquipmentCategory({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { create } = useEquipmentCategoryMutations();

  const form = useForm<TCreateEquipmentCategoryForm>({
    resolver: zodResolver(createEquipmentCategorySchema()),
    defaultValues: {
      isActive: true,
    },
  });

  const onSubmit = async (data: TCreateEquipmentCategoryForm) => {
    try {
      await create.mutateAsync(data);
      toast.success('Equipment category created successfully');

      form.reset();
      onClose();
    } catch (error) {
      const errorMessage = (create.error as Error)?.message || 'Failed to create equipment category';
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[600px] overflow-y-auto sm:max-h-[650px] sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-start">Add Equipment Category</DialogTitle>
          <DialogDescription className="text-start">
            Add a new equipment category to the system.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <EquipmentCategoryFormFields />

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

export default AddEquipmentCategory;
