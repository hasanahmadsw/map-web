"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { CheckboxInput } from "@/components/shared/input/CheckboxInput";
import { FileInput } from "@/components/shared/input/FileInput";
import { TextInput } from "@/components/shared/input/TextInput";
import { EntityTranslations } from "@/components/translations/translations";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useArticleStaffById, useArticlesStaff } from "@/hooks/useArticles";
import { useArticleTranslations } from "@/hooks/useArticleTranslations";
import { useTranslation } from "@/providers/translations-provider";
import {
  editArticleSchema,
  type TEditArticleForm,
} from "@/schemas/articles.schemas";

interface EditArticleFormProps {
  articleId: string;
}

export function EditArticleForm({ articleId }: EditArticleFormProps) {
  const { t } = useTranslation();
  const { updateArticle, isUpdating, updateError } = useArticlesStaff();
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
      isPublished: false,
      isFeatured: false,
      image: "",
      imageFile: undefined,
    },
  });

  // Reset form when article data is loaded
  useEffect(() => {
    if (article) {
      form.reset({
        slug: article.slug,
        isPublished: article.isPublished,
        isFeatured: article.isFeatured,
        image: article.image || "",
        imageFile: undefined,
      });
    }
  }, [article, form]);

  const onSubmit = async (
    data: z.input<ReturnType<typeof editArticleSchema>>
  ) => {
    try {
      // Exclude imageFile from the update data since it's not needed for API
      const { imageFile, ...updateData } = data;
      // Include image URL if present
      const payload = {
        ...updateData,
        image: data.image || null,
      };
      await updateArticle(Number(articleId), payload as unknown as TEditArticleForm);
      toast.success(t.common.success);
      refetchArticle(); // Refetch to get updated data
    } catch {
      toast.error(updateError || t.common.error);
    }
  };

  if (isLoadingArticle) {
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
    <Tabs defaultValue="article" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="article">
          {t.articles?.article || "Article Settings"}
        </TabsTrigger>
        <TabsTrigger value="translations">
          {"Translations"}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="article" className="space-y-6 pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                control={form.control}
                name="slug"
                label={t.articles.slug}
                placeholder={t.articles.slugPlaceholder}
              />
              <div></div>
            </div>

            <FileInput
              name="imageFile"
              label={t.articles.featuredImage}
              placeholder={t.articles.selectImage}
              accept="image/*"
              maxSize={10}
              autoUpload={true}
              uploadFieldName="image"
            />

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
      </TabsContent>

      <TabsContent value="translations" className="space-y-6 pt-6">
        <EntityTranslations
          entityId={Number(articleId)}
          entityType="article"
          hooks={articleTranslationsHooks}
          hasContent={true}
          hasMeta={true}
        />
      </TabsContent>
    </Tabs>
  );
}
