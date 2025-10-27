"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormDialog } from "@/components/shared/form-dialog";
import { CheckboxInput } from "@/components/shared/input/CheckboxInput";
import { TextInput } from "@/components/shared/input/TextInput";
import { Button } from "@/components/ui/button";
import { useLanguages } from "@/hooks/useLanguages";
import { useTranslation } from "@/providers/translations-provider";
import { createLanguageSchema, type TCreateLanguageDTO } from "@/schemas/languages.schemas";

export function AddLanguage() {
  const { createLanguage, isCreating, createError } = useLanguages();
  const { t } = useTranslation();
const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(createLanguageSchema(t.validation)),
    defaultValues: {
      code: "", 
      name: "",
      nativeName: "",
      isDefault: false,
    },
  });

  const onSubmit = async (data: TCreateLanguageDTO) => {
    try {
      await createLanguage(data);
      toast.success(t.languages.languageCreated);
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Failed to create language:", error);
      toast.error(createError || t.common.error);
    }
  };

  return (
    <FormDialog
      open={open}
      setOpen={setOpen}
      title={t.languages.addLanguage}
      description={t.languages.addLanguageDescription}
      trigger={
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t.languages.addLanguage}
        </Button>
      }
      form={form}
      onSubmit={form.handleSubmit(onSubmit)}
      submitLabel={t.common.add}
      cancelLabel={t.common.cancel}
      isLoading={isCreating}
      loadingLabel={t.common.saving}
    >
      <TextInput
        control={form.control}
        name="code"
        label={t.languages.code}
        placeholder="en"
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
    </FormDialog>
  );
}
