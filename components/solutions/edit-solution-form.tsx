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
import { TextInput } from "@/components/shared/input/TextInput";
import { EntityTranslations } from "@/components/translations/translations";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useSolutionStaffById, useSolutionsStaff } from "@/hooks/solutions/useSolutions";
import { useSolutionTranslations } from "@/hooks/solutions/useSolutionTranslations";
import { useTranslation } from "@/providers/translations-provider";
import {
  editSolutionSchema,
  type TEditSolutionForm,
} from "@/schemas/solutions.schemas";
import { solutionsService } from "@/services/solutions.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EditSolutionFormProps {
  solutionId: string;
}

export function EditSolutionForm({ solutionId }: EditSolutionFormProps) {
  const { t } = useTranslation();
  const { updateSolution, isUpdating, updateError } = useSolutionsStaff();
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const {
    data: solution,
    isLoading: isLoadingSolution,
    isError: isErrorSolution,
    refetch: refetchSolution,
  } = useSolutionStaffById(Number(solutionId));
  const solutionTranslationsHooks = useSolutionTranslations(Number(solutionId));

  const form = useForm<z.input<ReturnType<typeof editSolutionSchema>>>({
    resolver: zodResolver(editSolutionSchema(t.validation)),
    defaultValues: {
      slug: "",
      icon: "",
      featuredImage: "",
      isPublished: false,
      isFeatured: false,
      order: 0,
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
      });
    }
  }, [solution, form]);


  const onSubmit = async (
    data: z.input<ReturnType<typeof editSolutionSchema>>
  ) => {
    // Check if form has any changes
    if (!form.formState.isDirty) {
      toast.info("No changes detected. Please make some changes before updating.");
      return;
    }
    
    try {
      await updateSolution(Number(solutionId), data as TEditSolutionForm);
      toast.success(t.common?.success || "Solution updated successfully");
      refetchSolution(); // Refetch to get updated data
    } catch (error) {
      toast.error(updateError || t.common?.error || "Failed to update solution");
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
    <Tabs defaultValue="solution" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="solution">
          {t.solutions?.basicInformation || "Solution Settings"}
        </TabsTrigger>
        <TabsTrigger value="translations">
          {"Translations"}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="solution" className="space-y-6">
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
                    name="slug"
                    label={t.solutions?.slug || "Slug"}
                    placeholder={t.solutions?.slugPlaceholder || "solution-slug"}
                  />
                  <IconSelectInput
                    name="icon"
                    label={t.solutions?.icon || "Icon"}
                    placeholder={t.solutions?.iconPlaceholder || "Select an icon"}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextInput
                    control={form.control}
                    name="order"
                    label={t.solutions?.order || "Order"}
                    placeholder="0"
                    type="number"
                  />
                
                </div>
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
              <Button type="submit" disabled={isUpdating || !form.formState.isDirty}>
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                {isUpdating ? t.validation?.updating || "Updating..." : t.validation?.update || "Update"}
              </Button>
            </div>
          </form>
        </Form>
      </TabsContent>

      <TabsContent value="translations" className="space-y-6">
        <EntityTranslations
          entityId={Number(solutionId)}
          entityType="solution"
          hooks={solutionTranslationsHooks}
          hasContent={false}
          hasMeta={true}
          hasSubServices={false}
        />
      </TabsContent>
    </Tabs>
  );
}
