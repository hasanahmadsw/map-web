'use client';
import { zodResolver } from '@hookform/resolvers/zod';

import { useRouter } from 'next/navigation';

import { Resolver, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Form } from '@/components/ui/form';
import { useArticlesStaff } from '@/hooks/articles/useArticles';

import { BasicInformationSection } from './partial/basic-information-section';

import { FeaturedImageSection } from './partial/featured-image-section';
import { MetaInformationSection } from './partial/meta-information-section';
import { KeywordsSection } from './partial/keywords-section';
import { TagsTopicsSection } from './partial/tags-topics-section';
import { StatusOptionsSection } from './partial/status-options-section';

import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/shared/buttons/loading-button';
import { createArticleSchema, TCreateArticleForm } from '@/validations/articles/create-article.schema';
import ResponseError from '@/components/shared/response-error';
import { sanitizeDto } from '@/utils/format';

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
      // Convert comma-separated strings to arrays
      // const processStringArray = (str: string | string[] | undefined): string[] => {
      //   if (Array.isArray(str)) return str;
      //   if (typeof str === 'string') {
      //     return str
      //       .split(',')
      //       .map(item => item.trim())
      //       .filter(item => item.length > 0);
      //   }
      //   return [];
      // };

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

        {/* Primary visual content */}
        <FeaturedImageSection />

        {/* SEO and metadata */}
        <MetaInformationSection />

        {/* Search and categorization keywords */}
        <KeywordsSection />

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
