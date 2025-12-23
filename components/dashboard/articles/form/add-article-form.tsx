'use client';
import { zodResolver } from '@hookform/resolvers/zod';

import { useRouter } from 'next/navigation';

import { Resolver, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Form } from '@/components/ui/form';
import { useArticlesStaff } from '@/hooks/api/articles/useArticles';

import { BasicInformationSection } from './partial/basic-information-section';

import { MetaInformationSection } from './partial/meta-information-section';
import { TagsTopicsSection } from './partial/tags-topics-section';
import { StatusOptionsSection } from './partial/status-options-section';

import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/shared/buttons/loading-button';
import { createArticleSchema, TCreateArticleForm } from '@/validations/articles/create-article.schema';
import ResponseError from '@/components/shared/response-error';
import { sanitizeDto } from '@/utils/format';
import { MediaSelectInput } from '@/components/shared/input/MediaSelectInput';

export function AddArticleForm() {
  const router = useRouter();
  const { createArticle, isCreating, createError } = useArticlesStaff();

  const form = useForm<TCreateArticleForm>({
    resolver: zodResolver(createArticleSchema()) as Resolver<TCreateArticleForm>,
    defaultValues: {
      isPublished: false,
      isFeatured: false,
    },
  });

  const onSubmit = async (data: TCreateArticleForm) => {
    const santizedData = sanitizeDto(data) as TCreateArticleForm;

    try {
      await createArticle(santizedData);
      toast.success('Article created successfully');
      router.push('/dashboard/articles');
    } catch {
      toast.error(createError || 'Failed to create article');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Main article/product information */}
        <BasicInformationSection />

        {/* Featured image */}
        <MediaSelectInput control={form.control} name="image" label="Featured Image" typeFilter="image" />

        {/* SEO and metadata */}
        <MetaInformationSection />

        {/* Content classification tags */}
        <TagsTopicsSection />

        {/* Publishing and workflow status */}
        <StatusOptionsSection />

        <ResponseError error={createError as unknown as Error} />

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/articles')}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <LoadingButton isLoading={isCreating} loadingText="Creating..." defaultText="Create Article" />
        </div>
      </form>
    </Form>
  );
}
