"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FileInput } from "@/components/shared/input/FileInput";
import { PasswordInput } from "@/components/shared/input/PasswordInput";
import { SelectInput } from "@/components/shared/input/SelectInput";
import { EntityTranslations } from "@/components/translations/translations";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { ROLES, Role } from "@/enums/roles.enum";
import { useStaff, useStaffById } from "@/hooks/useStaff";
import { useStaffTranslations } from "@/hooks/useStaffTranslations";
import { useTranslation } from "@/providers/translations-provider";
import { editStaffSchema, type TEditStaffDTO } from "@/schemas/staff.schemas";
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
    <div className="space-y-6">
      {/* Main Tag Form */}
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
            <FileInput
              name="image"
              label={t.common.image}
              placeholder={t.common.chooseFile}
              accept="image/*"
              maxSize={10}
              autoUpload={true}
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

      <Separator />

      {/* Translations Management */}
      <EntityTranslations
        entityId={parseInt(staffId, 10)}
        entityType="staff"
        hooks={staffTranslationsHooks}
        hasContent={false}
        hasMeta={false}
      />
    </div>
  );
}
