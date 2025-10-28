"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { CheckboxInput } from "@/components/shared/input/CheckboxInput";
import { FileInput } from "@/components/shared/input/FileInput";
import { IconSelectInput } from "@/components/shared/input/IconSelectInput";
import { TextInput } from "@/components/shared/input/TextInput";
import { EntityTranslations } from "@/components/translations/translations";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useServiceStaffById, useServicesStaff } from "@/hooks/useServices";
import { useServiceTranslations } from "@/hooks/useServiceTranslations";
import { useTranslation } from "@/providers/translations-provider";
import {
  editServiceSchema,
  type TEditServiceForm,
} from "@/schemas/services.schemas";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EditServiceFormProps {
  serviceId: string;
}

export function EditServiceForm({ serviceId }: EditServiceFormProps) {
  const { t } = useTranslation();
  const { updateService, isUpdating, updateError } = useServicesStaff();
  const {
    data: service,
    isLoading: isLoadingService,
    isError: isErrorService,
    refetch: refetchService,
  } = useServiceStaffById(Number(serviceId));
  const serviceTranslationsHooks = useServiceTranslations(Number(serviceId));

  const form = useForm<z.input<ReturnType<typeof editServiceSchema>>>({
    resolver: zodResolver(editServiceSchema(t.validation)),
    defaultValues: {
      slug: "",
      icon: "",
      featuredImage: "",
      isPublished: false,
      isFeatured: false,
      order: 0,
    },
  });

  // Reset form when service data is loaded
  useEffect(() => {
    if (service) {
      // Get the first translation for language code
      const firstTranslation = service.translations?.[0];
      const languageCode = firstTranslation?.languageCode || "";

      form.reset({
        slug: service.slug,
        icon: service.icon,
        featuredImage: service.featuredImage,
        isPublished: service.isPublished,
        isFeatured: service.isFeatured,
        order: service.order,
      });
    }
  }, [service, form]);


  const onSubmit = async (
    data: z.input<ReturnType<typeof editServiceSchema>>
  ) => {
    // Check if form has any changes
    if (!form.formState.isDirty) {
      toast.info("No changes detected. Please make some changes before updating.");
      return;
    }
    
    try {
      await updateService(Number(serviceId), data as TEditServiceForm);
      toast.success(t.common?.success || "Service updated successfully");
      refetchService(); // Refetch to get updated data
    } catch (error) {
      toast.error(updateError || t.common?.error || "Failed to update service");
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
    <Tabs defaultValue="service" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="service">
          {t.services?.basicInformation || "Service Settings"}
        </TabsTrigger>
        <TabsTrigger value="translations">
          {"Translations"}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="service" className="space-y-6">
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
                    name="slug"
                    label={t.services?.slug || "Slug"}
                    placeholder={t.services?.slugPlaceholder || "service-slug"}
                  />
                  <IconSelectInput
                    name="icon"
                    label={t.services?.icon || "Icon"}
                    placeholder={t.services?.iconPlaceholder || "Select an icon"}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextInput
                    control={form.control}
                    name="order"
                    label={t.services?.order || "Order"}
                    placeholder="0"
                    type="number"
                  />
                
                </div>
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
                <FileInput
                  name="featuredImage"
                  label={t.services?.featuredImage || "Featured Image"}
                  placeholder={t.services?.selectImage || "Select an image"}
                  accept="image/*"
                  maxSize={10}
                  autoUpload={true}
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
          entityId={Number(serviceId)}
          entityType="service"
          hooks={serviceTranslationsHooks}
          hasContent={false}
          hasMeta={true}
          hasSubServices={true}
        />
      </TabsContent>
    </Tabs>
  );
}
