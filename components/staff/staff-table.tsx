"use client";

import { useState } from "react";
import { DataTable } from "@/components/shared/data-table";
import { useStaffTableConfig } from "@/components/staff/staff-table.config";
import { useStaff } from "@/hooks/staff/useStaff";
import { useTranslation } from "@/providers/translations-provider";

export function StaffTable() {
  const [selectedStaff, setSelectedStaff] = useState<number[]>([]);
  const {
    staff,
    pagination,
    totalPages,
    setPage,
    nextPage,
    prevPage,
    isLoading,
    isError,
    error,
    deleteStaff,
    isDeleting,
  } = useStaff({ page: 1, limit: 10 });

  const tableConfig = useStaffTableConfig();

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleFirstPage = () => {
    setPage(1);
  };

  const handleLastPage = () => {
    setPage(totalPages);
  };
const {t} = useTranslation();
  return (
    <DataTable
      data={staff || []}
      columns={tableConfig.columns}
      actions={tableConfig.actions}
      selectable={true}
      onSelectionChange={setSelectedStaff}
      getItemId={(member) => member.id}
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
      onDelete={deleteStaff}
      entityName={t.staffs.staff}
    />
  );
}
