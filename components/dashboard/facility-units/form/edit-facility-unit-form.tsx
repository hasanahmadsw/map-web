'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/shared/buttons/loading-button';
import { useFacilityUnitById } from '@/hooks/api/facilities/useFacilityUnitById';
import { useFacilityUnitMutations } from '@/hooks/api/facilities/unit-mutations';

import {
  updateFacilityUnitSchema,
  type TUpdateFacilityUnitForm,
} from '@/validations/facilities/update-facility-unit.schema';
import ResponseError from '@/components/shared/response-error';
import { BasicInformationSection } from './partials/basic-information-section';
import { StatusOptionsSection } from './partials/status-options-section';
import { ItemsSection } from './partials/items-section';
import { getChangedValues } from '@/utils/format';
import { MediaSelectInput } from '@/components/shared/input/MediaSelectInput';
import { MediaMultiSelectInput } from '@/components/shared/input/MediaMultiSelectInput';

interface EditFacilityUnitFormProps {
  facilityUnitId: string;
}

export function EditFacilityUnitForm({ facilityUnitId }: EditFacilityUnitFormProps) {
  const router = useRouter();
  const { update } = useFacilityUnitMutations();
  const {
    facilityUnit,
    isLoading: isLoadingFacilityUnit,
    isError: isErrorFacilityUnit,
    refetch: refetchFacilityUnit,
  } = useFacilityUnitById(facilityUnitId);

  const form = useForm<TUpdateFacilityUnitForm>({
    resolver: zodResolver(updateFacilityUnitSchema()) as Resolver<TUpdateFacilityUnitForm>,
    defaultValues: {},
  });

  // Reset form when facility unit data is loaded
  useEffect(() => {
    if (facilityUnit) {
      form.reset({
        facilityId: facilityUnit.facilityId,
        slug: facilityUnit.slug,
        title: facilityUnit.title,
        summary: facilityUnit.summary,
        description: facilityUnit.description,
        coverImage: facilityUnit.coverImage,
        gallery: Array.isArray(facilityUnit.gallery) ? facilityUnit.gallery : [],
        isPublished: facilityUnit.isPublished,
        order: facilityUnit.order,
        items: Array.isArray(facilityUnit.items)
          ? (facilityUnit.items.map(item => ({
              group: item.group,
              title: item.title,
              qty: item.qty,
              notes: item.notes,
              order: item.order,
            })) as TUpdateFacilityUnitForm['items'])
          : [],
      });
    }
  }, [facilityUnit, form]);

  const onSubmit = async (data: TUpdateFacilityUnitForm) => {
    const changedValues = getChangedValues(form.formState.defaultValues as TUpdateFacilityUnitForm, data);

    try {
      await update.mutateAsync({ id: Number(facilityUnitId), data: changedValues });
      toast.success('Facility unit updated successfully');
      router.push('/dashboard/facility-units');
    } catch (error) {
      toast.error((error as Error)?.message || 'Failed to update facility unit');
      console.error(error);
    }
  };

  if (isLoadingFacilityUnit) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (isErrorFacilityUnit || !facilityUnit) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-2">Failed to load facility unit</p>
          <Button onClick={() => refetchFacilityUnit()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Main facility unit information */}
        <BasicInformationSection />

        {/* Cover image */}
        <MediaSelectInput control={form.control} name="coverImage" label="Cover Image" typeFilter="image" />

        {/* Gallery */}
        <MediaMultiSelectInput control={form.control} name="gallery" label="Gallery" typeFilter="image" />

        {/* Items */}
        <ItemsSection />

        {/* Publishing status */}
        <StatusOptionsSection />

        <ResponseError error={update.error as unknown as Error} />

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/facility-units')}
            disabled={update.isPending}
          >
            Cancel
          </Button>
          <LoadingButton
            isLoading={update.isPending}
            loadingText="Updating..."
            defaultText="Update Facility Unit"
          />
        </div>
      </form>
    </Form>
  );
}
