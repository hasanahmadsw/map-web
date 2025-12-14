"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Image, Loader2, Save, X } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useSolutionById } from "@/hooks/solutions/useSolutionById";
import { useSolutionMutations } from "@/hooks/solutions/mutations";
import { useLanguages } from "@/hooks/useLanguages";
import { useTranslation } from "@/providers/translations-provider";
import {
  editSolutionSchema,
  type TEditSolutionForm,
} from "@/schemas/solutions.schemas";
import { solutionsService } from "@/services/solutions.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface EditSolutionFormProps {
  solutionId: string;
}

export function EditSolutionForm({ solutionId }: EditSolutionFormProps) {
  const { t } = useTranslation();
  const { update } = useSolutionMutations();
  const { languages } = useLanguages();
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");
  const {
    solution,
    isLoading: isLoadingSolution,
    isError: isErrorSolution,
    refetch: refetchSolution,
  } = useSolutionById(solutionId);

  const form = useForm<z.input<ReturnType<typeof editSolutionSchema>>>({
    resolver: zodResolver(editSolutionSchema(t.validation)),
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
    },
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
          title: solution.meta?.title || "",
          description: solution.meta?.description || "",
          keywords: solution.meta?.keywords || [],
        },
        languageCode: "en", // Default since translations were removed
      });
    }
  }, [solution, form]);

  const addKeyword = () => {
    const keyword = newKeyword.trim();
    if (keyword) {
      const currentKeywords = form.getValues("meta.keywords") || [];
      if (!currentKeywords.includes(keyword)) {
        form.setValue("meta.keywords", [...currentKeywords, keyword], { shouldDirty: true });
      }
      setNewKeyword("");
    }
  };

  const removeKeyword = (keyword: string) => {
    const currentKeywords = form.getValues("meta.keywords") || [];
    form.setValue("meta.keywords", currentKeywords.filter((k: string) => k !== keyword), { shouldDirty: true });
  };


  const onSubmit = async (
    data: z.input<ReturnType<typeof editSolutionSchema>>
  ) => {
    // Check if form has any changes
    if (!form.formState.isDirty) {
      toast.info("No changes detected. Please make some changes before updating.");
      return;
    }
    
    try {
      // Transform order to number if it exists and ensure it's a valid integer >= 0
      let orderValue: number | undefined = undefined;
      if (data.order !== undefined && data.order !== null) {
        const parsed = typeof data.order === "string" 
          ? Number.parseInt(data.order, 10)
          : typeof data.order === "number"
          ? Math.floor(data.order)
          : undefined;
        
        if (parsed !== undefined && !isNaN(parsed) && parsed >= 0) {
          orderValue = parsed;
        } else if (parsed !== undefined) {
          toast.error("Order must be a non-negative integer");
          return;
        }
      }

      const payload: TEditSolutionForm = {
        ...data,
        order: orderValue,
      } as TEditSolutionForm;

      await update.mutateAsync({ id: Number(solutionId), data: payload });
      toast.success(t.validation?.updatedSuccessfully || "Solution updated successfully");
      refetchSolution(); // Refetch to get updated data
    } catch (error) {
      const errorMessage = (update.error as Error | undefined)?.message || t.validation?.failedToUpdate || "Failed to update solution";
      toast.error(errorMessage);
    }
  };

  if (isLoadingSolution) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
        </div>
      </div>
    );
  }

  if (isErrorSolution || !solution) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-center">
          <p className="text-destructive mb-2">
            {t.common?.failedToLoad || "Failed to load solution"}
          </p>
          <Button onClick={() => refetchSolution()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                            form.setValue("featuredImage", "", { shouldDirty: true });
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
                      form.setValue("featuredImage", selectedMedia.url, { shouldDirty: true });
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
                    className="items-center rounded-lg border p-4"
                  />
                  <CheckboxInput
                    control={form.control}
                    name="isFeatured"
                    label={t.solutions?.featured || "Featured"}
                    description={t.solutions?.featuredDescription || "Mark this solution as featured"}
                    className="items-center rounded-lg border p-4"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center gap-2">
              <Button type="submit" disabled={update.isPending || !form.formState.isDirty}>
                {update.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                {update.isPending ? t.validation?.updating || "Updating..." : t.validation?.update || "Update"}
              </Button>
            </div>
          </form>
        </Form>
    </div>
  );
}
