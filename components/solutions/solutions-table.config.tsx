"use client";

import { Edit, Settings, Star, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/providers/translations-provider";
import type { TableAction, TableColumn } from "../shared/data-table";

export function useSolutionsTableConfig() {
  const { t } = useTranslation();

  const columns: TableColumn[] = [
    {
      key: "name",
      label: "Solution Name",
      render: (solution: any) => {
        const translation = solution.translations?.[0];
        return <div className="font-medium">{translation?.name || solution.slug}</div>;
      },
    },
    {
      key: "description",
      label: "Description",
      render: (solution: any) => {
        const translation = solution.translations?.[0];
        return (
          <div className="max-w-xs truncate text-sm text-muted-foreground">
            {translation?.shortDescription || translation?.description || ""}
          </div>
        );
      },
    },
    {
      key: "order",
      label: "Order",
      render: (solution: any) => (
        <div className="text-sm font-mono">{solution.order || 0}</div>
      ),
    },
    {
      key: "status",
      label: t.translations?.status || "Status",
      render: (solution: any) => (
        <div className="flex items-center gap-2">
          <Badge variant={solution.isPublished ? "default" : "secondary"}>
            {solution.isPublished ? "Published" : "Draft"}
          </Badge>
          {solution.isFeatured && (
            <Badge variant="outline" className="text-xs">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>
      ),
    },
  ];

  const actions: TableAction[] = [
    {
      key: "edit",
      label: t.common?.edit || "Edit",
      icon: <Edit className="mr-2 h-4 w-4" />,
      href: (solution: any) => `/dashboard/solutions/${solution.id}`,
    },
    {
      key: "delete",
      label: t.common?.delete || "Delete",
      icon: <Trash2 className="mr-2 h-4 w-4" />,
      variant: "destructive",
    },
  ];

  return {
    columns,
    actions,
    emptyStateIcon: <Settings className="h-8 w-8 text-muted-foreground" />,
    emptyStateMessage: "No solutions found",
    errorMessage: "Failed to load solutions",
    deleteConfirmationMessage: t.common?.confirmDelete || "Are you sure you want to delete this solution?",
  };
}
