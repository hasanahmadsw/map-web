"use client";

import { Edit, FileText, Star, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/providers/translations-provider";
import type { TableAction, TableColumn } from "../shared/data-table";

export function useArticlesTableConfig() {
  const { t } = useTranslation();

  const columns: TableColumn[] = [
    {
      key: "title",
      label: t.articles.articleTitle,
      render: (article: any) => {
        const translation = article.translations?.[0];
        return <div className="font-medium">{translation?.name || article.slug}</div>;
      },
    },
    {
      key: "tags",
      label: t.tags.title,
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
      label: t.topics.title,
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
      label: t.translations.status,
      render: (article: any) => (
        <div className="flex items-center gap-2">
          <Badge variant={article.isPublished ? "default" : "secondary"}>
            {article.isPublished ? t.articles.published : t.articles.draft}
          </Badge>
          {article.isFeatured && (
            <Badge variant="outline" className="text-xs">
              <Star className="h-3 w-3 mr-1" />
              {t.articles.featured}
            </Badge>
          )}
        </div>
      ),
    },
  ];

  const actions: TableAction[] = [
    {
      key: "edit",
      label: t.common.edit,
      icon: <Edit className="mr-2 h-4 w-4" />,
      href: (article: any) => `/dashboard/articles/${article.id}`,
    },
    {
      key: "delete",
      label: t.common.delete,
      icon: <Trash2 className="mr-2 h-4 w-4" />,
      variant: "destructive",
    },
  ];

  return {
    columns,
    actions,
    emptyStateIcon: <FileText className="h-8 w-8 text-muted-foreground" />,
    emptyStateMessage: t.translations.noArticlesFound,
    errorMessage: t.translations.failedToLoadArticles,
    deleteConfirmationMessage: t.common.confirmDeleteArticle,
  };
}
