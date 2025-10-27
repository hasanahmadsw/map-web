"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { CheckboxInput } from "@/components/shared/input/CheckboxInput";
import { FileInput } from "@/components/shared/input/FileInput";
import { SearchableMultiSelectInput } from "@/components/shared/input/SearchableMultiSelectInput";
import { SelectInput } from "@/components/shared/input/SelectInput";
import { TextAreaInput } from "@/components/shared/input/TextAreaInput";
import { TextInput } from "@/components/shared/input/TextInput";
import { EntityTranslations } from "@/components/translations/translations";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useArticleStaffById, useArticlesStaff } from "@/hooks/useArticles";
import { useArticleTranslations } from "@/hooks/useArticleTranslations";
import { useLanguages } from "@/hooks/useLanguages";
import { useTranslation } from "@/providers/translations-provider";
import {
  editArticleSchema,
  type TEditArticleForm,
} from "@/schemas/articles.schemas";
import EditorFroala from "../shared/editor-froala";
import HtmlViewer from "../shared/html-viewer";
import { useLang } from "@/hooks/useLang";

interface EditArticleFormProps {
  articleId: string;
}

export function EditArticleForm({ articleId }: EditArticleFormProps) {
  const { t } = useTranslation();
  const lang = useLang();
  const { updateArticle, isUpdating, updateError } = useArticlesStaff();
  const { languages, isLoading: languagesLoading } = useLanguages();
  const {
    data: article,
    isLoading: isLoadingArticle,
    isError: isErrorArticle,
    error: errorArticle,
    refetch: refetchArticle,
  } = useArticleStaffById(Number(articleId));
  const articleTranslationsHooks = useArticleTranslations(Number(articleId));

  const form = useForm<z.input<ReturnType<typeof editArticleSchema>>>({
    resolver: zodResolver(editArticleSchema(t.validation)),
    defaultValues: {
      slug: "",
      name: "",
      content: "",
      excerpt: "",
      meta: {
        title: "",
        description: "",
        keywords: [],
      },
      languageCode: "en",
      isPublished: false,
      isFeatured: false,
      tags: "",
      topics: "",
      image: "",
      imageFile: undefined,
    },
  });

  // Reset form when article data is loaded
  useEffect(() => {
    if (article) {
      // Get the first translation for the form
      const firstTranslation = article.translations?.[0];
      if (firstTranslation) {
        form.reset({
          slug: article.slug,
          name: firstTranslation.name,
          content: firstTranslation.content,
          excerpt: firstTranslation.excerpt,
          meta: {
            title: firstTranslation.meta.title,
            description: firstTranslation.meta.description,
            keywords: firstTranslation.meta.keywords || [],
          },
          languageCode: firstTranslation.languageCode,
          isPublished: article.isPublished,
          isFeatured: article.isFeatured,
          tags: article.tags?.join(', ') || "",
          topics: article.topics?.join(', ') || "",
          image: article.image || "",
          imageFile: undefined,
        });
      }
    }
  }, [article, form]);

  const onSubmit = async (
    data: z.input<ReturnType<typeof editArticleSchema>>
  ) => {
    try {
      // Convert comma-separated strings to arrays
      const processStringArray = (str: string | string[] | undefined): string[] => {
        if (Array.isArray(str)) return str;
        if (typeof str === 'string') {
          return str.split(',').map(item => item.trim()).filter(item => item.length > 0);
        }
        return [];
      };

      // Exclude languageCode and imageFile from the update data since they're display-only/not needed for API
      const { languageCode, imageFile, ...updateData } = data;
      // Include image URL if present and convert tags/topics to arrays
      const payload = {
        ...updateData,
        image: data.image || null,
        tags: processStringArray(data.tags),
        topics: processStringArray(data.topics),
      };
      await updateArticle(Number(articleId), payload as unknown as TEditArticleForm);
      toast.success(t.common.success);
      refetchArticle(); // Refetch to get updated data
    } catch {
      toast.error(updateError || t.common.error);
    }
  };

  if (isLoadingArticle || languagesLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
        </div>
      </div>
    );
  }

  if (isErrorArticle || !article) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-center">
          <p className="text-destructive mb-2">
            {t.common.failedToLoad || "Failed to load article"}
          </p>
          <Button onClick={() => refetchArticle()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Article Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              control={form.control}
              name="name"
              label={t.articles.articleTitle}
              placeholder={t.articles.articleTitlePlaceholder}
              disabled={true}
            />
            <TextInput
              control={form.control}
              name="slug"
              label={t.articles.slug}
              placeholder={t.articles.slugPlaceholder}
            />
          </div>
          <HtmlViewer
            content={form.watch("content") || ""}
            label={t.articles.content}
            minHeight="min-h-[200px]"
          />

          <FileInput
            name="imageFile"
            label={t.articles.featuredImage}
            placeholder={t.articles.selectImage}
            accept="image/*"
            maxSize={10}
            autoUpload={true}
            uploadFieldName="image"
          />

          <HtmlViewer
            content={form.watch("excerpt") || ""}
            label={t.articles.excerpt}
            minHeight="min-h-[100px]"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              control={form.control}
              name="meta.title"
              label={t.articles.metaTitle}
              placeholder={t.articles.metaTitlePlaceholder}
              disabled={true}
            />
            <SelectInput
              control={form.control}
              name="languageCode"
              label={t.common.defaultLanguage}
              placeholder="Select a language"
              options={
                languages?.map((lang) => ({
                  value: lang.code,
                  label: `${lang.name} (${lang.code})`,
                })) || []
              }
            />
          </div>

          <TextAreaInput
            control={form.control}
            name="meta.description"
            label={t.articles.metaDescription}
            placeholder={t.articles.metaDescriptionPlaceholder}
            className="min-h-[80px]"
            rows={3}
            disabled={true}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextAreaInput
              control={form.control}
              name="tags"
              label={t.tags.title || "Tags"}
              placeholder="Enter tags separated by commas (e.g., technology, AI, innovation)"
              className="min-h-[80px]"
              rows={3}
            />
            <TextAreaInput
              control={form.control}
              name="topics"
              label={t.topics.title || "Topics"}
              placeholder="Enter topics separated by commas (e.g., politics, business, health)"
              className="min-h-[80px]"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CheckboxInput
              control={form.control}
              name="isPublished"
              label={t.articles.published}
              description={t.articles.publishedDescription}
              className="items-center rounded-lg border p-4"
            />
            <CheckboxInput
              control={form.control}
              name="isFeatured"
              label={t.articles.featured}
              description={t.articles.featuredDescription}
              className="items-center rounded-lg border p-4"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button type="submit" disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {isUpdating ? t.validation.updating : t.validation.update}
            </Button>
          </div>
        </form>
      </Form>

      {/* Translations Section */}
      <EntityTranslations
        entityId={Number(articleId)}
        entityType="article"
        hooks={articleTranslationsHooks}
        hasContent={true}
        hasMeta={true}
      />
    </div>
  );
}
