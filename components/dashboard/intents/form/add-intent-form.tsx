'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';

import { useIntentMutations } from '@/hooks/api/intents/mutations';
import { createIntentSchema, type TCreateIntentForm } from '@/validations/intents/create-intent.schema';
import { LoadingButton } from '@/components/shared/buttons/loading-button';
import ResponseError from '@/components/shared/response-error';
import IntentFormFields from './intent-form-fields';

function AddIntentForm() {
  const router = useRouter();
  const { create } = useIntentMutations();

  const form = useForm<TCreateIntentForm>({
    resolver: zodResolver(createIntentSchema()) as never,
    defaultValues: {
      parentId: '__none__',
      filterCategoryId: '__none__',
      filterBrandId: '__none__',
      filterEquipmentType: '__none__',
      filterCategoryLabel: '',
      filterBrandLabel: '',
    },
  });

  const onSubmit = async (data: TCreateIntentForm) => {
    try {
      await create.mutateAsync(data);
      toast.success('Intent created successfully');
      router.push('/dashboard/intents');
    } catch (error) {
      const errorMessage = (create.error as Error)?.message || 'Failed to create intent';
      toast.error(errorMessage);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Intent</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <IntentFormFields />

            <Separator />

            <ResponseError error={create.error as Error} />

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={create.isPending}>
                Cancel
              </Button>
              <LoadingButton isLoading={create.isPending} loadingText="Adding..." defaultText="Add Intent" />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default AddIntentForm;
