'use client';

import { useState, useMemo } from 'react';

import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { DataTable } from '@/components/shared/table/data-table';

import { useRouter } from 'next/navigation';
import { useFacilityUnitMutations } from '@/hooks/api/facilities/unit-mutations';
import { useFacilityUnitsController } from '@/hooks/api/facilities/useFacilityUnitsController';

import { useFacilityUnitColumns } from './columns';
import { TableHeader, type FilterInfo } from '@/components/shared/table/table-header';

import type { FacilityUnit } from '@/types/facilities/facilities.types';
import dynamic from 'next/dynamic';
import DialogSkeleton from '../../shared/skeletons/dialog-skeleton';
import { SelectFilter } from '@/components/shared/selects/select-filter';

const ConfirmationDialogDynamic = dynamic(
  () => import('@/components/shared/confirmation-dialog').then(mod => mod.ConfirmationDialog),
  {
    ssr: false,
    loading: () => <DialogSkeleton />,
  },
);

export function FacilityUnitsTable() {
  const router = useRouter();

  const [facilityUnitToDelete, setFacilityUnitToDelete] = useState<FacilityUnit | null>(null);

  const {
    items: facilityUnitsList,
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
  } = useFacilityUnitsController();

  const publishedFilter = urlState.isPublished ?? undefined;

  const { del: deleteFacilityUnit } = useFacilityUnitMutations();

  const handleDeleteFacilityUnit = async () => {
    if (!facilityUnitToDelete) return;

    try {
      await deleteFacilityUnit.mutateAsync(facilityUnitToDelete.id);

      toast.success('Facility unit deleted successfully');

      setFacilityUnitToDelete(null);
    } catch (error) {
      const errMsg = (error as Error).message || 'Failed to delete Facility Unit';

      toast.error(errMsg);
      console.error('Error deleting facility unit:', error);
    }
  };

  const columns = useFacilityUnitColumns({
    onDelete: setFacilityUnitToDelete,
  });

  const handleAddFacilityUnit = () => {
    router.push(`/dashboard/facility-units/add`);
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

    return filters;
  }, [publishedFilter]);

  return (
    <>
      <Card>
        {/* ========================== Page Header ========================== */}
        <TableHeader
          title="Facility Units Management"
          total={total}
          currentPage={currentPage}
          totalPages={totalPages}
          isLoading={isPending}
          searchTerm={searchTerm}
          filters={filterInfo}
          onClearAllFilters={clearAll}
          onAdd={handleAddFacilityUnit}
          addButtonText={`Add Facility Unit`}
          entityName="Facility Unit"
          entityNamePlural="Facility Units"
        />

        {/* ========================== Table ========================== */}
        <CardContent>
          <DataTable
            tableId="facility-units-table"
            columns={columns}
            data={facilityUnitsList}
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
      {facilityUnitToDelete && (
        <ConfirmationDialogDynamic
          open={!!facilityUnitToDelete}
          onOpenChange={open => !open && setFacilityUnitToDelete(null)}
          onConfirm={handleDeleteFacilityUnit}
          title="Confirm Delete"
          description="Are you sure you want to delete this Facility Unit? This action cannot be undone and will permanently remove the Facility Unit from the system."
          loadingText="Deleting..."
          isLoading={deleteFacilityUnit.isPending}
          variant="destructive"
        />
      )}
    </>
  );
}

