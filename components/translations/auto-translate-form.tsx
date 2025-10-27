"use client";

import { Loader2, Zap } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { CheckboxGroupInput } from "@/components/shared/input/CheckboxGroupInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useTranslation } from "@/providers/translations-provider";
import type { Language } from "@/types/language.types";

interface AutoTranslateFormProps {
  form: UseFormReturn<any>;
  availableForTranslation: readonly Language[];
  isTranslating: boolean;
  onSubmit: (data: any) => Promise<void>;
}

export function AutoTranslateForm({ form, availableForTranslation, isTranslating, onSubmit }: AutoTranslateFormProps) {
  const { t } = useTranslation();
  // Select all languages for translation
  const handleSelectAll = () => {
    const allLanguageCodes = availableForTranslation.map((lang) => lang.code);
    form.setValue("translateTo", allLanguageCodes);
  };

  // Deselect all languages
  const handleDeselectAll = () => {
    form.setValue("translateTo", []);
  };

  // Check if all languages are selected
  const isAllSelected = form.watch("translateTo")?.length === availableForTranslation.length;

  if (availableForTranslation.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <h3 className="text-lg font-semibold mb-2">{t.translations.noLanguagesToTranslate}</h3>
        <p>{t.translations.noLanguagesToTranslateDescription}</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium">{t.translations.selectLanguagesToTranslate}</h3>
              <p className="text-sm text-muted-foreground">{t.translations.autoTranslateDescription}</p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={isAllSelected ? handleDeselectAll : handleSelectAll}
              >
                {isAllSelected ? t.translations.deselectAll : t.translations.selectAll}
              </Button>
            </div>
          </div>
          <CheckboxGroupInput
            control={form.control}
            name="translateTo"
            label=""
            options={availableForTranslation.map((language) => ({
              value: language.code,
              label: `${language.name}`,
            }))}
            gridCols="2"
          />
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-amber-500 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-medium">{t.translations.autoTranslateNote}</h4>
              <p className="text-sm text-muted-foreground">{t.translations.autoTranslateWarning}</p>
            </div>
          </div>
        </div>

        <Button type="submit" disabled={isTranslating} className="w-full">
          {isTranslating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Zap className="mr-2 h-4 w-4" />
          {isTranslating ? t.translations.translating : t.translations.autoTranslate}
        </Button>
      </form>
    </Form>
  );
}
