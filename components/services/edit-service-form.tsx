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
import { SearchableMultiSelectInput } from "@/components/shared/input/SearchableMultiSelectInput";
import { SelectInput } from "@/components/shared/input/SelectInput";
import { SubServicesInput } from "@/components/shared/input/SubServicesInput";
import { TextAreaInput } from "@/components/shared/input/TextAreaInput";
import { TextInput } from "@/components/shared/input/TextInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useServiceById } from "@/hooks/services/useServiceById";
import { useServiceMutations } from "@/hooks/services/mutations";
import { useSolutionsStaff } from "@/hooks/solutions/useSolutionsStaff";
import { useLanguages } from "@/hooks/useLanguages";
import { useTranslation } from "@/providers/translations-provider";
import {
  editServiceSchema,
  type TEditServiceForm,
} from "@/schemas/services.schemas";
import { servicesService } from "@/services/services.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { StaffSolution } from "@/types/solutions.types";

interface EditServiceFormProps {
  serviceId: string;
}

export function EditServiceForm({ serviceId }: EditServiceFormProps) {
  const { t } = useTranslation();
  const { update } = useServiceMutations();
  const { languages } = useLanguages();
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");
  const {
    service,
    isLoading: isLoadingService,
    isError: isErrorService,
    refetch: refetchService,
  } = useServiceById(serviceId);
  const { solutions, isLoading: solutionsLoading } = useSolutionsStaff({ limit: 100 });

  const form = useForm<z.input<ReturnType<typeof editServiceSchema>>>({
    resolver: zodResolver(editServiceSchema(t.validation)),
    defaultValues: {
      slug: "",
      icon: "",
      featuredImage: "",
      isPublished: false,
      isFeatured: false,
      order: 0,
      solutionIds: [],
      name: "",
      description: "",
      shortDescription: "",
      meta: {
        title: "",
        description: "",
        keywords: [],
      },
      subServices: [],
      languageCode: "en",
    },
  });

  // Reset form when service data is loaded
  useEffect(() => {
    if (service) {
      // Extract solution IDs from the solutions array
      const serviceSolutions = service.solutions || [];
      const solutionIds = Array.isArray(serviceSolutions)
        ? serviceSolutions.map((sol) => (typeof sol === 'object' && sol !== null ? sol.id : sol)).filter((id): id is number => typeof id === 'number')
        : [];

      form.reset({
        slug: service.slug,
        icon: service.icon,
        featuredImage: service.featuredImage,
        isPublished: service.isPublished,
        isFeatured: service.isFeatured,
        order: service.order,
        solutionIds: solutionIds,
        name: service.name,
        description: service.description,
        shortDescription: service.shortDescription,
        meta: {
          title: service.meta?.title || "",
          description: service.meta?.description || "",
          keywords: service.meta?.keywords || [],
        },
        subServices: service.subServices || [],
        languageCode: "en", // Default since translations were removed
      });
    }
  }, [service, form]);

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
    data: z.input<ReturnType<typeof editServiceSchema>>
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

      const payload: TEditServiceForm = {
        ...data,
        order: orderValue,
      } as TEditServiceForm;

      await update.mutateAsync({ id: Number(serviceId), data: payload });
      toast.success(t.validation?.updatedSuccessfully || "Service updated successfully");
      refetchService(); // Refetch to get updated data
    } catch (error) {
      const errorMessage = (update.error as Error | undefined)?.message || t.validation?.failedToUpdate || "Failed to update service";
      toast.error(errorMessage);
    }
  };

  if (isLoadingService) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
        </div>
      </div>
    );
  }

  if (isErrorService || !service) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-center">
          <p className="text-destructive mb-2">
            {t.common?.failedToLoad || "Failed to load service"}
          </p>
          <Button onClick={() => refetchService()} variant="outline">
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
                <CardTitle>{t.services?.basicInformation || "Basic Information"}</CardTitle>
                <CardDescription>
                  {t.services?.basicInformationDescription || "Enter the basic service information."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextInput
                    control={form.control}
                    name="name"
                    label={t.services?.serviceName || "Service Name"}
                    placeholder={t.services?.serviceNamePlaceholder || "Enter service name"}
                  />
                  <TextInput
                    control={form.control}
                    name="slug"
                    label={t.services?.slug || "Slug"}
                    placeholder={t.services?.slugPlaceholder || "service-slug"}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <IconSelectInput
                    name="icon"
                    label={t.services?.icon || "Icon"}
                    placeholder={t.services?.iconPlaceholder || "Select an icon"}
                  />
                  <TextInput
                    control={form.control}
                    name="order"
                    label={t.services?.order || "Order"}
                    placeholder="0"
                    type="number"
                  />
                </div>

                <TextAreaInput
                  control={form.control}
                  name="description"
                  label={t.services?.description || "Description"}
                  placeholder={t.services?.descriptionPlaceholder || "Enter service description"}
                  className="min-h-[100px]"
                />

                <TextAreaInput
                  control={form.control}
                  name="shortDescription"
                  label={t.services?.shortDescription || "Short Description"}
                  placeholder={t.services?.shortDescriptionPlaceholder || "Enter short description"}
                  className="min-h-[80px]"
                />
              </CardContent>
            </Card>

            {/* Featured Image */}
            <Card>
              <CardHeader>
                <CardTitle>{t.services?.featuredImage || "Featured Image"}</CardTitle>
                <CardDescription>
                  {t.services?.featuredImageDescription || "Upload a featured image for this service."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.services?.featuredImage || "Featured Image"}</label>
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
                      {form.watch("featuredImage") ? t.services?.selectImage || "Select Image" : t.services?.featuredImage || "Featured Image"}
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

            {/* Sub Services */}
            <SubServicesInput
              control={form.control}
              name="subServices"
              label={t.services?.subServices || "Sub Services"}
              description={t.services?.subServicesDescription || "Add sub-services for this service."}
            />

            {/* Solutions */}
            <Card>
              <CardHeader>
                <CardTitle>{t.services?.solutions || "Solutions"}</CardTitle>
                <CardDescription>
                  {t.services?.solutionsDescription || "Select solutions related to this service."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SearchableMultiSelectInput
                  control={form.control}
                  name="solutionIds"
                  label={t.services?.solutions || "Solutions"}
                  description={t.services?.solutionsDescription || "Select solutions related to this service."}
                  placeholder={t.services?.selectSolutions || "Select solutions"}
                  searchPlaceholder={t.services?.searchSolutions || "Search solutions..."}
                  emptyMessage={t.services?.noSolutionsFound || "No solutions found"}
                  options={solutions.map((solution: StaffSolution) => ({
                    id: solution.id,
                    name: solution.name,
                  }))}
                  disabled={solutionsLoading}
                />
              </CardContent>
            </Card>

            {/* Meta Information */}
            <Card>
              <CardHeader>
                <CardTitle>{t.services?.metaInformation || "Meta Information"}</CardTitle>
                <CardDescription>
                  {t.services?.metaInformationDescription || "SEO and meta information for this service."}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextInput
                    control={form.control}
                    name="meta.title"
                    label={t.services?.metaTitle || "Meta Title"}
                    placeholder={t.services?.metaTitlePlaceholder || "Enter meta title"}
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
                  label={t.services?.metaDescription || "Meta Description"}
                  placeholder={t.services?.metaDescriptionPlaceholder || "Enter meta description"}
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
                <CardTitle>{t.services?.statusOptions || "Status Options"}</CardTitle>
                <CardDescription>
                  {t.services?.statusOptionsDescription || "Configure the service status and visibility."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CheckboxInput
                    control={form.control}
                    name="isPublished"
                    label={t.services?.published || "Published"}
                    description={t.services?.publishedDescription || "Make this service visible to the public"}
                    className="items-center rounded-lg border p-4"
                  />
                  <CheckboxInput
                    control={form.control}
                    name="isFeatured"
                    label={t.services?.featured || "Featured"}
                    description={t.services?.featuredDescription || "Mark this service as featured"}
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
