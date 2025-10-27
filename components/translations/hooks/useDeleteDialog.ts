import { useState } from "react";

interface TranslationToDelete {
  id: number;
  name: string;
  languageCode: string;
}

export const useDeleteDialog = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [translationToDelete, setTranslationToDelete] = useState<TranslationToDelete | null>(null);

  const handleDeleteClick = (translation: any) => {
    setTranslationToDelete({
      id: translation.id,
      name: translation.name,
      languageCode: translation.languageCode,
    });
    setDeleteDialogOpen(true);
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setTranslationToDelete(null);
  };

  return {
    deleteDialogOpen,
    setDeleteDialogOpen,
    translationToDelete,
    handleDeleteClick,
    cancelDelete,
  };
};
