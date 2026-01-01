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
import { useBroadcastUnitById } from '@/hooks/api/broadcasts/useBroadcastUnitById';
import { useBroadcastUnitMutations } from '@/hooks/api/broadcasts/broadcast-unit-mutations';

import {
  updateBroadcastUnitSchema,
  type TUpdateBroadcastUnitForm,
} from '@/validations/broadcasts/update-broadcast-unit.schema';
import ResponseError from '@/components/shared/response-error';
import { BasicInformationSection } from './partials/basic-information-section';
import { StatusOptionsSection } from './partials/status-options-section';
import { ItemsSection } from './partials/items-section';
import { getChangedValues } from '@/utils/format';
import { MediaSelectInput } from '@/components/shared/input/MediaSelectInput';
import { MediaMultiSelectInput } from '@/components/shared/input/MediaMultiSelectInput';

interface EditBroadcastUnitFormProps {
  broadcastUnitId: string;
}

export function EditBroadcastUnitForm({ broadcastUnitId }: EditBroadcastUnitFormProps) {
  const router = useRouter();
  const { update } = useBroadcastUnitMutations();
  const {
    broadcastUnit,
    isLoading: isLoadingBroadcastUnit,
    isError: isErrorBroadcastUnit,
    refetch: refetchBroadcastUnit,
  } = useBroadcastUnitById(broadcastUnitId);

  const form = useForm<TUpdateBroadcastUnitForm>({
    resolver: zodResolver(updateBroadcastUnitSchema()) as Resolver<TUpdateBroadcastUnitForm>,
    defaultValues: {},
  });

  // Reset form when broadcast unit data is loaded
  useEffect(() => {
    if (broadcastUnit) {
      form.reset({
        type: broadcastUnit.type as any,
        slug: broadcastUnit.slug,
        title: broadcastUnit.title,
        summary: broadcastUnit.summary,
        description: broadcastUnit.description,
        coverImage: broadcastUnit.coverImage,
        gallery: Array.isArray(broadcastUnit.gallery) ? broadcastUnit.gallery : [],
        isPublished: broadcastUnit.isPublished,
        order: broadcastUnit.order,
        items: Array.isArray(broadcastUnit.items)
          ? (broadcastUnit.items.map(item => ({
              group: item.group,
              title: item.title,
              qty: item.qty,
              notes: item.notes,
              order: item.order,
            })) as TUpdateBroadcastUnitForm['items'])
          : [],
      });
    }
  }, [broadcastUnit, form]);

  const onSubmit = async (data: TUpdateBroadcastUnitForm) => {
    const changedValues = getChangedValues(form.formState.defaultValues as TUpdateBroadcastUnitForm, data);

    try {
      await update.mutateAsync({ id: Number(broadcastUnitId), data: changedValues });
      toast.success('Broadcast unit updated successfully');
      router.push('/dashboard/broadcast-units');
    } catch (error) {
      toast.error((error as Error)?.message || 'Failed to update broadcast unit');
      console.error(error);
    }
  };

  if (isLoadingBroadcastUnit) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (isErrorBroadcastUnit || !broadcastUnit) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-2">Failed to load broadcast unit</p>
          <Button onClick={() => refetchBroadcastUnit()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

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

        <ResponseError error={update.error as unknown as Error} />

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/broadcast-units')}
            disabled={update.isPending}
          >
            Cancel
          </Button>
          <LoadingButton
            isLoading={update.isPending}
            loadingText="Updating..."
            defaultText="Update Broadcast Unit"
          />
        </div>
      </form>
    </Form>
  );
}
