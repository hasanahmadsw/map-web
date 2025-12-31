'use client';

import { useState, useMemo } from 'react';

import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { DataTable } from '@/components/shared/table/data-table';

import { useRouter } from 'next/navigation';
import { useFacilityMutations } from '@/hooks/api/facilities/mutations';
import { useFacilitiesController } from '@/hooks/api/facilities/useFacilitiesController';

import { useFacilityColumns } from './columns';
import { TableHeader, type FilterInfo } from '@/components/shared/table/table-header';

import type { Facility } from '@/types/facilities/facilities.types';
import dynamic from 'next/dynamic';
import DialogSkeleton from '../../shared/skeletons/dialog-skeleton';
import { SelectFilter } from '@/components/shared/selects/select-filter';
import { FacilityType } from '@/types/facilities/facility.enums';

const ConfirmationDialogDynamic = dynamic(
  () => import('@/components/shared/confirmation-dialog').then(mod => mod.ConfirmationDialog),
  {
    ssr: false,
    loading: () => <DialogSkeleton />,
  },
);

export function FacilitiesTable() {
  const router = useRouter();

  const [facilityToDelete, setFacilityToDelete] = useState<Facility | null>(null);

  const {
    items: facilitiesList,
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
  } = useFacilitiesController();

  const publishedFilter = urlState.isPublished ?? undefined;
  const typeFilter = urlState.type ?? undefined;

  const { del: deleteFacility } = useFacilityMutations();

  const handleDeleteFacility = async () => {
    if (!facilityToDelete) return;

    try {
      await deleteFacility.mutateAsync(facilityToDelete.id);

      toast.success('Facility deleted successfully');

      setFacilityToDelete(null);
    } catch (error) {
      const errMsg = (error as Error).message || 'Failed to delete Facility';

      toast.error(errMsg);
      console.error('Error deleting facility:', error);
    }
  };

  const columns = useFacilityColumns({
    onDelete: setFacilityToDelete,
  });

  const handleAddFacility = () => {
    router.push(`/dashboard/facilities/add`);
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

  const facilityTypeOptions = Object.values(FacilityType).map(type => ({
    value: type,
    label: type.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()),
  }));

  return (
    <>
      <Card>
        {/* ========================== Page Header ========================== */}
        <TableHeader
          title="Facilities Management"
          total={total}
          currentPage={currentPage}
          totalPages={totalPages}
          isLoading={isPending}
          searchTerm={searchTerm}
          filters={filterInfo}
          onClearAllFilters={clearAll}
          onAdd={handleAddFacility}
          addButtonText={`Add Facility`}
          entityName="Facility"
          entityNamePlural="Facilities"
        />

        {/* ========================== Table ========================== */}
        <CardContent>
          <DataTable
            tableId="facilities-table"
            columns={columns}
            data={facilitiesList}
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
                  options={[{ value: 'all' as const, label: 'All Types' }, ...facilityTypeOptions]}
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
      {facilityToDelete && (
        <ConfirmationDialogDynamic
          open={!!facilityToDelete}
          onOpenChange={open => !open && setFacilityToDelete(null)}
          onConfirm={handleDeleteFacility}
          title="Confirm Delete"
          description="Are you sure you want to delete this Facility? This action cannot be undone and will permanently remove the Facility from the system."
          loadingText="Deleting..."
          isLoading={deleteFacility.isPending}
          variant="destructive"
        />
      )}
    </>
  );
}
