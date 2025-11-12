"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image, Loader2, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { CheckboxInput } from "@/components/shared/input/CheckboxInput";
import { FileInput } from "@/components/shared/input/FileInput";
import { MediaPickerDialog } from "@/components/media/media-picker-dialog";
import { IconSelectInput } from "@/components/shared/input/IconSelectInput";
import { SelectInput } from "@/components/shared/input/SelectInput";
import { TextAreaInput } from "@/components/shared/input/TextAreaInput";
import { TextInput } from "@/components/shared/input/TextInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useSolutionMutations } from "@/hooks/solutions/mutations";
import { useLanguages } from "@/hooks/useLanguages";
import { useTranslation } from "@/providers/translations-provider";
import { createSolutionSchema, type TCreateSolutionForm } from "@/schemas/solutions.schemas";
import { solutionsService } from "@/services/solutions.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AddSolutionForm() {
  const router = useRouter();
  const { create } = useSolutionMutations();
  const { languages, isLoading: languagesLoading } = useLanguages();
  const { t } = useTranslation();
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const form = useForm<z.input<ReturnType<typeof createSolutionSchema>>>({
    resolver: zodResolver(createSolutionSchema(t.validation)),
    defaultValues: {
      slug: "",
      icon: "",
      featuredImage: "",
      isPublished: false,
      isFeatured: false,
      order: 0,
      name: "",
      description: "",
      shortDescription: "",
      meta: {
        title: "",
        description: "",
        keywords: [],
      },
      languageCode: "en",
      translateTo: [],
    },
  });

  // Auto-select all languages when they become available
  useEffect(() => {
    if (languages && languages.length > 0 && (form.getValues("translateTo")?.length ?? 0) === 0) {
      const allLanguageCodes = languages.map((lang) => lang.code);
      form.setValue("translateTo", allLanguageCodes);
    }
  }, [languages, form]);

  const onSubmit = async (data: z.input<ReturnType<typeof createSolutionSchema>>) => {
    try {
      // Transform order to number and ensure it's a valid integer >= 0
      let orderValue = 0;
      if (data.order !== undefined && data.order !== null) {
        const parsed = typeof data.order === "string" 
          ? Number.parseInt(data.order, 10)
          : typeof data.order === "number"
          ? Math.floor(data.order)
          : 0;
        
        if (!isNaN(parsed) && parsed >= 0) {
          orderValue = parsed;
        } else {
          toast.error("Order must be a non-negative integer");
          return;
        }
      }

      // Create solution payload
      const solutionPayload = {
        slug: data.slug,
        icon: data.icon,
        featuredImage: data.featuredImage,
        isPublished: data.isPublished ?? false,
        isFeatured: data.isFeatured ?? false,
        order: orderValue,
        name: data.name,
        description: data.description,
        shortDescription: data.shortDescription,
        meta: {
          title: data.meta.title,
          description: data.meta.description,
          keywords: data.meta.keywords || [],
        },
        languageCode: data.languageCode,
        translateTo: data.translateTo || [],
      };

      await create.mutateAsync(solutionPayload as TCreateSolutionForm);
      toast.success(t.validation?.createdSuccessfully || "Solution created successfully");
      router.push("/dashboard/solutions");
    } catch (error) {
      const errorMessage = (create.error as Error | undefined)?.message || t.validation?.failedToCreate || "Failed to create solution";
      toast.error(errorMessage);
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
        <Card>
          <CardHeader>
            <CardTitle>{t.solutions?.basicInformation || "Basic Information"}</CardTitle>
            <CardDescription>
              {t.solutions?.basicInformationDescription || "Enter the basic solution information."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                control={form.control}
                name="name"
                label={t.solutions?.solutionName || "Solution Name"}
                placeholder={t.solutions?.solutionNamePlaceholder || "Enter solution name"}
              />
              <TextInput
                control={form.control}
                name="slug"
                label={t.solutions?.slug || "Slug"}
                placeholder={t.solutions?.slugPlaceholder || "solution-slug"}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <IconSelectInput
                name="icon"
                label={t.solutions?.icon || "Icon"}
                placeholder={t.solutions?.iconPlaceholder || "Select an icon"}
              />
              <TextInput
                control={form.control}
                name="order"
                label={t.solutions?.order || "Order"}
                placeholder="0"
                type="number"
              />
            </div>

            <TextAreaInput
              control={form.control}
              name="description"
              label={t.solutions?.description || "Description"}
              placeholder={t.solutions?.descriptionPlaceholder || "Enter solution description"}
              className="min-h-[100px]"
            />

            <TextAreaInput
              control={form.control}
              name="shortDescription"
              label={t.solutions?.shortDescription || "Short Description"}
              placeholder={t.solutions?.shortDescriptionPlaceholder || "Enter short description"}
              className="min-h-[80px]"
            />
          </CardContent>
        </Card>

        {/* Featured Image */}
        <Card>
          <CardHeader>
            <CardTitle>{t.solutions?.featuredImage || "Featured Image"}</CardTitle>
            <CardDescription>
              {t.solutions?.featuredImageDescription || "Upload a featured image for this solution."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.solutions?.featuredImage || "Featured Image"}</label>
              <div className="flex items-center gap-4">
                {form.watch("featuredImage") && (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                    <img
                      src={form.watch("featuredImage") as string}
                      alt="Featured"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 rounded-full p-0"
                      onClick={() => {
                        form.setValue("featuredImage", "");
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
                  {form.watch("featuredImage") ? t.solutions?.selectImage || "Select Image" : t.solutions?.featuredImage || "Featured Image"}
                </Button>
              </div>
            </div>

            <MediaPickerDialog
              open={isMediaPickerOpen}
              onOpenChange={setIsMediaPickerOpen}
              onSelect={(media) => {
                const selectedMedia = Array.isArray(media) ? media[0] : media;
                if (selectedMedia) {
                  form.setValue("featuredImage", selectedMedia.url);
                }
              }}
              mode="single"
              filter="image"
              initialSelected={form.watch("featuredImage") ? [form.watch("featuredImage") as string] : []}
            />
          </CardContent>
        </Card>

        {/* Meta Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t.solutions?.metaInformation || "Meta Information"}</CardTitle>
            <CardDescription>
              {t.solutions?.metaInformationDescription || "SEO and meta information for this solution."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                control={form.control}
                name="meta.title"
                label={t.solutions?.metaTitle || "Meta Title"}
                placeholder={t.solutions?.metaTitlePlaceholder || "Enter meta title"}
              />
              <SelectInput
                control={form.control}
                name="languageCode"
                label={t.common?.defaultLanguage || "Default Language"}
                placeholder={t.common?.selectLanguage || "Select a language"}
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
              label={t.solutions?.metaDescription || "Meta Description"}
              placeholder={t.solutions?.metaDescriptionPlaceholder || "Enter meta description"}
              className="min-h-[80px]"
            />
          </CardContent>
        </Card>

        {/* Status Options */}
        <Card>
          <CardHeader>
            <CardTitle>{t.solutions?.statusOptions || "Status Options"}</CardTitle>
            <CardDescription>
              {t.solutions?.statusOptionsDescription || "Configure the solution status and visibility."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CheckboxInput
                control={form.control}
                name="isPublished"
                label={t.solutions?.published || "Published"}
                description={t.solutions?.publishedDescription || "Make this solution visible to the public"}
                className="rounded-lg border p-4 items-center"
              />
              <CheckboxInput
                control={form.control}
                name="isFeatured"
                label={t.solutions?.featured || "Featured"}
                description={t.solutions?.featuredDescription || "Mark this solution as featured"}
                className="rounded-lg border p-4 items-center"
              />
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/solutions")}
            disabled={create.isPending}
          >
            {t.common?.cancel || "Cancel"}
          </Button>
          <Button type="submit" disabled={create.isPending}>
            {create.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            {create.isPending ? t.common?.creating || "Creating..." : t.common?.adding || "Add Solution"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
