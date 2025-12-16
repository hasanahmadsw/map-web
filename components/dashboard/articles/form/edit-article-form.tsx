'use client';
import { zodResolver } from '@hookform/resolvers/zod';

import { useRouter } from 'next/navigation';

import { Resolver, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

import { Form } from '@/components/ui/form';
import { useArticleStaffById, useArticlesStaff } from '@/hooks/articles/useArticles';

import { BasicInformationSection } from './partial/basic-information-section';

import { MetaInformationSection } from './partial/meta-information-section';
import { TagsTopicsSection } from './partial/tags-topics-section';
import { StatusOptionsSection } from './partial/status-options-section';

import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/shared/buttons/loading-button';
import { updateArticleSchema, TUpdateArticleForm } from '@/validations/articles/update-article.schema';
import ResponseError from '@/components/shared/response-error';
import { getChangedValues } from '@/utils/format';
import { MediaSelectInput } from '@/components/shared/input/MediaSelectInput';

interface EditArticleFormProps {
  articleId: string;
}

export function EditArticleForm({ articleId }: EditArticleFormProps) {
  const router = useRouter();
  const { updateArticle, isUpdating, updateError } = useArticlesStaff();
  const {
    data: article,
    isLoading: isLoadingArticle,
    isError: isErrorArticle,
    error: errorArticle,
    refetch: refetchArticle,
  } = useArticleStaffById(Number(articleId));

  const form = useForm<TUpdateArticleForm>({
    resolver: zodResolver(updateArticleSchema()) as Resolver<TUpdateArticleForm>,
  });

  // Reset form when article data is loaded
  useEffect(() => {
    if (article) {
      form.reset({
        slug: article.slug,
        name: article.name,
        content: article.content,
        excerpt: article.excerpt,
        meta: {
          title: article.meta?.title || '',
          description: article.meta?.description || '',
          keywords: article.meta?.keywords || [],
        },
        isPublished: article.isPublished,
        isFeatured: article.isFeatured,
        tags: article?.tags || [],
        topics: article?.topics || [],
        image: article.image || '',
      });
    }
  }, [article, form]);

  const onSubmit = async (data: TUpdateArticleForm) => {
    const changedValues = getChangedValues(form.formState.defaultValues as TUpdateArticleForm, data);

    try {
      await updateArticle(Number(articleId), changedValues);
      toast.success('Article updated successfully');
      router.push('/dashboard/articles');
    } catch {
      toast.error(updateError || 'Failed to update article');
    }
  };

  if (isLoadingArticle) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (isErrorArticle || !article) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-2">{errorArticle?.message || 'Failed to load article'}</p>
          <Button onClick={() => refetchArticle()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

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

        <ResponseError error={updateError as unknown as Error} />

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/articles')}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <LoadingButton isLoading={isUpdating} loadingText="Updating..." defaultText="Update Article" />
        </div>
      </form>
    </Form>
  );
}
