"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Image, Loader2, Save, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FileInput } from "@/components/shared/input/FileInput";
import { MediaPickerDialog } from "@/components/media/media-picker-dialog";
import { PasswordInput } from "@/components/shared/input/PasswordInput";
import { SelectInput } from "@/components/shared/input/SelectInput";
import { EntityTranslations } from "@/components/translations/translations";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ROLES, Role } from "@/enums/roles.enum";
import { useStaff, useStaffById } from "@/hooks/staff/useStaff";
import { useStaffTranslations } from "@/hooks/staff/useStaffTranslations";
import { useTranslation } from "@/providers/translations-provider";
import { editStaffSchema, type TEditStaffDTO } from "@/schemas/staff.schemas";
import { staffService } from "@/services/staff.service";
import { formatValidationMessage } from "@/schemas/common.schemas";

interface EditStaffFormProps {
  staffId: string;
}

export function EditStaffForm({ staffId }: EditStaffFormProps) {
  // Get staff data
  const { staff, isLoading, error } = useStaffById(parseInt(staffId, 10));
  const { updateStaff, isUpdating, updateError } = useStaff();
  const { t } = useTranslation();
  const staffTranslationsHooks = useStaffTranslations(parseInt(staffId, 10));
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  // Memoize the resolver to prevent unnecessary re-renders
  const resolver = useMemo(() => zodResolver(editStaffSchema(t.validation)), [t.validation]);

  const staffForm = useForm<TEditStaffDTO>({
    resolver,
    defaultValues: {
      image: "",
      password: "",
      role: Role.AUTHOR,
    },
    mode: "onSubmit", // Only validate on submit
  });

  // Update form when staff data is loaded
  useEffect(() => {
    if (staff) {
      // Use setValue to update individual fields
      staffForm.setValue("image", staff.image || "");
      staffForm.setValue("role", staff.role as Role);
      // Don't set password as it should be empty for security
    }
  }, [staff, staffForm]);

  const onUpdateStaff = async (data: TEditStaffDTO) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add password if provided and not empty
      if (data.password && data.password.trim() !== "") {
        formData.append('password', data.password);
      }
      
      // Add role
      if (data.role) {
        formData.append('role', data.role);
      }
      
      // Add image URL (uploaded via FileInput auto-upload)
      if (data.image) {
        formData.append('image', data.image);
      }
      
      await updateStaff(parseInt(staffId, 10), formData);
      toast.success(formatValidationMessage(t.validation.updatedSuccessfully, {
        entity: t.staffs.staff,
      }));
    } catch (error) {
      console.error("Update error:", error);
      toast.error(updateError || formatValidationMessage(t.validation.failedToUpdate, {
        entity: t.staffs.staff,
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-center">
          <p className="text-muted-foreground">{t.common.failedToLoad}</p>
        </div>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-center">
          <p className="text-muted-foreground">{t.common.failedToLoad}</p>
        </div>
      </div>
    );
  }

  return (
    <Tabs defaultValue="staff" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="staff">
          {t.staffs?.staff || "Staff Settings"}
        </TabsTrigger>
        <TabsTrigger value="translations">
          {"Translations"}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="staff" className="space-y-6 pt-6">
        <Form {...staffForm}>
          <form onSubmit={staffForm.handleSubmit(onUpdateStaff)} className="space-y-4">
            {/* Editable fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 items-end gap-4">
              <PasswordInput
                control={staffForm.control}
                name="password"
                label={t.common.password}
                placeholder={t.common.passwordPlaceholder}
                disabled={isUpdating}
              />

              <SelectInput
                control={staffForm.control}
                name="role"
                label={t.staffs.role}
                placeholder={t.staffs.rolePlaceholder}
                options={ROLES.map((r) => ({
                  value: r,
                  label: r.charAt(0).toUpperCase() + r.slice(1),
                }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.common.image}</label>
                <div className="flex items-center gap-4">
                  {staffForm.watch("image") && (
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                      <img
                        src={staffForm.watch("image") as string}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 rounded-full p-0"
                        onClick={() => {
                          staffForm.setValue("image", "", { shouldDirty: true });
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
                    {staffForm.watch("image") ? t.common.chooseFile : t.common.image}
                  </Button>
                </div>
              </div>

              <MediaPickerDialog
                open={isMediaPickerOpen}
                onOpenChange={setIsMediaPickerOpen}
                onSelect={(media) => {
                  const selectedMedia = Array.isArray(media) ? media[0] : media;
                  if (selectedMedia) {
                    staffForm.setValue("image", selectedMedia.url, { shouldDirty: true });
                  }
                }}
                mode="single"
                filter="image"
                initialSelected={staffForm.watch("image") ? [staffForm.watch("image") as string] : []}
              />
            </div>

            <Button 
              type="submit" 
              disabled={isUpdating}
            >
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
                  {isUpdating ? t.validation.updating : t.validation.update}
            </Button>
          </form>
        </Form>
      </TabsContent>

      <TabsContent value="translations" className="space-y-6">
        <EntityTranslations
          entityId={parseInt(staffId, 10)}
          entityType="staff"
          hooks={staffTranslationsHooks}
          hasContent={false}
          hasMeta={false}
        />
      </TabsContent>
    </Tabs>
  );
}
