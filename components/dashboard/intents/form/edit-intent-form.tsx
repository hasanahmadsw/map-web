'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';

import { useIntentMutations } from '@/hooks/api/intents/mutations';
import { useIntentById } from '@/hooks/api/intents/use-intents';
import { updateIntentSchema, type TUpdateIntentForm } from '@/validations/intents/update-intent.schema';
import { LoadingButton } from '@/components/shared/buttons/loading-button';
import ResponseError from '@/components/shared/response-error';
import IntentFormFields from './intent-form-fields';
import FormSkeleton from '@/components/shared/skeletons/form-skeleton';

function EditIntentForm({ intentId }: { intentId: string }) {
  const router = useRouter();
  const { intent, isLoading } = useIntentById(intentId);
  const { update } = useIntentMutations();

  const form = useForm<TUpdateIntentForm>({
    resolver: zodResolver(updateIntentSchema()) as never,
  });

  useEffect(() => {
    if (intent) {
      const filters = intent.equipmentFilters;
      form.reset({
        slug: intent.slug,
        type: intent.type,
        parentId: intent.parentId != null ? String(intent.parentId) : '__none__',
        h1: intent.h1 ?? '',
        metaTitle: intent.metaTitle ?? '',
        metaDescription: intent.metaDescription ?? '',
        metaKeywords: intent.metaKeywords ?? '',
        subHeading: intent.subHeading ?? '',
        content: intent.content ?? '',
        linkLabel: intent.linkLabel ?? '',
        filterCategoryId: filters?.categoryId != null ? String(filters.categoryId) : '__none__',
        filterBrandId: filters?.brandId != null ? String(filters.brandId) : '__none__',
        filterEquipmentType: filters?.equipmentType ?? '__none__',
        filterIsFeatured: filters?.isFeatured ?? false,
        filterCategoryLabel: '',
        filterBrandLabel: '',
      });
    }
  }, [intent, form]);

  const onSubmit = async (data: TUpdateIntentForm) => {
    if (!intent) return;
    try {
      await update.mutateAsync({ id: intent.id, data });
      toast.success('Intent updated successfully');
      router.push('/dashboard/intents');
    } catch (error) {
      const errorMessage = (update.error as Error)?.message || 'Failed to update intent';
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return <FormSkeleton />;
  }

  if (!intent) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        Intent not found.
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Intent</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <IntentFormFields
              initialParentId={intent.parentId}
              excludeId={intent.id}
            />

            <Separator />

            <ResponseError error={update.error as Error} />

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={update.isPending}>
                Cancel
              </Button>
              <LoadingButton isLoading={update.isPending} loadingText="Saving..." defaultText="Save" />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default EditIntentForm;
