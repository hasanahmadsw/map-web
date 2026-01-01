'use client';
import { zodResolver } from '@hookform/resolvers/zod';

import { useRouter } from 'next/navigation';

import { Resolver, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Form } from '@/components/ui/form';
import { useServiceMutations } from '@/hooks/api/services/mutations';

import { BasicInformationSection } from './partial/basic-information-section';
import { SolutionKeySection } from './partial/solution-key-section';
import { MetaInformationSection } from './partial/meta-information-section';
import { StatusOptionsSection } from './partial/status-options-section';

import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/shared/buttons/loading-button';
import { createServiceSchema, type TCreateServiceForm } from '@/validations/services/create-service.schema';
import ResponseError from '@/components/shared/response-error';
import { sanitizeDto } from '@/utils/format';
import { SubServicesInput } from '@/components/shared/input/SubServicesInput';
import { MediaSelectInput } from '@/components/shared/input/MediaSelectInput';
import { MediaMultiSelectInput } from '@/components/shared/input/MediaMultiSelectInput';

function AddServiceForm() {
  const router = useRouter();
  const { create } = useServiceMutations();

  const form = useForm<TCreateServiceForm>({
    resolver: zodResolver(createServiceSchema()) as Resolver<TCreateServiceForm>,
    defaultValues: {
      isPublished: false,
      isFeatured: false,
      order: 0,
      gallery: [],
    },
  });

  const onSubmit = async (data: TCreateServiceForm) => {
    const sanitizedData = sanitizeDto(data) as TCreateServiceForm;

    try {
      await create.mutateAsync(sanitizedData);
      toast.success('Service created successfully');
      router.push('/dashboard/services');
    } catch {
      toast.error((create.error as Error | undefined)?.message || 'Failed to create service');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Main service information */}
        <BasicInformationSection />

        {/* Featured image */}
        <MediaSelectInput
          control={form.control}
          name="featuredImage"
          label="Featured Image"
          typeFilter="image"
        />

        {/* Gallery Images */}
        <MediaMultiSelectInput
          control={form.control}
          name="gallery"
          label="Gallery Images"
          typeFilter="image"
        />

        {/* Sub-services for this service */}
        <SubServicesInput
          control={form.control}
          name="subServices"
          label="Sub Services"
          description="Add sub-services for this service."
        />

        {/* Solution Key */}
        <SolutionKeySection />

        {/* SEO and metadata */}
        <MetaInformationSection />

        {/* Publishing and workflow status */}
        <StatusOptionsSection />

        <ResponseError error={create.error as unknown as Error} />

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/services')}
            disabled={create.isPending}
          >
            Cancel
          </Button>
          <LoadingButton isLoading={create.isPending} loadingText="Creating..." defaultText="Add Service" />
        </div>
      </form>
    </Form>
  );
}

export default AddServiceForm;
