"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CheckboxInput } from "@/components/shared/input/CheckboxInput";
import { TextInput } from "@/components/shared/input/TextInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useLanguages } from "@/hooks/useLanguages";
import { useTranslation } from "@/providers/translations-provider";
import { updateLanguageSchema, type TUpdateLanguageDTO } from "@/schemas/languages.schemas";
import type { Language } from "@/types/language.types";

interface EditLanguageFormProps {
  language: Language;
  onSuccess?: () => void;
}

export function EditLanguageForm({ language, onSuccess }: EditLanguageFormProps) {
  const { updateLanguage, isUpdating, updateError } = useLanguages();
  const { t } = useTranslation();

  const dict = useMemo(() => t.validation as any, [t.validation]);

  const form = useForm({
    resolver: zodResolver(updateLanguageSchema(dict)),
    defaultValues: {
      name: language.name,
      nativeName: language.nativeName,
      isDefault: language.isDefault,
    },
  });

  useEffect(() => {
    form.reset({
      name: language.name,
      nativeName: language.nativeName,
      isDefault: language.isDefault,
    });
  }, [language, form]);

  const onSubmit = async (data: TUpdateLanguageDTO) => {
    try {
      // Exclude code from the update data since it shouldn't be changed
      const { code, ...updateData } = data;
      await updateLanguage(language.code, updateData);
      toast.success(t.languages.languageUpdated);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to update language:", error);
      toast.error(updateError || t.common.error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <TextInput
          control={form.control}
          name="code"
          label={t.languages.code}
          placeholder="en"
          disabled={true}
        />

        <TextInput
          control={form.control}
          name="name"
          label={t.languages.name}
          placeholder="English"
        />

        <TextInput
          control={form.control}
          name="nativeName"
          label={t.languages.nativeName}
          placeholder="English"
        />

        <CheckboxInput
          control={form.control}
          name="isDefault"
          label={t.languages.setAsDefault}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            {t.common.cancel}
          </Button>
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? t.common.saving : t.common.save}
          </Button>
        </div>
      </form>
    </Form>
  );
}
