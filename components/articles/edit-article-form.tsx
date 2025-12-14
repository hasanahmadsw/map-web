"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Image, Loader2, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { CheckboxInput } from "@/components/shared/input/CheckboxInput";
import { MediaPickerDialog } from "@/components/media/media-picker-dialog";
import { SelectInput } from "@/components/shared/input/SelectInput";
import { TextAreaInput } from "@/components/shared/input/TextAreaInput";
import { TextInput } from "@/components/shared/input/TextInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useArticleStaffById, useArticlesStaff } from "@/hooks/articles/useArticles";
import { useLanguages } from "@/hooks/useLanguages";
import { AiProvider } from "@/providers/ai-provider";
import { useTranslation } from "@/providers/translations-provider";
import {
  editArticleSchema,
  type TEditArticleForm,
} from "@/schemas/articles.schemas";
import ArticleEditor from "../editor";

interface EditArticleFormProps {
  articleId: string;
}

export function EditArticleForm({ articleId }: EditArticleFormProps) {
  const { t } = useTranslation();
  const { updateArticle, isUpdating, updateError } = useArticlesStaff();
  const { languages } = useLanguages();
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");
  const {
    data: article,
    isLoading: isLoadingArticle,
    isError: isErrorArticle,
    error: errorArticle,
    refetch: refetchArticle,
  } = useArticleStaffById(Number(articleId));

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
      form.reset({
        slug: article.slug,
        name: article.name,
        content: article.content,
        excerpt: article.excerpt,
        meta: {
          title: article.meta?.title || "",
          description: article.meta?.description || "",
          keywords: article.meta?.keywords || [],
        },
        languageCode: "en", // Default since we removed translations
        isPublished: article.isPublished,
        isFeatured: article.isFeatured,
        tags: Array.isArray(article.tags) ? article.tags.join(", ") : "",
        topics: Array.isArray(article.topics) ? article.topics.join(", ") : "",
        image: article.image || "",
        imageFile: undefined,
      });
    }
  }, [article, form]);

  const addKeyword = () => {
    const keyword = newKeyword.trim();
    if (keyword) {
      const currentKeywords = form.getValues("meta.keywords") || [];
      if (!currentKeywords.includes(keyword)) {
        form.setValue("meta.keywords", [...currentKeywords, keyword]);
      }
      setNewKeyword("");
    }
  };

  const removeKeyword = (keyword: string) => {
    const currentKeywords = form.getValues("meta.keywords") || [];
    form.setValue("meta.keywords", currentKeywords.filter((k: string) => k !== keyword));
  };

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

      // Exclude imageFile from the update data since it's not needed for API
      const { imageFile, ...updateData } = data;
      
      // Build payload with proper formatting
      const payload: any = {
        ...updateData,
        image: data.image || null,
      };

      // Process tags and topics if provided
      if (data.tags !== undefined) {
        payload.tags = processStringArray(data.tags);
      }
      if (data.topics !== undefined) {
        payload.topics = processStringArray(data.topics);
      }

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

        {/* Content Editor */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{t.articles.content}</label>
          <AiProvider>
            <ArticleEditor
              initialHTML={form.getValues("content") || ""}
              onChange={(html) => form.setValue("content", html, { shouldDirty: true })}
            />
          </AiProvider>
        </div>

        {/* Excerpt */}
        <TextAreaInput
          control={form.control}
          name="excerpt"
          label={t.articles.excerpt}
          placeholder={t.articles.excerptPlaceholder}
          className="min-h-[100px]"
        />

        {/* Featured Image */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{t.articles.featuredImage}</label>
          <div className="flex items-center gap-4">
            {form.watch("image") && (
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                <img
                  src={form.watch("image")}
                  alt="Featured"
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1 h-6 w-6 rounded-full p-0"
                  onClick={() => {
                    form.setValue("image", "", { shouldDirty: true });
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsMediaPickerOpen(true)}
            >
              <Image className="mr-2 h-4 w-4" />
              {form.watch("image") ? t.articles.selectImage : t.articles.featuredImage}
            </Button>
          </div>
        </div>

        <MediaPickerDialog
          open={isMediaPickerOpen}
          onOpenChange={setIsMediaPickerOpen}
          onSelect={(media) => {
            const selectedMedia = Array.isArray(media) ? media[0] : media;
            if (selectedMedia) {
              form.setValue("image", selectedMedia.url, { shouldDirty: true });
            }
          }}
          mode="single"
          filter="image"
          initialSelected={form.watch("image") ? [form.watch("image") as string] : []}
        />

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

        {/* Keywords */}
        <div className="space-y-2">
          <Label htmlFor="keywords">{t.common?.keywords || "Keywords"}</Label>
          <div className="flex gap-2">
            <Input
              id="keywords"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              placeholder={t.common?.addKeyword || "Add keyword"}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
              className="flex-1"
            />
            <Button type="button" onClick={addKeyword} variant="outline">
              {t.common?.add || "Add"}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {(form.watch("meta.keywords") || []).map((keyword: string) => (
              <Badge key={keyword} variant="secondary" className="flex items-center gap-1 text-xs">
                {keyword}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-destructive/20"
                  onClick={() => removeKeyword(keyword)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Tags and Topics */}
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

        {/* Status Options */}
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

        {/* Form Actions */}
        <div className="flex items-center gap-2">
          <Button type="submit" disabled={isUpdating}>
            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            {isUpdating ? t.validation.updating : t.validation.update}
          </Button>
        </div>
      </form>
    </Form>
  );
}
