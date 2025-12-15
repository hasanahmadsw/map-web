'use client';

import { useState, useMemo } from 'react';

import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';
import { DataTable } from '@/components/shared/table/data-table';
import { ConfirmationDialog } from '@/components/confirmation-dialog';

import { useStaffMutations } from '@/hooks/staff/mutations';
import { useStaffController } from '@/hooks/staff/useStaffController';
import { useTranslation } from '@/providers/translations-provider';
import { useLang } from '@/hooks/useLang';
import { useStaffColumns } from './columns';
import { TableHeader, type FilterInfo } from '@/components/shared/table/table-header';

import type { Staff } from '@/types/staff.types';
import type { Role } from '@/types/staff.types';
import { fmt } from '@/utils/dictionary-utils';
import dynamic from 'next/dynamic';
import DialogSkeleton from '@/components/shared/skeletons/dialog-skeleton';
import { SelectFilter } from '@/components/shared/selects/select-filter';

const AddStaffMemberDynamic = dynamic(() => import('./form/add-staff').then(mod => mod.AddStaffMember), {
  ssr: false,
  loading: () => <DialogSkeleton />,
});
const ConfirmationDialogDynamic = dynamic(
  () => import('@/components/confirmation-dialog').then(mod => mod.ConfirmationDialog),
  {
    ssr: false,
    loading: () => <DialogSkeleton />,
  },
);

function StaffTable() {
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
        fmt(validation.deletedSuccessfully || '{entity} deleted successfully', {
          entity: staffs.staff || 'Staff',
        }),
      );

      setStaffToDelete(null);
    } catch (error) {
      const errMsg =
        (error as Error).message ||
        fmt(validation.failedToDelete || 'Failed to delete {entity}', {
          entity: staffs.staff || 'Staff',
        });

      toast.error(errMsg);
      console.error('Error deleting staff:', error);
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
        roleFilter === 'superadmin'
          ? 'Super Admin'
          : roleFilter === 'admin'
            ? 'Admin'
            : roleFilter === 'author'
              ? 'Author'
              : roleFilter;
      filters.push({
        key: 'role',
        label: staffs.role || 'Role',
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
          title={staffs.staffMembers || 'Staff Members'}
          total={total}
          currentPage={currentPage}
          totalPages={totalPages}
          isLoading={isPending}
          searchTerm={searchTerm}
          filters={filterInfo}
          onClearAllFilters={clearAll}
          onAdd={handleAddStaff}
          addButtonText={`${common.add || 'Add'} ${staffs.staff || 'Staff'}`}
          entityName={staffs.staff || 'Staff'}
          entityNamePlural={staffs.staffMembers || 'Staff'}
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
            emptyMessage={common.notFound || staffs.noStaff || 'No data found'}
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
              searchPlaceholder: common.searchPlaceholder || staffs.searchStaff || 'Search...',
              noData: common.notFound || staffs.noStaff || 'No data found',
            }}
            toolbarRight={
              <div className="flex flex-wrap items-center gap-2">
                <SelectFilter
                  value={roleFilter || 'all'}
                  onValueChange={val => setFilter('role', val === 'all' ? undefined : (val as Role))}
                  options={[
                    { value: 'all', label: 'All' },
                    { value: 'superadmin', label: 'Super Admin' },
                    { value: 'admin', label: 'Admin' },
                    { value: 'author', label: 'Author' },
                  ]}
                  allOptionLabel="All Roles"
                  className="w-32"
                />

                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearAll} className="gap-1">
                    {action.clearAll || common.clear || 'Clear All'}
                  </Button>
                )}
              </div>
            }
            lang={lang}
          />
        </CardContent>
      </Card>

      {/* ========================== Add Modal ========================== */}
      {isAddModalOpen && (
        <AddStaffMemberDynamic isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} />
      )}

      {/* ========================== Delete Modal ========================== */}
      {staffToDelete && (
        <ConfirmationDialogDynamic
          open={!!staffToDelete}
          onOpenChange={open => !open && setStaffToDelete(null)}
          onConfirm={handleDeleteStaff}
          title="Confirm Delete"
          description="Are you sure you want to delete this staff member? This action cannot be undone and will permanently remove the staff member from the system."
          isLoading={deleteStaff.isPending}
          variant="destructive"
        />
      )}
    </>
  );
}

export default StaffTable;
