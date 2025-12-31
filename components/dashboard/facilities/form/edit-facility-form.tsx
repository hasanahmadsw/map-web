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
import { useFacilityById } from '@/hooks/api/facilities/useFacilityById';
import { useFacilityMutations } from '@/hooks/api/facilities/mutations';

import {
  updateFacilitySchema,
  type TUpdateFacilityForm,
} from '@/validations/facilities/update-facility.schema';
import ResponseError from '@/components/shared/response-error';
import { BasicInformationSection } from './partials/basic-information-section';
import { StatusOptionsSection } from './partials/status-options-section';
import { getChangedValues } from '@/utils/format';
import { MediaSelectInput } from '@/components/shared/input/MediaSelectInput';
import { MediaMultiSelectInput } from '@/components/shared/input/MediaMultiSelectInput';

interface EditFacilityFormProps {
  facilityId: string;
}

export function EditFacilityForm({ facilityId }: EditFacilityFormProps) {
  const router = useRouter();
  const { update } = useFacilityMutations();
  const {
    facility,
    isLoading: isLoadingFacility,
    isError: isErrorFacility,
    refetch: refetchFacility,
  } = useFacilityById(facilityId);

  const form = useForm<TUpdateFacilityForm>({
    resolver: zodResolver(updateFacilitySchema()) as Resolver<TUpdateFacilityForm>,
    defaultValues: {},
  });

  // Reset form when facility data is loaded
  useEffect(() => {
    if (facility) {
      form.reset({
        solutionId: facility.solutionId,
        type: facility.type,
        slug: facility.slug,
        title: facility.title,
        summary: facility.summary,
        description: facility.description,
        coverImage: facility.coverImage,
        gallery: Array.isArray(facility.gallery) ? facility.gallery : [],
        isPublished: facility.isPublished,
        order: facility.order,
      });
    }
  }, [facility, form]);

  const onSubmit = async (data: TUpdateFacilityForm) => {
    const changedValues = getChangedValues(form.formState.defaultValues as TUpdateFacilityForm, data);

    try {
      await update.mutateAsync({ id: Number(facilityId), data: changedValues });
      toast.success('Facility updated successfully');
      router.push('/dashboard/facilities');
    } catch (error) {
      toast.error((error as Error)?.message || 'Failed to update facility');
      console.error(error);
    }
  };

  if (isLoadingFacility) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (isErrorFacility || !facility) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-2">Failed to load facility</p>
          <Button onClick={() => refetchFacility()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Main facility information */}
        <BasicInformationSection />

        {/* Cover image */}
        <MediaSelectInput control={form.control} name="coverImage" label="Cover Image" typeFilter="image" />

        {/* Gallery */}
        <MediaMultiSelectInput control={form.control} name="gallery" label="Gallery" typeFilter="image" />

        {/* Publishing status */}
        <StatusOptionsSection />

        <ResponseError error={update.error as unknown as Error} />

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/facilities')}
            disabled={update.isPending}
          >
            Cancel
          </Button>
          <LoadingButton
            isLoading={update.isPending}
            loadingText="Updating..."
            defaultText="Update Facility"
          />
        </div>
      </form>
    </Form>
  );
}
