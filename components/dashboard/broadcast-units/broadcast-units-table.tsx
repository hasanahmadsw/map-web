'use client';

import { useState, useMemo } from 'react';

import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { DataTable } from '@/components/shared/table/data-table';

import { useRouter } from 'next/navigation';
import { useBroadcastUnitMutations } from '@/hooks/api/broadcasts/broadcast-unit-mutations';
import { useBroadcastUnitsController } from '@/hooks/api/broadcasts/useBroadcastUnitsController';

import { useBroadcastUnitColumns } from './columns';
import { TableHeader, type FilterInfo } from '@/components/shared/table/table-header';

import type { BroadcastUnit } from '@/types/broadcasts/broadcasts.types';
import dynamic from 'next/dynamic';
import DialogSkeleton from '../../shared/skeletons/dialog-skeleton';
import { SelectFilter } from '@/components/shared/selects/select-filter';
import { BroadcastType } from '@/types/broadcasts/broadcast.enums';

const ConfirmationDialogDynamic = dynamic(
  () => import('@/components/shared/confirmation-dialog').then(mod => mod.ConfirmationDialog),
  {
    ssr: false,
    loading: () => <DialogSkeleton />,
  },
);

export function BroadcastUnitsTable() {
  const router = useRouter();

  const [broadcastUnitToDelete, setBroadcastUnitToDelete] = useState<BroadcastUnit | null>(null);

  const {
    items: broadcastUnitsList,
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
  } = useBroadcastUnitsController();

  const publishedFilter = urlState.isPublished ?? undefined;
  const typeFilter = urlState.type ?? undefined;

  const { del: deleteBroadcastUnit } = useBroadcastUnitMutations();

  const handleDeleteBroadcastUnit = async () => {
    if (!broadcastUnitToDelete) return;

    try {
      await deleteBroadcastUnit.mutateAsync(broadcastUnitToDelete.id);

      toast.success('Broadcast unit deleted successfully');

      setBroadcastUnitToDelete(null);
    } catch (error) {
      const errMsg = (error as Error).message || 'Failed to delete Broadcast Unit';

      toast.error(errMsg);
      console.error('Error deleting broadcast unit:', error);
    }
  };

  const columns = useBroadcastUnitColumns({
    onDelete: setBroadcastUnitToDelete,
  });

  const handleAddBroadcastUnit = () => {
    router.push(`/dashboard/broadcast-units/add`);
  };

  // Prepare filter information for the header
  const filterInfo: FilterInfo[] = useMemo(() => {
    const filters: FilterInfo[] = [];

    if (publishedFilter !== undefined) {
      filters.push({
        key: 'isPublished',
        label: 'Status',
        value: publishedFilter ? 'Published' : 'Draft',
      });
    }

    if (typeFilter) {
      filters.push({
        key: 'type',
        label: 'Type',
        value: typeFilter.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()),
      });
    }

    return filters;
  }, [publishedFilter, typeFilter]);

  const broadcastTypeOptions = Object.values(BroadcastType).map(type => ({
    value: type,
    label: type.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()),
  }));

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
                  value={publishedFilter === undefined ? 'all' : publishedFilter ? 'published' : 'draft'}
                  onValueChange={val =>
                    setFilter('isPublished', val === 'all' ? undefined : val === 'published' ? true : false)
                  }
                  options={[
                    { value: 'all', label: 'All' },
                    { value: 'published', label: 'Published' },
                    { value: 'draft', label: 'Draft' },
                  ]}
                  allOptionLabel="All Status"
                  className="w-32"
                />

                <SelectFilter
                  value={typeFilter}
                  onValueChange={val => setFilter('type', val)}
                  options={[{ value: 'all' as const, label: 'All Types' }, ...broadcastTypeOptions]}
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

