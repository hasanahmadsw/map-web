"use client";

import { Loader2, Plus } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { SelectInput } from "@/components/shared/input/SelectInput";
import { SubServicesInput } from "@/components/shared/input/SubServicesInput";
import { TextAreaInput } from "@/components/shared/input/TextAreaInput";
import { TextInput } from "@/components/shared/input/TextInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useTranslation } from "@/providers/translations-provider";
import type { Language } from "@/types/language.types";
import type { EntityType } from "@/types/translations.types";

interface AddTranslationFormProps {
  form: UseFormReturn<Record<string, any>>;
  entityType: EntityType;
  hasContent: boolean;
  hasMeta: boolean;
  hasSubServices?: boolean;
  availableLanguages: readonly Language[];
  existingLanguageCodes: string[];
  isCreating: boolean;
  onSubmit: (data: Record<string, any>) => Promise<void>;
}

export function AddTranslationForm({
  form,
  entityType,
  hasContent,
  hasMeta,
  hasSubServices = false,
  availableLanguages,
  existingLanguageCodes,
  isCreating,
  onSubmit,
}: AddTranslationFormProps) {
  const { t } = useTranslation();
  const availableForNewTranslation = availableLanguages.filter((lang) => !existingLanguageCodes.includes(lang.code));

  if (availableForNewTranslation.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <h3 className="text-lg font-semibold mb-2">{t.translations.allLanguagesTranslated}</h3>
        <p>{t.translations.allLanguagesTranslatedDescription}</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <SelectInput
          control={form.control}
          name="languageCode"
          label={t.translations.language}
          placeholder={t.translations.selectLanguage}
          options={availableForNewTranslation.map((language) => ({
            value: language.code,
            label: `${language.name}`,
          }))}
        />

        <TextInput
          control={form.control}
          name="name"
          label={t.translations.name}
          placeholder={t.translations.enterTranslatedName}
        />

        {entityType === "staff" && (
          <TextAreaInput
            control={form.control}
            name="bio"
            label={t.translations.bio}
            placeholder={t.translations.enterTranslatedBio}
            className="min-h-[80px]"
          />
        )}

        {entityType !== "article" && entityType !== "staff" && (
          <TextAreaInput
            control={form.control}
            name="description"
            label={t.translations.description}
            placeholder={t.translations.enterTranslatedDescription}
            className="min-h-[80px]"
          />
        )}

        {entityType === "service" && (
          <TextAreaInput
            control={form.control}
            name="shortDescription"
            label={t.services?.shortDescription || "Short Description"}
            placeholder={t.services?.shortDescriptionPlaceholder || "Enter short description"}
            className="min-h-[80px]"
          />
        )}

        {entityType === "solution" && (
          <TextAreaInput
            control={form.control}
            name="shortDescription"
            label={t.solutions?.shortDescription || "Short Description"}
            placeholder={t.solutions?.shortDescriptionPlaceholder || "Enter short description"}
            className="min-h-[80px]"
          />
        )}

        {hasContent && (
          <>
            <TextAreaInput
              control={form.control}
              name="excerpt"
              label={entityType === "article" ? t.articles.excerpt : t.translations.excerpt}
              placeholder={t.translations.enterTranslatedDescription}
              className="min-h-[80px]"
            />

            <TextAreaInput
              control={form.control}
              name="content"
              label={entityType === "article" ? t.articles.content : t.translations.content}
              placeholder={t.translations.enterTranslatedContent}
              className="min-h-[120px]"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextAreaInput
                control={form.control}
                name="tags"
                label={t.tags?.title || "Tags"}
                placeholder="Enter tags separated by commas (e.g., technology, AI, innovation)"
                className="min-h-[80px]"
                rows={3}
              />
              <TextAreaInput
                control={form.control}
                name="topics"
                label={t.topics?.title || "Topics"}
                placeholder="Enter topics separated by commas (e.g., politics, business, health)"
                className="min-h-[80px]"
                rows={3}
              />
            </div>
          </>
        )}

        {hasMeta && (
          <>
            <TextInput
              control={form.control}
              name="meta.title"
              label={entityType === "article" ? t.articles.metaTitle : t.translations.metaTitle}
              placeholder={t.translations.enterTranslatedMetaTitle}
            />

            <TextAreaInput
              control={form.control}
              name="meta.description"
              label={entityType === "article" ? t.articles.metaDescription : t.translations.metaDescription}
              placeholder={t.translations.enterTranslatedMetaDescription}
              className="min-h-[80px]"
            />
          </>
        )}

        {hasSubServices && (
          <SubServicesInput
            control={form.control}
            name="subServices"
            label={t.services?.subServices || "Sub Services"}
            description={t.services?.subServicesDescription || "Add sub-services for this service."}
          />
        )}

        <Button type="submit" disabled={isCreating} className="w-full">
          {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Plus className="mr-2 h-4 w-4" />
          {isCreating ? t.translations.addingTranslation : t.translations.addTranslation}
        </Button>
      </form>
    </Form>
  );
}
