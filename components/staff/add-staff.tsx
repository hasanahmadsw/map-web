"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormDialog } from "@/components/shared/form-dialog";
import { CheckboxGroupInput } from "@/components/shared/input/CheckboxGroupInput";
import { FileInput } from "@/components/shared/input/FileInput";
import { PasswordInput } from "@/components/shared/input/PasswordInput";
import { SelectInput } from "@/components/shared/input/SelectInput";
import { TextAreaInput } from "@/components/shared/input/TextAreaInput";
import { TextInput } from "@/components/shared/input/TextInput";
import { Button } from "@/components/ui/button";
import { useLanguages } from "@/hooks/useLanguages";
import { useStaff } from "@/hooks/useStaff";
import { useTranslation } from "@/providers/translations-provider";
import { createStaffSchema, type TCreateStaffDTO } from "@/schemas/staff.schemas";
import { Role, ROLES } from "@/enums/roles.enum";
import { formatValidationMessage } from "@/schemas/common.schemas";

export function AddStaffMember() {
  const { createStaff, isCreating, createError } = useStaff();
  const { languages, isLoading: isLoadingLanguages } = useLanguages();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const form = useForm<TCreateStaffDTO>({
    resolver: zodResolver(createStaffSchema(t.validation)),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: Role.AUTHOR,
      bio: "",
      image: "",
      languageCode: languages?.[0]?.code || "",
      translateTo: [], // Start empty, will be populated by useEffect
    },
    mode: "onSubmit", 
  });



  // Auto-select all languages when they become available (excluding the default languageCode)
  useEffect(() => {
    if (languages && languages.length > 0) {
      const currentLanguageCode = form.getValues("languageCode");
      const allLanguageCodes = languages
        .map((lang) => lang.code)
        .filter(lang => lang !== currentLanguageCode);
      
      // Only set if translateTo is empty or if we have more languages available
      const currentTranslateTo = form.getValues("translateTo");
      if (currentTranslateTo.length === 0 || allLanguageCodes.length > currentTranslateTo.length) {
        form.setValue("translateTo", allLanguageCodes);
      }
    }
  }, [languages, form]);

  // Watch for languageCode changes and update translateTo accordingly
  const watchedLanguageCode = form.watch("languageCode");
  useEffect(() => {
    if (watchedLanguageCode && languages && languages.length > 0) {
      // Remove the selected language from translateTo and select all others
      const allLanguageCodes = languages
        .map((lang) => lang.code)
        .filter(lang => lang !== watchedLanguageCode);
      
      // Always select all available languages for translation
      form.setValue("translateTo", allLanguageCodes);
    }
  }, [watchedLanguageCode, languages, form]);

  const availableLanguages = languages?.filter((lang) => lang.code !== watchedLanguageCode) || [];

  const onSubmit = async (data: TCreateStaffDTO) => {
    try {
      const payload = {
        ...data,
        image: data.image || undefined,
      };
      
      await createStaff(payload);
      toast.success(formatValidationMessage(t.validation.createdSuccessfully, {
        entity: t.staffs.staff,
      }));
      setOpen(false);
      form.reset();
    } catch (error) {
      toast.error(createError || formatValidationMessage(t.validation.failedToCreate, {
        entity: t.staffs.staff,
      }));
      throw error; // Re-throw to let FormDialog know there was an error
    }
  };

  const handleSelectAll = () => {
    const allLanguageCodes = availableLanguages.map((lang) => lang.code);
    form.setValue("translateTo", allLanguageCodes);
  };

  // Deselect all languages
  const handleDeselectAll = () => {
    form.setValue("translateTo", []);
  };

  // Check if all available languages (excluding the selected languageCode) are selected
  const translateTo = form.watch("translateTo");
  const isAllSelected = availableLanguages.length > 0 ? translateTo?.length === availableLanguages.length : false;

  // Show loading state if languages are still loading
  if (isLoadingLanguages || !languages || languages.length === 0) {
    return (
      <Button disabled>
        <Plus className="me-2 h-4 w-4" />
        {t.staffs.addStaff}
      </Button>
    );
  }

  return (
    <FormDialog
      trigger={
        <Button>
          <Plus className="me-2 h-4 w-4" />
          {t.staffs.addStaff}
        </Button>
      }
      title={t.staffs.addStaff}
      open={open}
      setOpen={setOpen}
      description={t.staffs.createStaffDesc}
      onSubmit={form.handleSubmit(onSubmit)}
      submitLabel={t.common.add}
      cancelLabel={t.common.cancel}
      isLoading={isCreating}
      loadingLabel={t.common.loading}
      maxWidth="sm:max-w-[800px]"
      form={form}
    >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          control={form.control}
          name="name"
          label={t.common.name}
          placeholder={t.common.namePlaceholder}
        />
  
        <TextInput
          control={form.control}
          name="email"
          label={t.common.email}
          placeholder={t.common.emailPlaceholder}
          type="email"
        />
  
        <PasswordInput
          control={form.control}
          name="password"
          label={t.common.password}
          placeholder={t.common.passwordPlaceholder}
          disabled={isCreating}
        />
  
        <SelectInput
          control={form.control}
          name="role"
          label={t.staffs.role}
          placeholder={t.staffs.rolePlaceholder}
          options={ROLES.map((r) => ({
            value: r,
            label: r.charAt(0).toUpperCase() + r.slice(1),
          }))}
        />
    </div>

      <TextAreaInput
        control={form.control}
        name="bio"
        label={t.common.bio}
        placeholder={t.common.bioPlaceholder}
        className="min-h-[100px]"
      />

      <FileInput
        name="image"
        label={t.common.image}
        placeholder={t.common.chooseFile}
        accept="image/*"
        maxSize={10}
        autoUpload={true}
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

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-medium">{t.common.translationLanguages}</h3>
            <p className="text-sm text-muted-foreground">{t.common.translationLanguagesDescription}</p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={isAllSelected ? handleDeselectAll : handleSelectAll}
            >
              {isAllSelected ? t.validation.deselectAll : t.validation.selectAll}
            </Button>
          </div>
        </div>
        <CheckboxGroupInput
          control={form.control}
          name="translateTo"
          label=""
          options={
            languages
              ?.filter((lang) => lang.code !== watchedLanguageCode)
              .map((lang) => ({
                value: lang.code,
                label: `${lang.name}`,
              })) || []
          }
          gridCols="2"
        />
      </div>
    </FormDialog>
  );
}
