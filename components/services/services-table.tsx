"use client";

import { useState } from "react";
import { useServicesStaff } from "@/hooks/useServices";
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Services Management
          </h2>
          <p className="text-muted-foreground">
            Manage your services and their translations.
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/services/add")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>

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
