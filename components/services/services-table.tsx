"use client";

import { useState, useMemo } from "react";

import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";
import { DataTable } from "@/components/shared/table/data-table";
import { ConfirmationDialog } from "@/components/confirmation-dialog";

import { useRouter } from "next/navigation";
import { useServiceMutations } from "@/hooks/services/mutations";
import { useServicesController } from "@/hooks/services/useServicesController";
import { useTranslation } from "@/providers/translations-provider";
import { useLang } from "@/hooks/useLang";
import { useServiceColumns } from "./columns";
import { TableHeader, type FilterInfo } from "@/components/shared/table/table-header";

import type { StaffService } from "@/types/services.types";
import { fmt } from "@/utils/dictionary-utils";

export function ServicesTable() {
  const lang = useLang();
  const router = useRouter();
  const { t } = useTranslation();
  const common = useMemo(() => t.common || ({} as any), [t.common]);
  const services = useMemo(() => t.services || ({} as any), [t.services]);
  const action = t.action || ({} as any);
  const validation = t.validation || ({} as any);

  const [serviceToDelete, setServiceToDelete] = useState<StaffService | null>(null);

  const {
    items: servicesList,
    total,
    totalPages,
    error,
    isPending,
    refetch,

    currentPage,
    pageSize,
    searchTerm,
    urlState,
    hasActiveFilters,

    setSearch,
    setPage,
    setPageSize,
    setFilter,
    clearAll,
  } = useServicesController();

  const publishedFilter = urlState.isPublished ?? undefined;
  const featuredFilter = urlState.isFeatured ?? undefined;

  const { del: deleteService } = useServiceMutations();

  const handleDeleteService = async () => {
    if (!serviceToDelete) return;

    try {
      await deleteService.mutateAsync(serviceToDelete.id);

      toast.success(
        fmt(validation.deletedSuccessfully || "{entity} deleted successfully", {
          entity: services.service || "Service",
        }),
      );

      setServiceToDelete(null);
    } catch (error) {
      const errMsg =
        (error as Error).message ||
        fmt(validation.failedToDelete || "Failed to delete {entity}", {
          entity: services.service || "Service",
        });

      toast.error(errMsg);
      console.error("Error deleting service:", error);
    }
  };

  const columns = useServiceColumns({
    lang,
    onDelete: setServiceToDelete,
  });

  const handleAddService = () => {
    router.push(`/${lang}/dashboard/services/add`);
  };

  // Prepare filter information for the header
  const filterInfo: FilterInfo[] = useMemo(() => {
    const filters: FilterInfo[] = [];

    if (publishedFilter !== undefined) {
      filters.push({
        key: "isPublished",
        label: (common as any).status || services.published || "Status",
        value: publishedFilter ? (services.published || "Published") : (services.draft || "Draft"),
      });
    }

    if (featuredFilter !== undefined) {
      filters.push({
        key: "isFeatured",
        label: services.featured || "Featured",
        value: featuredFilter ? (common.yes || "Yes") : (common.no || "No"),
      });
    }

    return filters;
  }, [publishedFilter, featuredFilter, common, services]);

  return (
    <>
      <Card>
        {/* ========================== Page Header ========================== */}
        <TableHeader
          title={services.servicesManagement || "Services Management"}
          total={total}
          currentPage={currentPage}
          totalPages={totalPages}
          isLoading={isPending}
          searchTerm={searchTerm}
          filters={filterInfo}
          onClearAllFilters={clearAll}
          onAdd={handleAddService}
          addButtonText={`${common.add || "Add"} ${services.service || "Service"}`}
          entityName={services.service || "Service"}
          entityNamePlural={services.service || "Services"}
        />

        {/* ========================== Table ========================== */}
        <CardContent>
          <DataTable
            tableId="services-table"
            columns={columns}
            data={servicesList}
            isLoading={isPending}
            error={error}
            refetch={refetch}
            emptyMessage={common.notFound || services.noServicesFound || "No data found"}
            pageIndex={currentPage}
            pageSize={pageSize}
            totalRows={total}
            totalPages={totalPages}
            canNextPage={currentPage < totalPages}
            canPrevPage={currentPage > 1}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            enableClientSorting={true}
            enableGlobalFilter={true}
            onGlobalFilterChange={setSearch}
            initialGlobalFilter={searchTerm}
            manualFiltering={true}
            messages={{
              searchPlaceholder: common.searchPlaceholder || "Search...",
              noData: common.notFound || services.noServicesFound || "No data found",
            }}
            toolbarRight={
              <div className="flex flex-wrap items-center gap-2">
                <Select
                  value={publishedFilter === undefined ? "all" : publishedFilter ? "published" : "draft"}
                  onValueChange={(val) => setFilter("isPublished", val === "all" ? undefined : val === "published" ? true : false)}
                >
                  <SelectTrigger className="h-9 w-40">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder={(common as any).status || services.published || "Status"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{common.filter || "All"}</SelectItem>
                    <SelectItem value="published">{services.published || "Published"}</SelectItem>
                    <SelectItem value="draft">{services.draft || "Draft"}</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={featuredFilter === undefined ? "all" : featuredFilter ? "yes" : "no"}
                  onValueChange={(val) => setFilter("isFeatured", val === "all" ? undefined : val === "yes" ? true : false)}
                >
                  <SelectTrigger className="h-9 w-40">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder={services.featured || "Featured"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{common.filter || "All"}</SelectItem>
                    <SelectItem value="yes">{common.yes || "Yes"}</SelectItem>
                    <SelectItem value="no">{common.no || "No"}</SelectItem>
                  </SelectContent>
                </Select>

                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearAll} className="gap-1">
                    {action.clearAll || common.clear || "Clear All"}
                  </Button>
                )}
              </div>
            }
            lang={lang}
          />
        </CardContent>
      </Card>

      {/* ========================== Delete Modal ========================== */}
      {serviceToDelete && (
        <ConfirmationDialog
          open={!!serviceToDelete}
          onOpenChange={(open) => !open && setServiceToDelete(null)}
          onConfirm={handleDeleteService}
          title={common.confirmDelete || "Confirm Delete"}
          description={fmt(validation.confirmDeleteArticle || "Are you sure you want to delete this {{entity}}? This action cannot be undone and will permanently remove the {{entity}} from the system.", {
            entity: serviceToDelete.name || serviceToDelete.slug,
          })}
          isLoading={deleteService.isPending}
          variant="destructive"
        />
      )}
    </>
  );
}
