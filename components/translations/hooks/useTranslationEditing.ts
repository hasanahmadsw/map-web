import { useState } from "react";
import type { EditableTranslation } from "@/types/translations.types";

export const useTranslationEditing = () => {
  const [editingTranslations, setEditingTranslations] = useState<EditableTranslation[]>([]);

  const startEditing = (translation: any, hasContent = false, hasMeta = false, hasSubServices = false) => {
    setEditingTranslations((prev) => [
      ...prev.filter((t) => t.id !== translation.id),
      {
        id: translation.id,
        languageCode: translation.languageCode,
        name: translation.name,
        description: "description" in translation ? translation.description || "" : "",
        shortDescription: "shortDescription" in translation ? translation.shortDescription || "" : "",
        bio: "bio" in translation ? translation.bio || "" : "",
        ...(hasContent && {
          content: translation.content,
          excerpt: translation.excerpt,
          ...(hasMeta && {
            meta: {
              title: translation.meta?.title || "",
              description: translation.meta?.description || "",
              keywords: translation.meta?.keywords || [],
            },
          }),
        }),
        ...(hasSubServices && {
          subServices: translation.subServices || [],
        }),
        isEditing: true,
      },
    ]);
  };

  const cancelEditing = (translationId: number) => {
    setEditingTranslations((prev) => prev.filter((t) => t.id !== translationId));
  };

  const updateEditingTranslation = (
    translationId: number,
    field: string,
    value: string | { title: string; description: string; keywords: string[] },
  ) => {
    setEditingTranslations((prev) =>
      prev.map((t) => {
        if (t.id === translationId) {
          if (field.includes(".")) {
            const [parent, child] = field.split(".");
            return {
              ...t,
              [parent]: {
                ...(t as any)[parent],
                [child]: value,
              },
            } as EditableTranslation;
          }
          return { ...t, [field]: value } as EditableTranslation;
        }
        return t;
      }),
    );
  };

  const getEditingTranslation = (translationId: number) => {
    return editingTranslations.find((t) => t.id === translationId);
  };

  return {
    editingTranslations,
    setEditingTranslations,
    startEditing,
    cancelEditing,
    updateEditingTranslation,
    getEditingTranslation,
  };
};
