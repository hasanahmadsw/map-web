'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { DataTable } from '@/components/shared/table/data-table';

import { TableHeader } from '@/components/shared/table/table-header';

import type { Staff } from '@/types/staff.types';
import dynamic from 'next/dynamic';
import DialogSkeleton from '@/components/shared/skeletons/dialog-skeleton';
import { SelectFilter } from '@/components/shared/selects/select-filter';
import { useStaffTable } from './use-staff-table';

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

function StaffTable() {
  const {
    staff,
    total,
    totalPages,
    error,
    isPending,
    refetch,

    currentPage,
    pageSize,
    searchTerm,
    hasActiveFilters,

    roleFilter,
    filterInfo,
    columns,

    activeDialog,
    selectedStaff,
    deleteStaff,

    setSearch,
    setPage,
    setPageSize,
    clearAll,
    setActiveDialog,

    handleAddStaff,
    handleDeleteStaff,
    handleRoleFilterChange,
  } = useStaffTable()

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
                  onValueChange={handleRoleFilterChange}
                  options={[
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
          loadingText="Deleting..."
          isLoading={deleteStaff.isPending}
          variant="destructive"
        />
      )}
    </>
  );
}

export default StaffTable;
