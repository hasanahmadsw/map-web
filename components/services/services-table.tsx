"use client";

import { useState } from "react";
import { useServicesStaff } from "@/hooks/services/useServices";
import { DataTable } from "@/components/shared/data-table";
import { useServicesTableConfig } from "@/components/services/services-table.config";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useTranslation } from "@/providers/translations-provider";
import { useRouter } from "next/navigation";

export function ServicesTable() {
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const {
    services,
    pagination,
    totalPages,
    setPage,
    nextPage,
    prevPage,
    isLoading,
    isError,
    error,
    deleteService,
    isDeleting,
  } = useServicesStaff({ page: 1, limit: 10 });

  const tableConfig = useServicesTableConfig();
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
        data={services || []}
        columns={tableConfig.columns}
        actions={tableConfig.actions}
        selectable={true}
        onSelectionChange={setSelectedServices}
        getItemId={(service) => service.id}
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
        onDelete={deleteService}
        entityName="service"
      />
    </div>
  );
}
