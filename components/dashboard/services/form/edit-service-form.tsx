'use client';
import { zodResolver } from '@hookform/resolvers/zod';

import { useRouter } from 'next/navigation';

import { Resolver, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

import { Form } from '@/components/ui/form';
import { useServiceById } from '@/hooks/api/services/useServiceById';
import { useServiceMutations } from '@/hooks/api/services/mutations';

import { BasicInformationSection } from './partial/basic-information-section';
import { SolutionKeySection } from './partial/solution-key-section';
import { MetaInformationSection } from './partial/meta-information-section';

import { StatusOptionsSection } from './partial/status-options-section';

import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/shared/buttons/loading-button';
import { editServiceSchema, type TEditServiceForm } from '@/validations/services/edit-service.schema';
import ResponseError from '@/components/shared/response-error';
import { getChangedValues } from '@/utils/format';
import { SubServicesInput } from '@/components/shared/input/SubServicesInput';
import { MediaSelectInput } from '@/components/shared/input/MediaSelectInput';
import { MediaMultiSelectInput } from '@/components/shared/input/MediaMultiSelectInput';

interface EditServiceFormProps {
  serviceId: string;
}

export function EditServiceForm({ serviceId }: EditServiceFormProps) {
  const router = useRouter();
  const { update } = useServiceMutations();
  const {
    service,
    isLoading: isLoadingService,
    isError: isErrorService,
    refetch: refetchService,
  } = useServiceById(serviceId);

  const form = useForm<TEditServiceForm>({
    resolver: zodResolver(editServiceSchema()) as Resolver<TEditServiceForm>,
  });

  // Reset form when service data is loaded
  useEffect(() => {
    if (service) {
      form.reset({
        slug: service.slug,
        icon: service.icon,
        featuredImage: service.featuredImage,
        isPublished: service.isPublished,
        isFeatured: service.isFeatured,
        order: service.order,
        solutionKey: service.solutionKey,
        name: service.name,
        description: service.description,
        shortDescription: service.shortDescription,
        meta: {
          title: service.meta?.title || '',
          description: service.meta?.description || '',
          keywords: service.meta?.keywords || [],
        },
        subServices: service.subServices || [],
        gallery: service.gallery || [],
      });
    }
  }, [service, form]);

  const onSubmit = async (data: TEditServiceForm) => {
    const changedValues = getChangedValues(form.formState.defaultValues as TEditServiceForm, data);

    try {
      await update.mutateAsync({ id: Number(serviceId), data: changedValues });
      toast.success('Service updated successfully');
      router.push('/dashboard/services');
    } catch (error) {
      toast.error((error as Error)?.message || 'Failed to update service');
      console.error(error);
    }
  };

  if (isLoadingService) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (isErrorService || !service) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-2">Failed to load service</p>
          <Button onClick={() => refetchService()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

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

        <ResponseError error={update.error as unknown as Error} />

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/services')}
            disabled={update.isPending}
          >
            Cancel
          </Button>
          <LoadingButton
            isLoading={update.isPending}
            loadingText="Updating..."
            defaultText="Update Service"
          />
        </div>
      </form>
    </Form>
  );
}
