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
import { SubServicesInput } from "@/components/shared/input/SubServicesInput";
import { TextAreaInput } from "@/components/shared/input/TextAreaInput";
import { TextInput } from "@/components/shared/input/TextInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useServicesStaff } from "@/hooks/services/useServices";
import { useLanguages } from "@/hooks/useLanguages";
import { useTranslation } from "@/providers/translations-provider";
import { createServiceSchema, type TCreateServiceForm } from "@/schemas/services.schemas";
import { servicesService } from "@/services/services.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AddServiceForm() {
  const router = useRouter();
  const { createService, isCreating, createError } = useServicesStaff();
  const { languages, isLoading: languagesLoading } = useLanguages();
  const { t } = useTranslation();
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const form = useForm<z.input<ReturnType<typeof createServiceSchema>>>({
    resolver: zodResolver(createServiceSchema(t.validation)),
    defaultValues: {
      slug: "",
      icon: "",
      featuredImage: "",
      isPublished: false,
      isFeatured: false,
      order: 0,
      subServices: [],
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

  const onSubmit = async (data: z.input<ReturnType<typeof createServiceSchema>>) => {
    try {
      // Create service payload with sub-services
      const servicePayload = {
        slug: data.slug,
        icon: data.icon,
        featuredImage: data.featuredImage,
        isPublished: data.isPublished ?? false,
        isFeatured: data.isFeatured ?? false,
        order: data.order || 0,
        subServices: data.subServices?.filter(sub => sub.title && sub.description) || [],
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

      await createService(servicePayload as TCreateServiceForm);
      toast.success(t.validation?.createdSuccessfully || "Service created successfully");
      router.push("/dashboard/services");
    } catch {
      toast.error(createError || t.validation?.failedToCreate || "Failed to create service");
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
                  form.setValue("featuredImage", selectedMedia.url);
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
                className="rounded-lg border p-4 items-center"
              />
              <CheckboxInput
                control={form.control}
                name="isFeatured"
                label={t.services?.featured || "Featured"}
                description={t.services?.featuredDescription || "Mark this service as featured"}
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
            onClick={() => router.push("/dashboard/services")}
            disabled={isCreating}
          >
            {t.common?.cancel || "Cancel"}
          </Button>
          <Button type="submit" disabled={isCreating}>
            {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            {isCreating ? t.common?.creating || "Creating..." : t.common?.adding || "Add Service"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
