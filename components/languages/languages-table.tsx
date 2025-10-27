"use client";

import { useState } from "react";
import { DataTable } from "@/components/shared/data-table";
import { useLanguagesTableConfig } from "@/components/languages/languages-table.config";
import { useLanguages } from "@/hooks/useLanguages";
import { AddLanguage } from "./add-language";
import { EditLanguageForm } from "./edit-language-form";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { useTranslation } from "@/providers/translations-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Language } from "@/types/language.types";

export function LanguagesTable() {
  const [selectedLanguages, setSelectedLanguages] = useState<number[]>([]);
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);
  const [deletingLanguage, setDeletingLanguage] = useState<Language | null>(null);
  const { t } = useTranslation();
  const {
    languages,
    isLoading,
    isError,
    error,
    deleteLanguage,
    isDeleting,
  } = useLanguages({ enabled: true });

  const tableConfig = useLanguagesTableConfig({
    onEdit: (language: Language) => setEditingLanguage(language),
    onDelete: (language: Language) => setDeletingLanguage(language),
  });

  const handleDeleteConfirm = async () => {
    if (!deletingLanguage) return;
    
    try {
      await deleteLanguage(deletingLanguage.code);
      setDeletingLanguage(null);
    } catch (error) {
      console.error("Failed to delete language:", error);
    }
  };

  const handleEditSuccess = () => {
    setEditingLanguage(null);
  };

  return (
    <>
      <DataTable
        data={languages|| []}
        columns={tableConfig.columns}
        actions={tableConfig.actions}
        selectable={true}
        onSelectionChange={setSelectedLanguages}
        getItemId={(language) => language.id}
        isLoading={isLoading}
        isError={isError}
        error={error || undefined}
        isDeleting={isDeleting}
        emptyStateIcon={tableConfig.emptyStateIcon}
        emptyStateMessage={tableConfig.emptyStateMessage}
        errorMessage={tableConfig.errorMessage}
        headerActions={<AddLanguage />}
      />

      {/* Edit Language Dialog */}
      <Dialog open={!!editingLanguage} onOpenChange={() => setEditingLanguage(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t.languages.editLanguage }</DialogTitle>
            <DialogDescription>
              {t.languages.editLanguageDescription }
            </DialogDescription>
          </DialogHeader>
          {editingLanguage && (
            <EditLanguageForm
              language={editingLanguage}
              onSuccess={handleEditSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={!!deletingLanguage}
        onOpenChange={() => setDeletingLanguage(null)}
        title={t.languages.deleteLanguage }
        description={`${t.languages.deleteConfirmation}`}
        confirmText={t.common.delete }
        cancelText={t.common.cancel }
        loadingText={t.common.deleting }
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingLanguage(null)}
        isLoading={isDeleting}
        variant="destructive"
      />
    </>
  );
}
