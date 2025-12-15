'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import type { z } from 'zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/shared/buttons/loading-button';
import { useSolutionById } from '@/hooks/solutions/useSolutionById';
import { useSolutionMutations } from '@/hooks/solutions/mutations';
import { useTranslation } from '@/providers/translations-provider';
import {
  updateSolutionSchema,
  type TUpdateSolutionForm,
} from '@/validations/solutions/update-solution.schema';
import ResponseError from '@/components/shared/response-error';
import { BasicInformationSection } from './partials/basic-information-section';
import { FeaturedImageSection } from './partials/featured-image-section';
import { MetaInformationSection } from './partials/meta-information-section';
import { KeywordsSection } from './partials/keywords-section';
import { StatusOptionsSection } from './partials/status-options-section';
import { getChangedValues } from '@/utils/format';

interface EditSolutionFormProps {
  solutionId: string;
}

export function EditSolutionForm({ solutionId }: EditSolutionFormProps) {
  const router = useRouter();
  const { update } = useSolutionMutations();
  const {
    solution,
    isLoading: isLoadingSolution,
    isError: isErrorSolution,
    refetch: refetchSolution,
  } = useSolutionById(solutionId);

  const form = useForm<TUpdateSolutionForm>({
    resolver: zodResolver(updateSolutionSchema()) as Resolver<TUpdateSolutionForm>,
    defaultValues: {},
  });

  // Reset form when solution data is loaded
  useEffect(() => {
    if (solution) {
      form.reset({
        slug: solution.slug,
        icon: solution.icon,
        featuredImage: solution.featuredImage,
        isPublished: solution.isPublished,
        isFeatured: solution.isFeatured,
        order: solution.order,
        name: solution.name,
        description: solution.description,
        shortDescription: solution.shortDescription,
        meta: {
          title: solution.meta?.title || '',
          description: solution.meta?.description || '',
          keywords: solution.meta?.keywords || [],
        },
      });
    }
  }, [solution, form]);

  const onSubmit = async (data: TUpdateSolutionForm) => {
    const changedValues = getChangedValues(form.formState.defaultValues as TUpdateSolutionForm, data);

    try {
      await update.mutateAsync({ id: Number(solutionId), data: changedValues });
      toast.success('Solution updated successfully');
      router.push('/dashboard/solutions');
    } catch {
      toast.error((update.error as Error | undefined)?.message || 'Failed to update solution');
    }
  };

  if (isLoadingSolution) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (isErrorSolution || !solution) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-2">Failed to load solution</p>
          <Button onClick={() => refetchSolution()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Main solution information */}
        <BasicInformationSection />

        {/* Primary visual content */}
        <FeaturedImageSection />

        {/* SEO and metadata */}
        <MetaInformationSection />

        {/* Search and categorization keywords */}
        <KeywordsSection />

        {/* Publishing and workflow status */}
        <StatusOptionsSection />

        <ResponseError error={update.error as unknown as Error} />

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/solutions')}
            disabled={update.isPending}
          >
            Cancel
          </Button>
          <LoadingButton
            isLoading={update.isPending}
            loadingText="Updating..."
            defaultText="Update Solution"
          />
        </div>
      </form>
    </Form>
  );
}
