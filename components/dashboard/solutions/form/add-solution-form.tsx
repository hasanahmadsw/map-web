'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { Resolver, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/shared/buttons/loading-button';
import { useSolutionMutations } from '@/hooks/solutions/mutations';

import ResponseError from '@/components/shared/response-error';
import { BasicInformationSection } from './partials/basic-information-section';
import { MetaInformationSection } from './partials/meta-information-section';
import { KeywordsSection } from './partials/keywords-section';
import { StatusOptionsSection } from './partials/status-options-section';
import { createSolutionSchema, TCreateSolutionForm } from '@/validations/solutions/create-solution.schema';
import { sanitizeDto } from '@/utils/format';
import { MediaSelectInput } from '@/components/shared/input/MediaSelectInput';

export function AddSolutionForm() {
  const router = useRouter();
  const { create } = useSolutionMutations();

  const form = useForm<TCreateSolutionForm>({
    resolver: zodResolver(createSolutionSchema()) as Resolver<TCreateSolutionForm>,
    defaultValues: {
      isPublished: false,
      isFeatured: false,
      order: 0,

      meta: {
        keywords: [],
      },
    },
  });

  const onSubmit = async (data: TCreateSolutionForm) => {
    const santizedData = sanitizeDto(data) as TCreateSolutionForm;

    try {
      await create.mutateAsync(santizedData);
      toast.success('Solution created successfully');
      router.push('/dashboard/solutions');
    } catch {
      toast.error((create.error as Error | undefined)?.message || 'Failed to create solution');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Main solution information */}
        <BasicInformationSection />

        {/* Featured image */}
        <MediaSelectInput
          control={form.control}
          name="featuredImage"
          label="Featured Image"
          typeFilter="image"
        />

        {/* SEO and metadata */}
        <MetaInformationSection />

        {/* Search and categorization keywords */}
        <KeywordsSection />

        {/* Publishing and workflow status */}
        <StatusOptionsSection />

        <ResponseError error={create.error as unknown as Error} />

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/solutions')}
            disabled={create.isPending}
          >
            Cancel
          </Button>
          <LoadingButton
            isLoading={create.isPending}
            loadingText="Creating..."
            defaultText="Create Solution"
          />
        </div>
      </form>
    </Form>
  );
}
