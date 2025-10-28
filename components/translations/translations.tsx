"use client";

import { Languages, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { AddTranslationForm } from "@/components/translations/add-translation-form";
import { AutoTranslateForm } from "@/components/translations/auto-translate-form";
import { useDeleteDialog } from "@/components/translations/hooks/useDeleteDialog";
import { useTranslationEditing } from "@/components/translations/hooks/useTranslationEditing";
import { useTranslationForms } from "@/components/translations/hooks/useTranslationForms";
import { TranslationEditMode } from "@/components/translations/translation-edit-mode";
import { TranslationViewMode } from "@/components/translations/translation-view-mode";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguages } from "@/hooks/useLanguages";
import { useTranslation } from "@/providers/translations-provider";
import type { EntityType, Translation, TranslationHooks } from "@/types/translations.types";

interface EntityTranslationsProps<T extends Translation> {
  entityId: number;
  entityType: EntityType;
  hooks: TranslationHooks<T>;
  hasContent?: boolean;
  hasMeta?: boolean;
  hasSubServices?: boolean;
}

export function EntityTranslations<T extends Translation>({
  entityType,
  hooks,
  hasContent = false,
  hasMeta = false,
  hasSubServices = false,
}: EntityTranslationsProps<T>) {
  const { t } = useTranslation();
  const { languages: apiLanguages, isLoading: languagesLoading } = useLanguages();
  const availableLanguages = apiLanguages;
  // Extract hooks
  const {
    translations,
    isLoading: translationsLoading,
    createTranslation,
    updateTranslation,
    deleteTranslation,
    autoTranslate,
    isCreating: isCreatingTranslation,
    isUpdating: isUpdatingTranslation,
    isDeleting: isDeletingTranslation,
    isTranslating: isAutoTranslating,
  } = hooks;

  // Custom hooks
  const { translationForm, autoTranslateForm } = useTranslationForms(entityType, hasContent, hasMeta, hasSubServices);
  const {
    setEditingTranslations,
    startEditing,
    cancelEditing,
    updateEditingTranslation,
    getEditingTranslation,
  } = useTranslationEditing();
  const { deleteDialogOpen, setDeleteDialogOpen, translationToDelete, handleDeleteClick, cancelDelete } =
    useDeleteDialog();

  // Event handlers
  const onAddTranslation = async (data: any) => {
    try {
      const payload = {
        languageCode: data.languageCode,
        name: data.name,
        ...(entityType === "staff" && { bio: data.bio }),
        ...(entityType !== "article" && entityType !== "staff" && { description: data.description }),
        ...(entityType === "service" && { 
          shortDescription: data.shortDescription,
          subServices: data.subServices || [],
        }),
        ...(hasContent && {
          content: data.content,
          excerpt: data.excerpt,
          tags: data.tags,
          topics: data.topics,
          ...(hasMeta && { meta: data.meta }),
        }),
        ...(hasSubServices && {
          shortDescription: data.shortDescription,
          subServices: data.subServices || [],
        }),
      };
      await createTranslation(payload);
      toast.success(t.translations.translationAddedSuccessfully);
      translationForm.reset();
    } catch (error) {
      toast.error(t.translations.failedToAddTranslation);
    }
  };

  const onAutoTranslate = async (data: any) => {
    try {
      await autoTranslate(data);
      toast.success(t.translations.autoTranslationCompleted);
      autoTranslateForm.reset();
    } catch (error) {
      toast.error(t.translations.failedToAutoTranslate);
    }
  };

  const onUpdateTranslation = async (translationId: number, data: any) => {
    try {
      const payload = {
        name: data.name,
        ...(entityType === "staff" && { bio: data.bio }),
        ...(entityType !== "article" && entityType !== "staff" && { description: data.description }),
        ...(entityType === "service" && { 
          shortDescription: data.shortDescription,
          subServices: data.subServices || [],
        }),
        ...(hasContent && {
          content: data.content,
          excerpt: data.excerpt,
          tags: data.tags,
          topics: data.topics,
          ...(hasMeta && { meta: data.meta }),
        }),
        ...(hasSubServices && {
          shortDescription: data.shortDescription,
          subServices: data.subServices || [],
        }),
      };
      await updateTranslation(translationId, payload);
      toast.success(t.translations.translationUpdatedSuccessfully);
      setEditingTranslations((prev) => prev.filter((t) => t.id !== translationId));
    } catch (error) {
      toast.error(t.translations.failedToUpdateTranslation);
    }
  };

  const onDeleteTranslation = async () => {
    if (!translationToDelete) return;

    try {
      await deleteTranslation(translationToDelete.id);
      toast.success(t.translations.translationDeletedSuccessfully);
      setEditingTranslations((prev) => prev.filter((t) => t.id !== translationToDelete.id));
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error(t.translations.failedToDeleteTranslation);
    }
  };

  const saveEditing = (translationId: number) => {
    const editingTranslation = getEditingTranslation(translationId);
    if (editingTranslation) {
      onUpdateTranslation(translationId, {
        name: editingTranslation.name,
        ...(entityType === "staff" && { bio: editingTranslation.bio || "" }),
        ...(entityType !== "article" &&
          entityType !== "staff" && { description: editingTranslation.description || "" }),
        ...(entityType === "service" && { 
          shortDescription: editingTranslation.shortDescription || "",
          subServices: editingTranslation.subServices || [],
        }),
        ...(hasContent && {
          content: editingTranslation.content,
          excerpt: editingTranslation.excerpt,
          tags: editingTranslation.tags,
          topics: editingTranslation.topics,
          ...(hasMeta && { meta: editingTranslation.meta }),
        }),
        ...(hasSubServices && {
          shortDescription: editingTranslation.shortDescription || "",
          subServices: editingTranslation.subServices || [],
        }),
      });
    }
  };

  // Computed values
  const existingLanguageCodes = translations.map((t) => t.languageCode);
  const availableForTranslation =
    availableLanguages?.filter((lang) => !existingLanguageCodes.includes(lang.code)) || [];

  if (translationsLoading || languagesLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            {t.translations.title}
          </CardTitle>
          <CardDescription>{t.translations.manageTranslationsDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">{t.translations.loadingTranslations}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            {t.translations.title}
          </CardTitle>
          <CardDescription>{t.translations.manageTranslationsDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="view" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="view">{t.translations.viewTranslations}</TabsTrigger>
              <TabsTrigger value="add">{t.translations.addTranslation}</TabsTrigger>
              <TabsTrigger value="auto">{t.translations.autoTranslate}</TabsTrigger>
            </TabsList>

            <TabsContent value="view" className="space-y-4">
              {translations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Languages className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{t.translations.noTranslations}</h3>
                  <p>{t.translations.noTranslationsDescription}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {translations.map((translation) => {
                    const editingTranslation = getEditingTranslation(translation.id);

                    return editingTranslation ? (
                      <TranslationEditMode
                        key={translation.id}
                        translation={translation}
                        editingTranslation={editingTranslation}
                        entityType={entityType}
                        hasContent={hasContent}
                        hasMeta={hasMeta}
                        hasSubServices={hasSubServices}
                        isUpdatingTranslation={isUpdatingTranslation}
                        onSave={saveEditing}
                        onCancel={cancelEditing}
                        onUpdate={updateEditingTranslation}
                        setEditingTranslations={setEditingTranslations}
                      />
                    ) : (
                      <TranslationViewMode
                        key={translation.id}
                        translation={translation}
                        entityType={entityType}
                        hasContent={hasContent}
                        hasMeta={hasMeta}
                        hasSubServices={hasSubServices}
                        isDeletingTranslation={isDeletingTranslation}
                        onStartEditing={() => startEditing(translation, hasContent, hasMeta, hasSubServices)}
                        onDeleteClick={handleDeleteClick}
                      />
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="add" className="space-y-4">
              <AddTranslationForm
                form={translationForm}
                entityType={entityType}
                hasContent={hasContent}
                hasMeta={hasMeta}
                hasSubServices={hasSubServices}
                availableLanguages={availableLanguages || []}
                existingLanguageCodes={existingLanguageCodes}
                isCreating={isCreatingTranslation}
                onSubmit={onAddTranslation}
              />
            </TabsContent>

            <TabsContent value="auto" className="space-y-4">
              <AutoTranslateForm
                form={autoTranslateForm}
                availableForTranslation={availableForTranslation || []}
                isTranslating={isAutoTranslating}
                onSubmit={onAutoTranslate}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={t.translations.confirmDeleteTranslation}
        description={translationToDelete ? t.translations.confirmDeleteTranslationMessage : ""}
        confirmText={t.translations.deleteTranslation}
        cancelText={t.common.cancel}
        loadingText={t.translations.deleting}
        onConfirm={onDeleteTranslation}
        onCancel={cancelDelete}
        isLoading={isDeletingTranslation}
        variant="destructive"
      />
    </>
  );
}
