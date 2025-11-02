"use client";

import { useState } from "react";
import { useSolutionsStaff } from "@/hooks/solutions/useSolutions";
import { DataTable } from "@/components/shared/data-table";
import { useSolutionsTableConfig } from "@/components/solutions/solutions-table.config";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useTranslation } from "@/providers/translations-provider";
import { useRouter } from "next/navigation";

export function SolutionsTable() {
  const [selectedSolutions, setSelectedSolutions] = useState<number[]>([]);
  const {
    solutions,
    pagination,
    totalPages,
    setPage,
    nextPage,
    prevPage,
    isLoading,
    isError,
    error,
    deleteSolution,
    isDeleting,
  } = useSolutionsStaff({ page: 1, limit: 10 });

  const tableConfig = useSolutionsTableConfig();
  const { t } = useTranslation();
  const router = useRouter();

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
    <div className="space-y-4">
 

      <DataTable
        data={solutions || []}
        columns={tableConfig.columns}
        actions={tableConfig.actions}
        selectable={true}
        onSelectionChange={setSelectedSolutions}
        getItemId={(solution) => solution.id}
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
        onDelete={deleteSolution}
        entityName="solution"
      />
    </div>
  );
}
