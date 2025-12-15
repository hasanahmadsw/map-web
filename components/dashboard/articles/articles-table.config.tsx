"use client";

import { Edit, FileText, Star, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { TableAction, TableColumn } from "../../shared/data-table";

export function useArticlesTableConfig() {


  const columns: TableColumn[] = [
    {
      key: "title",
      label: "Title",
      render: (article: any) => {
        return <div className="font-medium">{article.name || article.slug}</div>;
      },
    },
    {
      key: "tags",
      label: "Tags",
      render: (article: any) => {
        const tags =
          article.tags
            ?.map((tag: any) => {
              const translation = tag.translations?.[0];
              return translation?.name || tag.slug;
            })
            .join(", ") || "";
        return <div className="max-w-xs truncate text-sm text-muted-foreground">{tags}</div>;
      },
    },
    {
      key: "topics",
      label: "Topics",
      render: (article: any) => {
        const topics =
          article.topics
            ?.map((topic: any) => {
              const translation = topic.translations?.[0];
              return translation?.name || topic.slug;
            })
            .join(", ") || "";
        return <div className="max-w-xs truncate text-sm text-muted-foreground">{topics}</div>;
      },
    },
    {
      key: "status",
      label: "Status",
      render: (article: any) => (
        <div className="flex items-center gap-2">
          <Badge variant={article.isPublished ? "default" : "secondary"}>
            {article.isPublished ? "Published" : "Draft"}
          </Badge>
          {article.isFeatured && (
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
      label: "Edit",
      icon: <Edit className="mr-2 h-4 w-4 text-green-500" />,
      href: (article: any) => `/dashboard/articles/${article.id}`,
    },
    {
      key: "delete",
      label: "Delete",
      icon: <Trash2 className="mr-2 h-4 w-4  text-destructive" />,
      variant: "destructive",
    },
  ];

  return {
    columns,
    actions,
    emptyStateIcon: <FileText className="h-8 w-8 text-muted-foreground" />,
    emptyStateMessage: "No articles found",
    errorMessage: "Failed to load articles",
    deleteConfirmationMessage: "Are you sure you want to delete this article?",
  };
}
