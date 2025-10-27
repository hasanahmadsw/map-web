import { Loader2, Save, X } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { SimpleTextAreaInput } from "@/components/shared/input/SimpleTextAreaInput";
import { SimpleTextInput } from "@/components/shared/input/SimpleTextInput";
import { SubServicesInput } from "@/components/shared/input/SubServicesInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useTranslation } from "@/providers/translations-provider";
import type { EditableTranslation } from "@/types/translations.types";
import { AiProvider } from "@/providers/ai-provider";
import ArticleEditor from "../editor";

interface TranslationEditModeProps {
  translation: Record<string, any>;
  editingTranslation: EditableTranslation;
  entityType: string;
  hasContent: boolean;
  hasMeta: boolean;
  hasSubServices?: boolean;
  isUpdatingTranslation: boolean;
  onSave: (translationId: number) => void;
  onCancel: (translationId: number) => void;
  onUpdate: (
    translationId: number,
    field: string,
    value: string | { title: string; description: string; keywords: string[] },
  ) => void;
  setEditingTranslations: React.Dispatch<React.SetStateAction<EditableTranslation[]>>;
}

export const TranslationEditMode: React.FC<TranslationEditModeProps> = ({
  translation,
  editingTranslation,
  entityType,
  hasContent,
  hasMeta,
  hasSubServices = false,
  isUpdatingTranslation,
  onSave,
  onCancel,
  onUpdate,
  setEditingTranslations,
}) => {
  const { t } = useTranslation();
  
  // Create a form instance for sub-services with stable initial values
  const subServicesForm = useForm({
    defaultValues: {
      subServices: editingTranslation.subServices || [],
    },
  });

  // Update editing translation when form changes
  const handleSubServicesChange = useCallback((newSubServices: any[]) => {
    setEditingTranslations((prev) =>
      prev.map((t) =>
        t.id === translation.id ? { ...t, subServices: newSubServices } : t
      )
    );
  }, [translation.id, setEditingTranslations]);

  // Watch for changes in sub-services form and update editing translation
  const watchedSubServices = subServicesForm.watch("subServices");
  
  // Only update editing translation when form data actually changes
  useEffect(() => {
    if (watchedSubServices && JSON.stringify(watchedSubServices) !== JSON.stringify(editingTranslation.subServices)) {
      handleSubServicesChange(watchedSubServices);
    }
  }, [watchedSubServices, editingTranslation.subServices, handleSubServicesChange]);
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="secondary">{translation.languageCode}</Badge>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => onSave(translation.id)} disabled={isUpdatingTranslation}>
                {isUpdatingTranslation ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              </Button>
              <Button size="sm" variant="outline" onClick={() => onCancel(translation.id)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-3">
            <SimpleTextInput
              label={entityType === "article" ? t.articles.articleTitle : t.translations.name}
              value={editingTranslation.name}
              onChange={(value) => onUpdate(translation.id, "name", value)}
            />

            {hasContent && (
              <>
                <SimpleTextAreaInput
                  label={entityType === "article" ? t.articles.excerpt : t.translations.excerpt}
                  value={editingTranslation.excerpt}
                  onChange={(value) => {
                    setEditingTranslations((prev) =>
                      prev.map((t) => (t.id === translation.id ? { ...t, excerpt: value } : t)),
                    );
                  }}
                  className="min-h-[80px]"
                />
                <div className="space-y-2">
                  <label htmlFor="content" className="text-sm font-medium">
                    {entityType === "article" ? t.articles.content : t.translations.content}
                  </label>
                  <AiProvider>
                    <ArticleEditor
                      initialHTML={editingTranslation.content}
                      onChange={(html) => {
                        setEditingTranslations((prev) =>
                          prev.map((t) => (t.id === translation.id ? { ...t, content: html } : t)),
                        );
                      }}
                    />
                  </AiProvider>
                </div>
              </>
            )}

            {hasMeta && editingTranslation.meta && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <SimpleTextInput
                  label={entityType === "article" ? t.articles.metaTitle : t.translations.metaTitle}
                  value={editingTranslation.meta.title}
                  onChange={(value) => {
                    setEditingTranslations((prev) =>
                      prev.map((t) =>
                        t.id === translation.id
                          ? {
                              ...t,
                              meta: {
                                title: value,
                                description: t.meta?.description || "",
                                keywords: t.meta?.keywords || [],
                              },
                            }
                          : t,
                      ),
                    );
                  }}
                />
                <SimpleTextAreaInput
                  label={entityType === "article" ? t.articles.metaDescription : t.translations.metaDescription}
                  value={editingTranslation.meta.description}
                  onChange={(value) => {
                    setEditingTranslations((prev) =>
                      prev.map((t) =>
                        t.id === translation.id
                          ? {
                              ...t,
                              meta: {
                                title: t.meta?.title || "",
                                description: value,
                                keywords: t.meta?.keywords || [],
                              },
                            }
                          : t,
                      ),
                    );
                  }}
                  className="min-h-[80px]"
                />
              </div>
            )}

            {entityType === "staff" && (
              <SimpleTextAreaInput
                label={t.translations.bio}
                value={editingTranslation.bio}
                onChange={(value) => onUpdate(translation.id, "bio", value)}
                className="min-h-[80px]"
              />
            )}

            {entityType !== "article" && entityType !== "staff" && (
              <SimpleTextAreaInput
                label={t.translations.description}
                value={editingTranslation.description}
                onChange={(value) => onUpdate(translation.id, "description", value)}
                className="min-h-[80px]"
              />
            )}

            {entityType === "service" && (
              <SimpleTextAreaInput
                label={t.services?.shortDescription || "Short Description"}
                value={editingTranslation.shortDescription || ""}
                onChange={(value) => onUpdate(translation.id, "shortDescription", value)}
                className="min-h-[80px]"
              />
            )}

            {hasSubServices && (
              <Form {...subServicesForm}>
                <SubServicesInput
                  control={subServicesForm.control}
                  name="subServices"
                  label={t.services?.subServices || "Sub Services"}
                  description={t.services?.subServicesDescription || "Manage sub-services for this service."}
                />
              </Form>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
