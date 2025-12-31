'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { Resolver, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/shared/buttons/loading-button';
import { useFacilityMutations } from '@/hooks/api/facilities/mutations';

import ResponseError from '@/components/shared/response-error';
import { BasicInformationSection } from './partials/basic-information-section';
import { StatusOptionsSection } from './partials/status-options-section';
import {
  createFacilitySchema,
  type TCreateFacilityForm,
} from '@/validations/facilities/create-facility.schema';
import { sanitizeDto } from '@/utils/format';
import { MediaSelectInput } from '@/components/shared/input/MediaSelectInput';
import { MediaMultiSelectInput } from '@/components/shared/input/MediaMultiSelectInput';

export function AddFacilityForm() {
  const router = useRouter();
  const { create } = useFacilityMutations();

  const form = useForm<TCreateFacilityForm>({
    resolver: zodResolver(createFacilitySchema()) as Resolver<TCreateFacilityForm>,
    defaultValues: {
      isPublished: false,
      gallery: [],
    },
  });

  const onSubmit = async (data: TCreateFacilityForm) => {
    const sanitizedData = sanitizeDto(data) as TCreateFacilityForm;

    try {
      await create.mutateAsync(sanitizedData);
      toast.success('Facility created successfully');
      router.push('/dashboard/facilities');
    } catch (error) {
      toast.error((error as Error)?.message || 'Failed to create facility');
      console.error(error);
    }
  };

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

        <ResponseError error={create.error as unknown as Error} />

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/facilities')}
            disabled={create.isPending}
          >
            Cancel
          </Button>
          <LoadingButton
            isLoading={create.isPending}
            loadingText="Creating..."
            defaultText="Create Facility"
          />
        </div>
      </form>
    </Form>
  );
}
