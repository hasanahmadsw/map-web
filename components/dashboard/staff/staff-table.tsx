'use client';

import { useState, useMemo } from 'react';

import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { DataTable } from '@/components/shared/table/data-table';

import { useStaffMutations } from '@/hooks/staff/mutations';
import { useStaffController } from '@/hooks/staff/useStaffController';
import { useStaffColumns } from './columns';
import { TableHeader, type FilterInfo } from '@/components/shared/table/table-header';

import type { Staff } from '@/types/staff.types';
import type { Role } from '@/types/staff.types';
import dynamic from 'next/dynamic';
import DialogSkeleton from '@/components/shared/skeletons/dialog-skeleton';
import { SelectFilter } from '@/components/shared/selects/select-filter';

const AddStaffMemberDynamic = dynamic(() => import('./form/add-staff-form'), {
  ssr: false,
  loading: () => <DialogSkeleton />,
});

const EditStaffMemberDynamic = dynamic(() => import('./form/edit-staff-form'), {
  ssr: false,
  loading: () => <DialogSkeleton />,
});

const ConfirmationDialogDynamic = dynamic(
  () => import('@/components/shared/confirmation-dialog').then(mod => mod.ConfirmationDialog),
  {
    ssr: false,
    loading: () => <DialogSkeleton />,
  },
);

type DialogType = 'add' | 'edit' | 'delete' | null;

function StaffTable() {
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

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

  const handleEdit = (staff: Staff) => {
    setSelectedStaff(staff);
    setActiveDialog('edit');
  };

  const handleDelete = (staff: Staff) => {
    setSelectedStaff(staff);
    setActiveDialog('delete');
  };

  const handleDeleteStaff = async () => {
    if (!selectedStaff) return;

    try {
      await deleteStaff.mutateAsync(selectedStaff.id);

      toast.success('Staff deleted successfully');

      setSelectedStaff(null);
    } catch (error) {
      const errMsg = (error as Error).message || 'Failed to delete staff';

      toast.error(errMsg);
      console.error('Error deleting staff:', error);
    }
  };

  const columns = useStaffColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  const handleAddStaff = () => {
    setActiveDialog('add');
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
        label: 'Role',
        value: roleLabel,
      });
    }

    return filters;
  }, [roleFilter]);

  return (
    <>
      <Card>
        {/* ========================== Page Header ========================== */}
        <TableHeader
          title={'Staff Members'}
          total={total}
          currentPage={currentPage}
          totalPages={totalPages}
          isLoading={isPending}
          searchTerm={searchTerm}
          filters={filterInfo}
          onClearAllFilters={clearAll}
          onAdd={handleAddStaff}
          addButtonText={`Add Staff`}
          entityName={'Staff'}
          entityNamePlural={'Staff'}
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
            emptyMessage={'No data found'}
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
              searchPlaceholder: 'Search...',
              noData: 'No data found',
            }}
            toolbarRight={
              <div className="flex flex-wrap items-center gap-2">
                <SelectFilter
                  value={roleFilter || 'all'}
                  onValueChange={val =>
                    setFilter('role', (val as string) === 'all' ? undefined : (val as Role))
                  }
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
                    Clear All
                  </Button>
                )}
              </div>
            }
            lang="en"
          />
        </CardContent>
      </Card>

      {/* ========================== Add Modal ========================== */}
      {activeDialog === 'add' && (
        <AddStaffMemberDynamic isOpen={activeDialog === 'add'} onClose={() => setActiveDialog(null)} />
      )}

      {/* ========================== Edit Modal ========================== */}
      {activeDialog === 'edit' && (
        <EditStaffMemberDynamic
          isOpen={activeDialog === 'edit'}
          onClose={() => setActiveDialog(null)}
          staff={selectedStaff as Staff}
        />
      )}

      {/* ========================== Delete Modal ========================== */}
      {activeDialog === 'delete' && (
        <ConfirmationDialogDynamic
          open={activeDialog === 'delete'}
          onOpenChange={open => !open && setActiveDialog(null)}
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
