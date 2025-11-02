"use client";

import { useState } from "react";
import { useArticlesStaff } from "@/hooks/articles/useArticles";
import { DataTable } from "@/components/shared/data-table";
import { useArticlesTableConfig } from "@/components/articles/articles-table.config";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useTranslation } from "@/providers/translations-provider";
import { useRouter } from "next/navigation";

export function ArticlesTable() {
  const [selectedArticles, setSelectedArticles] = useState<number[]>([]);
  const {
    articles,
    pagination,
    totalPages,
    setPage,
    nextPage,
    prevPage,
    isLoading,
    isError,
    error,
    deleteArticle,
    isDeleting,
  } = useArticlesStaff({ page: 1, limit: 10 });

  const tableConfig = useArticlesTableConfig();
  const { t } = useTranslation();
  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleFirstPage = () => {
    setPage(1);
  };

  const handleLastPage = () => {
    setPage(totalPages);
  };

  return (
    <DataTable
      data={articles || []}
      columns={tableConfig.columns}
      actions={tableConfig.actions}
      selectable={true}
      onSelectionChange={setSelectedArticles}
      getItemId={(article) => article.id}
      pagination={pagination}
      onPageChange={handlePageChange}
      onPrevious={prevPage}
      onNext={nextPage}
      onFirstPage={handleFirstPage}
      onLastPage={handleLastPage}
      isLoading={isLoading}
      isError={isError}
      error={error || undefined}
      isDeleting={isDeleting}
      emptyStateIcon={tableConfig.emptyStateIcon}
      emptyStateMessage={tableConfig.emptyStateMessage}
      errorMessage={tableConfig.errorMessage}
      deleteConfirmationMessage={tableConfig.deleteConfirmationMessage}
      onDelete={deleteArticle}
      entityName={t.articles.article}
    />
  );
}
