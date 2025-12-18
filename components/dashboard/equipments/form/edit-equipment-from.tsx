'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { FormProvider, type Resolver, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ResponseError from '@/components/shared/response-error';
import { LoadingButton } from '@/components/shared/buttons/loading-button';
import FormSkeleton from '@/components/shared/skeletons/form-skeleton';

import type { IEquipment } from '@/types/equipments/equipment.type';
import {
  updateEquipmentSchema,
  type TUpdateEquipmentForm,
} from '@/validations/equipments/update-equipment.schema';
import { useEquipmentMutations } from '@/hooks/api/equipments/mutations';
import { useEquipmentById } from '@/hooks/api/equipments/use-equipments';
import { getChangedValues } from '@/utils/format';
import { getDirection } from '@/utils/dictionary-utils';
import { EquipmentType } from '@/types/equipments/equipment.enum';
import ApiError from '@/components/shared/api-error';

// Dynamic Imports
const BasicInfoStep = dynamic(() => import('./steps/basic-info-step'), {
  ssr: false,
  loading: () => <FormSkeleton />,
});
const MediaStep = dynamic(() => import('./steps/media-step'), {
  ssr: false,
  loading: () => <FormSkeleton />,
});
const SpecificationsStep = dynamic(() => import('./steps/specifications-step'), {
  ssr: false,
  loading: () => <FormSkeleton />,
});

interface EditEquipmentFormProps {
  equipmentId: string | number;
}

function EditEquipmentForm({ equipmentId }: EditEquipmentFormProps) {
  const router = useRouter();
  const {
    equipment,
    isLoading: isLoadingEquipment,
    error: equipmentError,
    refetch,
  } = useEquipmentById(equipmentId, true);
  const { update } = useEquipmentMutations();

  // Prepare form data from equipment
  const getFormData = (equipment: IEquipment): TUpdateEquipmentForm => {
    return {
      slug: equipment.slug || '',
      name: equipment.name || '',
      summary: equipment.summary || '',
      description: equipment.description || '',
      categoryId: equipment.category.id,
      categoryLabel: equipment.category.name,
      brandId: equipment.brand.id,
      brandLabel: equipment.brand.name,
      isPublished: equipment.isPublished ?? false,
      isFeatured: equipment.isFeatured ?? false,
      order: equipment.order || undefined,
      coverPath: equipment.coverPath || '',
      galleryPaths: equipment.galleryPaths || [],
      specs: equipment.specs as any,
      status: equipment.status || undefined,
    };
  };

  // Form
  const form = useForm<TUpdateEquipmentForm>({
    resolver: zodResolver(updateEquipmentSchema()) as Resolver<TUpdateEquipmentForm>,
    defaultValues: equipment ? getFormData(equipment) : undefined,
  });

  // Watch equipmentType from specs for SpecificationsStep
  const specs = useWatch({ control: form.control, name: 'specs' });
  const equipmentType = specs?.type as `${EquipmentType}` | undefined;

  // Reset form when equipment data is loaded
  useEffect(() => {
    if (equipment) {
      form.reset(getFormData(equipment));
    }
  }, [equipment, form]);

  // Handlers
  const onSubmit = async (data: TUpdateEquipmentForm) => {
    const changedValues = getChangedValues(
      form.formState.defaultValues as TUpdateEquipmentForm,
      data,
    ) as Partial<TUpdateEquipmentForm>;

    try {
      await update.mutateAsync({
        id: Number(equipmentId),
        data: changedValues,
      });

      toast.success('Equipment updated successfully');
      router.refresh();
    } catch (error) {
      const errMsg = (error as Error)?.message || 'Failed to update equipment';
      toast.error(errMsg);
      console.error('Error updating equipment:', error);
    }
  };

  if (isLoadingEquipment) {
    return <FormSkeleton />;
  }

  if (equipmentError || !equipment) {
    return <ApiError errorMessage={equipmentError ?? 'Please try again.'} refetchFunction={refetch} />;
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <ScrollArea>
            <div className="border-b-muted mb-6 w-full border-b-2 p-0">
              <TabsList className="border-muted flex bg-transparent p-0">
                <TabsTrigger
                  value="basic"
                  className="data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:bg-background text-muted-foreground flex-1 rounded-none border-b-2 px-6 py-3 font-medium data-[state=active]:border-0 data-[state=active]:border-b-2 data-[state=active]:shadow-none"
                >
                  Basic Information
                </TabsTrigger>
                <TabsTrigger
                  value="media"
                  className="data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:bg-background text-muted-foreground flex-1 rounded-none border-b-2 px-6 py-3 font-medium data-[state=active]:border-0 data-[state=active]:border-b-2 data-[state=active]:shadow-none"
                >
                  Media
                </TabsTrigger>
                <TabsTrigger
                  value="specifications"
                  className="data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:bg-background text-muted-foreground flex-1 rounded-none border-b-2 px-6 py-3 font-medium data-[state=active]:border-0 data-[state=active]:border-b-2 data-[state=active]:shadow-none"
                >
                  Specifications
                </TabsTrigger>
              </TabsList>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <TabsContent value="basic" className="mt-0">
            <BasicInfoStep isEdit={true} />
          </TabsContent>
          <TabsContent value="media" className="mt-0">
            <MediaStep />
          </TabsContent>
          <TabsContent value="specifications" className="mt-0">
            {equipmentType && <SpecificationsStep equipmentType={equipmentType} />}
          </TabsContent>
        </Tabs>

        {/* Response Error */}
        <ResponseError error={update.error as Error} />

        {/* Submit Button */}
        <div className="flex justify-end">
          <LoadingButton
            isLoading={update.isPending}
            loadingText="Updating..."
            defaultText="Update Equipment"
            disabled={update.isPending || !form.formState.isDirty}
            className="w-44"
          />
        </div>
      </form>
    </FormProvider>
  );
}

export default EditEquipmentForm;
