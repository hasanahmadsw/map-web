"use client";

import { Globe, Edit, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/providers/translations-provider";
import type { Language } from "@/types/language.types";
import type { TableColumn } from "@/components/shared/data-table";

interface UseLanguagesTableConfigOptions {
  onEdit?: (language: Language) => void;
  onDelete?: (language: Language) => void;
}

export function useLanguagesTableConfig(options: UseLanguagesTableConfigOptions = {}) {
  const { t } = useTranslation();
  const { onEdit, onDelete } = options;

  const columns: TableColumn[] = [
    {
      key: "code",
      label: t.languages?.code || "Code",
      render: (language: Language) => (
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono text-sm">{language.code}</span>
        </div>
      ),
    },
    {
      key: "name",
      label: t.languages?.name || "Name",
      render: (language: Language) => (
        <div className="font-medium">{language.name}</div>
      ),
    },
    {
      key: "nativeName",
      label: t.languages?.nativeName || "Native Name",
      render: (language: Language) => (
        <div className="text-muted-foreground">{language.nativeName}</div>
      ),
    },
    {
      key: "isDefault",
      label: t.languages?.default || "Default",
      render: (language: Language) => {
        return language.isDefault ? (
          <Badge variant="secondary" className="flex items-center gap-1 bg-green-100 text-green-800 border-green-200">
            <Star className="h-3 w-3" />
            {t.languages?.default || "Default"}
          </Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
  
  ];

  const actions = [
    {
      key: "edit",
      label: t.common?.edit || "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: (language: Language) => {
        onEdit?.(language);
      },
    },
    {
      key: "delete",
      label: t.common?.delete || "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (language: Language) => {
        onDelete?.(language);
      },
      variant: "destructive" as const,
    },
  ];

  return {
    columns,
    actions,
    emptyStateIcon: <Globe className="h-8 w-8 text-muted-foreground" />,
    emptyStateMessage: t.languages?.noLanguages || "No languages found",
    errorMessage: t.common?.error || "Error loading languages",
    deleteConfirmationMessage: t.languages?.deleteConfirmation || "Are you sure you want to delete this language?",
  };
}
