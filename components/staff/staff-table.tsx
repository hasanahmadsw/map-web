"use client";

import { useState, useMemo } from "react";

import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";
import { DataTable } from "@/components/shared/table/data-table";
import { ConfirmationDialog } from "@/components/confirmation-dialog";

import { useStaffMutations } from "@/hooks/staff/mutations";
import { useStaffController } from "@/hooks/staff/useStaffController";
import { useTranslation } from "@/providers/translations-provider";
import { useLang } from "@/hooks/useLang";
import { useStaffColumns } from "./columns";
import { TableHeader, type FilterInfo } from "@/components/shared/table/table-header";

import type { Staff } from "@/types/staff.types";
import type { Role } from "@/types/staff.types";
import { fmt } from "@/utils/dictionary-utils";

export function StaffTable() {
  const lang = useLang();
  const { t } = useTranslation();
  const common = t.common || {};
  const staffs = t.staffs || {};
  const action = t.action || {};
  const validation = t.validation || {};

  const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  const {
    items: staff,
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
  } = useStaffController();

  const roleFilter = urlState.role ?? undefined;

  const { del: deleteStaff } = useStaffMutations();

  const handleDeleteStaff = async () => {
    if (!staffToDelete) return;

    try {
      await deleteStaff.mutateAsync(staffToDelete.id);

      toast.success(
        fmt(validation.deletedSuccessfully || "{entity} deleted successfully", {
          entity: staffs.staff || "Staff",
        }),
      );

      setStaffToDelete(null);
    } catch (error) {
      const errMsg =
        (error as Error).message ||
        fmt(validation.failedToDelete || "Failed to delete {entity}", {
          entity: staffs.staff || "Staff",
        });

      toast.error(errMsg);
      console.error("Error deleting staff:", error);
    }
  };

  const columns = useStaffColumns({
    lang,
    onDelete: setStaffToDelete,
  });

  const handleAddStaff = () => {
    setAddModalOpen(true);
  };

  // Prepare filter information for the header
  const filterInfo: FilterInfo[] = useMemo(() => {
    const filters: FilterInfo[] = [];

    if (roleFilter) {
      const roleLabel =
        roleFilter === "superadmin"
          ? "Super Admin"
          : roleFilter === "admin"
            ? "Admin"
            : roleFilter === "author"
              ? "Author"
              : roleFilter;
      filters.push({
        key: "role",
        label: staffs.role || "Role",
        value: roleLabel,
      });
    }

    return filters;
  }, [roleFilter, staffs.role]);

  return (
    <>
      <Card>
        {/* ========================== Page Header ========================== */}
        <TableHeader
          title={staffs.staffMembers || "Staff Members"}
          total={total}
          currentPage={currentPage}
          totalPages={totalPages}
          isLoading={isPending}
          searchTerm={searchTerm}
          filters={filterInfo}
          onClearAllFilters={clearAll}
          onAdd={handleAddStaff}
          addButtonText={`${common.add || "Add"} ${staffs.staff || "Staff"}`}
          entityName={staffs.staff || "Staff"}
          entityNamePlural={staffs.staffMembers || "Staff"}
        />

        {/* ========================== Table ========================== */}
        <CardContent>
          <DataTable
            tableId="staff-table"
            columns={columns}
            data={staff}
            isLoading={isPending}
            error={error}
            refetch={refetch}
            emptyMessage={common.notFound || staffs.noStaff || "No data found"}
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
              searchPlaceholder: common.searchPlaceholder || staffs.searchStaff || "Search...",
              noData: common.notFound || staffs.noStaff || "No data found",
            }}
            toolbarRight={
              <div className="flex flex-wrap items-center gap-2">
                <Select
                  value={roleFilter || "all"}
                  onValueChange={(val) => setFilter("role", val === "all" ? undefined : (val as Role))}
                >
                  <SelectTrigger className="h-9 w-40">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder={staffs.role || "Role"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{common.filter || "All"}</SelectItem>
                    <SelectItem value="superadmin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="author">Author</SelectItem>
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
      {staffToDelete && (
        <ConfirmationDialog
          open={!!staffToDelete}
          onOpenChange={(open) => !open && setStaffToDelete(null)}
          onConfirm={handleDeleteStaff}
          title={common.confirmDelete || staffs.deleteStaff || "Confirm Delete"}
          description={fmt(validation.confirmDeleteArticle || "Are you sure you want to delete this {{entity}}? This action cannot be undone and will permanently remove the {{entity}} from the system.", {
            entity: staffToDelete.name,
          })}
          isLoading={deleteStaff.isPending}
          variant="destructive"
        />
      )}
    </>
  );
}
