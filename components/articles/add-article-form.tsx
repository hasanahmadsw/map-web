"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useArticlesStaff } from "@/hooks/useArticles";
import { useLanguages } from "@/hooks/useLanguages";
import { AiProvider } from "@/providers/ai-provider";
import { useTranslation } from "@/providers/translations-provider";
import { createArticleSchema, type TCreateArticleForm } from "@/schemas/articles.schemas";
import ArticleEditor from "../editor";

export function AddArticleForm() {
  const router = useRouter();
  const { createArticle, isCreating, createError } = useArticlesStaff();
  const { languages, isLoading: languagesLoading } = useLanguages(); // Get all languages
  const { t } = useTranslation();

  const form = useForm<z.input<ReturnType<typeof createArticleSchema>>>({
    resolver: zodResolver(createArticleSchema(t.articles)),
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
      translateTo: [],
      image: "",
      imageFile: undefined,
    },
  });

  // Auto-select all languages when they become available
  useEffect(() => {
    if (languages && languages.length > 0 && (form.getValues("translateTo")?.length ?? 0) === 0) {
      const allLanguageCodes = languages.map((lang) => lang.code);
      form.setValue("translateTo", allLanguageCodes);
    }
  }, [languages, form]);

  const onSubmit = async (data: z.input<ReturnType<typeof createArticleSchema>>) => {
    try {
      // Convert comma-separated strings to arrays
      const processStringArray = (str: string | string[] | undefined): string[] => {
        if (Array.isArray(str)) return str;
        if (typeof str === 'string') {
          return str.split(',').map(item => item.trim()).filter(item => item.length > 0);
        }
        return [];
      };

      // Create article payload with image URL
      const articlePayload = {
        slug: data.slug,
        name: data.name,
        content: data.content,
        excerpt: data.excerpt,
        meta: {
          title: data.meta.title,
          description: data.meta.description,
          keywords: data.meta.keywords || [],
        },
        languageCode: data.languageCode,
        isPublished: data.isPublished ?? false,
        isFeatured: data.isFeatured ?? false,
        tags: processStringArray(data.tags),
        topics: processStringArray(data.topics),
        translateTo: data.translateTo || [],
        image: data.image || null, // Send the uploaded image URL
      };

      await createArticle(articlePayload as unknown as TCreateArticleForm);
      toast.success(t.validation.createdSuccessfully);
      router.push("/dashboard/articles");
    } catch {
      toast.error(createError || t.validation.failedToCreate);
    }
  };

  if (languagesLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Loading languages...</p>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            control={form.control}
            name="name"
            label={t.articles.articleTitle}
            placeholder={t.articles.articleTitlePlaceholder}
          />
          <TextInput
            control={form.control}
            name="slug"
            label={t.articles.slug}
            placeholder={t.articles.slugPlaceholder}
          />
        </div>

        {/* <TextAreaInput
          control={form.control}
          name="excerpt"
          label={t.articles.excerpt}
          placeholder={t.articles.excerptPlaceholder}
          className="min-h-[100px]"
        /> */}
        {/* <ArticleEditor initialHTML={form.getValues("content")} onChange={(html) => form.setValue("content", html)} /> */}

        <div className="justify-left">
          <AiProvider>
            <ArticleEditor
              initialHTML={form.getValues("content")}
              onChange={(html) => form.setValue("content", html)}
            />
          </AiProvider>
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

        {/* <TextAreaInput
          control={form.control}
          name="content"
          label={t.articles.content}
          placeholder={t.articles.contentPlaceholder}
          className="min-h-[200px]"
        /> */}

        {/* Meta Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            control={form.control}
            name="meta.title"
            label={t.articles.metaTitle}
            placeholder={t.articles.metaTitlePlaceholder}
          />
          <SelectInput
            control={form.control}
            name="languageCode"
            label={t.common.defaultLanguage}
            placeholder={t.common.selectLanguage}
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
          className="min-h-[100px]"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tags Input */}
          <TextAreaInput
            control={form.control}
            name="tags"
            label={t.tags.title || "Tags"}
            placeholder="Enter tags separated by commas (e.g., technology, AI, innovation)"
            className="min-h-[80px]"
            rows={3}
          />

          {/* Topics Input */}
          <TextAreaInput
            control={form.control}
            name="topics"
            label={t.topics.title || "Topics"}
            placeholder="Enter topics separated by commas (e.g., politics, business, health)"
            className="min-h-[80px]"
            rows={3}
          />
        </div>
        {/* Status Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CheckboxInput
            control={form.control}
            name="isPublished"
            label={t.articles.published}
            description={t.articles.publishedDescription}
            className="rounded-lg border p-4 items-center"
          />
          <CheckboxInput
            control={form.control}
            name="isFeatured"
            label={t.articles.featured}
            description={t.articles.featuredDescription}
            className="rounded-lg border p-4 items-center"
          />
        </div>

        {/* Form Actions */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/articles")}
            disabled={isCreating}
          >
            {t.common.cancel}
          </Button>
          <Button type="submit" disabled={isCreating}>
            {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            {isCreating ? t.common.creating : t.common.adding}
          </Button>
        </div>
      </form>
    </Form>
  );
}
