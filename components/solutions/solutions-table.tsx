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
import { useSolutionMutations } from "@/hooks/solutions/mutations";
import { useSolutionsController } from "@/hooks/solutions/useSolutionsController";
import { useTranslation } from "@/providers/translations-provider";
import { useLang } from "@/hooks/useLang";
import { useSolutionColumns } from "./columns";
import { TableHeader, type FilterInfo } from "@/components/shared/table/table-header";

import type { StaffSolution } from "@/types/solutions.types";
import { fmt } from "@/utils/dictionary-utils";

export function SolutionsTable() {
  const lang = useLang();
  const router = useRouter();
  const { t } = useTranslation();
  const common = useMemo(() => t.common || ({} as any), [t.common]);
  const solutions = useMemo(() => t.solutions || ({} as any), [t.solutions]);
  const action = t.action || ({} as any);
  const validation = t.validation || ({} as any);

  const [solutionToDelete, setSolutionToDelete] = useState<StaffSolution | null>(null);

  const {
    items: solutionsList,
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
  } = useSolutionsController();

  const publishedFilter = urlState.isPublished ?? undefined;
  const featuredFilter = urlState.isFeatured ?? undefined;

  const { del: deleteSolution } = useSolutionMutations();

  const handleDeleteSolution = async () => {
    if (!solutionToDelete) return;

    try {
      await deleteSolution.mutateAsync(solutionToDelete.id);

      toast.success(
        fmt(validation.deletedSuccessfully || "{entity} deleted successfully", {
          entity: solutions.solution || "Solution",
        }),
      );

      setSolutionToDelete(null);
    } catch (error) {
      const errMsg =
        (error as Error).message ||
        fmt(validation.failedToDelete || "Failed to delete {entity}", {
          entity: solutions.solution || "Solution",
        });

      toast.error(errMsg);
      console.error("Error deleting solution:", error);
    }
  };

  const columns = useSolutionColumns({
    lang,
    onDelete: setSolutionToDelete,
  });

  const handleAddSolution = () => {
    router.push(`/${lang}/dashboard/solutions/add`);
  };

  // Prepare filter information for the header
  const filterInfo: FilterInfo[] = useMemo(() => {
    const filters: FilterInfo[] = [];

    if (publishedFilter !== undefined) {
      filters.push({
        key: "isPublished",
        label: (common as any).status || solutions.published || "Status",
        value: publishedFilter ? (solutions.published || "Published") : (solutions.draft || "Draft"),
      });
    }

    if (featuredFilter !== undefined) {
      filters.push({
        key: "isFeatured",
        label: solutions.featured || "Featured",
        value: featuredFilter ? (common.yes || "Yes") : (common.no || "No"),
      });
    }

    return filters;
  }, [publishedFilter, featuredFilter, common, solutions]);

  return (
    <>
      <Card>
        {/* ========================== Page Header ========================== */}
        <TableHeader
          title={solutions.solutionsManagement || "Solutions Management"}
          total={total}
          currentPage={currentPage}
          totalPages={totalPages}
          isLoading={isPending}
          searchTerm={searchTerm}
          filters={filterInfo}
          onClearAllFilters={clearAll}
          onAdd={handleAddSolution}
          addButtonText={`${common.add || "Add"} ${solutions.solution || "Solution"}`}
          entityName={solutions.solution || "Solution"}
          entityNamePlural={solutions.solution || "Solutions"}
        />

        {/* ========================== Table ========================== */}
        <CardContent>
          <DataTable
            tableId="solutions-table"
            columns={columns}
            data={solutionsList}
            isLoading={isPending}
            error={error}
            refetch={refetch}
            emptyMessage={common.notFound || solutions.noSolutionsFound || "No data found"}
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
              noData: common.notFound || solutions.noSolutionsFound || "No data found",
            }}
            toolbarRight={
              <div className="flex flex-wrap items-center gap-2">
                <Select
                  value={publishedFilter === undefined ? "all" : publishedFilter ? "published" : "draft"}
                  onValueChange={(val) => setFilter("isPublished", val === "all" ? undefined : val === "published" ? true : false)}
                >
                  <SelectTrigger className="h-9 w-40">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder={(common as any).status || solutions.published || "Status"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{common.filter || "All"}</SelectItem>
                    <SelectItem value="published">{solutions.published || "Published"}</SelectItem>
                    <SelectItem value="draft">{solutions.draft || "Draft"}</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={featuredFilter === undefined ? "all" : featuredFilter ? "yes" : "no"}
                  onValueChange={(val) => setFilter("isFeatured", val === "all" ? undefined : val === "yes" ? true : false)}
                >
                  <SelectTrigger className="h-9 w-40">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder={solutions.featured || "Featured"} />
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
      {solutionToDelete && (
        <ConfirmationDialog
          open={!!solutionToDelete}
          onOpenChange={(open) => !open && setSolutionToDelete(null)}
          onConfirm={handleDeleteSolution}
          title={common.confirmDelete || "Confirm Delete"}
          description={fmt(validation.confirmDeleteArticle || "Are you sure you want to delete this {{entity}}? This action cannot be undone and will permanently remove the {{entity}} from the system.", {
            entity: solutionToDelete.name || solutionToDelete.slug,
          })}
          isLoading={deleteSolution.isPending}
          variant="destructive"
        />
      )}
    </>
  );
}
