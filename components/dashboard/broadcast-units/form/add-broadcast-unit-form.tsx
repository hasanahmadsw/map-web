'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { Resolver, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/shared/buttons/loading-button';
import { useBroadcastUnitMutations } from '@/hooks/api/broadcasts/broadcast-unit-mutations';

import ResponseError from '@/components/shared/response-error';
import { BasicInformationSection } from './partials/basic-information-section';
import { StatusOptionsSection } from './partials/status-options-section';
import { ItemsSection } from './partials/items-section';
import {
  createBroadcastUnitSchema,
  type TCreateBroadcastUnitForm,
} from '@/validations/broadcasts/create-broadcast-unit.schema';
import { sanitizeDto } from '@/utils/format';
import { MediaSelectInput } from '@/components/shared/input/MediaSelectInput';
import { MediaMultiSelectInput } from '@/components/shared/input/MediaMultiSelectInput';

export function AddBroadcastUnitForm() {
  const router = useRouter();
  const { create } = useBroadcastUnitMutations();

  const form = useForm<TCreateBroadcastUnitForm>({
    resolver: zodResolver(createBroadcastUnitSchema()) as Resolver<TCreateBroadcastUnitForm>,
    defaultValues: {
      isPublished: false,
      gallery: [],
      items: [],
    },
  });

  const onSubmit = async (data: TCreateBroadcastUnitForm) => {
    const sanitizedData = sanitizeDto(data) as TCreateBroadcastUnitForm;

    try {
      await create.mutateAsync(sanitizedData);
      toast.success('Broadcast unit created successfully');
      router.push('/dashboard/broadcast-units');
    } catch (error) {
      toast.error((error as Error)?.message || 'Failed to create broadcast unit');
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Main broadcast unit information */}
        <BasicInformationSection />

        {/* Cover image */}
        <MediaSelectInput control={form.control} name="coverImage" label="Cover Image" typeFilter="image" />

        {/* Gallery */}
        <MediaMultiSelectInput control={form.control} name="gallery" label="Gallery" typeFilter="image" />

        {/* Items */}
        <ItemsSection />

        {/* Publishing status */}
        <StatusOptionsSection />

        <ResponseError error={create.error as unknown as Error} />

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/broadcast-units')}
            disabled={create.isPending}
          >
            Cancel
          </Button>
          <LoadingButton
            isLoading={create.isPending}
            loadingText="Creating..."
            defaultText="Create Broadcast Unit"
          />
        </div>
      </form>
    </Form>
  );
}
