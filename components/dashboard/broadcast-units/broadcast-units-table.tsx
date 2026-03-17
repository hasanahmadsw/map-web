'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { DataTable } from '@/components/shared/table/data-table';

import { TableHeader } from '@/components/shared/table/table-header';
import dynamic from 'next/dynamic';
import DialogSkeleton from '../../shared/skeletons/dialog-skeleton';
import { SelectFilter } from '@/components/shared/selects/select-filter';
import { BroadcastType } from '@/types/broadcasts/broadcast.enums';
import { useBroadcastUnitsTable } from './use-broadcast-units-table';

const ConfirmationDialogDynamic = dynamic(
  () => import('@/components/shared/confirmation-dialog').then(mod => mod.ConfirmationDialog),
  {
    ssr: false,
    loading: () => <DialogSkeleton />,
  },
);

export function BroadcastUnitsTable() {
  const {
    broadcastUnitsList,
    total,
    totalPages,
    error,
    isPending,
    refetch,

    currentPage,
    pageSize,
    searchTerm,
    hasActiveFilters,

    filterInfo,
    broadcastTypeOptions,

    publishedSelectValue,
    typeSelectValue,

    columns,
    broadcastUnitToDelete,
    deleteBroadcastUnit,
    setBroadcastUnitToDelete,

    setSearch,
    setPage,
    setPageSize,
    clearAll,

    handleAddBroadcastUnit,
    handleDeleteBroadcastUnit,
    handlePublishedFilterChange,
    handleTypeFilterChange,
  } = useBroadcastUnitsTable()

  return (
    <>
      <Card>
        {/* ========================== Page Header ========================== */}
        <TableHeader
          title="Broadcast Units Management"
          total={total}
          currentPage={currentPage}
          totalPages={totalPages}
          isLoading={isPending}
          searchTerm={searchTerm}
          filters={filterInfo}
          onClearAllFilters={clearAll}
          onAdd={handleAddBroadcastUnit}
          addButtonText={`Add Broadcast Unit`}
          entityName="Broadcast Unit"
          entityNamePlural="Broadcast Units"
        />

        {/* ========================== Table ========================== */}
        <CardContent>
          <DataTable
            tableId="broadcast-units-table"
            columns={columns}
            data={broadcastUnitsList}
            isLoading={isPending}
            error={error}
            refetch={refetch}
            emptyMessage="No data found"
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
                  value={publishedSelectValue}
                  onValueChange={handlePublishedFilterChange}
                  options={[
                    { value: 'true', label: 'Published' },
                    { value: 'false', label: 'Draft' },
                  ]}
                  allOptionLabel="All Status"
                  className="w-32"
                />
                <SelectFilter
                  value={typeSelectValue}
                  onValueChange={handleTypeFilterChange}
                  options={broadcastTypeOptions}
                  allOptionLabel="All Types"
                  className="w-40"
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

      {/* ========================== Delete Modal ========================== */}
      {broadcastUnitToDelete && (
        <ConfirmationDialogDynamic
          open={!!broadcastUnitToDelete}
          onOpenChange={open => !open && setBroadcastUnitToDelete(null)}
          onConfirm={handleDeleteBroadcastUnit}
          title="Confirm Delete"
          description="Are you sure you want to delete this Broadcast Unit? This action cannot be undone and will permanently remove the Broadcast Unit from the system."
          loadingText="Deleting..."
          isLoading={deleteBroadcastUnit.isPending}
          variant="destructive"
        />
      )}
    </>
  );
}
