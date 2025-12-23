'use client';

import { useState, useMemo } from 'react';

import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/shared/table/data-table';

import { useRouter } from 'next/navigation';
import { useServiceMutations } from '@/hooks/api/services/mutations';
import { useServicesController } from '@/hooks/api/services/useServicesController';

import { useServiceColumns } from './columns';
import { TableHeader, type FilterInfo } from '@/components/shared/table/table-header';

import type { StaffService } from '@/types/services.types';
import DialogSkeleton from '@/components/shared/skeletons/dialog-skeleton';
import dynamic from 'next/dynamic';

const ConfirmationDialogDynamic = dynamic(
  () => import('@/components/shared/confirmation-dialog').then(mod => mod.ConfirmationDialog),
  {
    ssr: false,
    loading: () => <DialogSkeleton />,
  },
);

export function ServicesTable() {
  const router = useRouter();

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

      toast.success('Service deleted successfully');

      setServiceToDelete(null);
    } catch (error) {
      const errMsg = (error as Error).message || 'Failed to delete Service';

      toast.error(errMsg);
      console.error('Error deleting service:', error);
    }
  };

  const columns = useServiceColumns({
    onDelete: setServiceToDelete,
  });

  const handleAddService = () => {
    router.push(`/dashboard/services/add`);
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

    if (featuredFilter !== undefined) {
      filters.push({
        key: 'isFeatured',
        label: 'Featured',
        value: featuredFilter ? 'Yes' : 'No',
      });
    }

    return filters;
  }, [publishedFilter, featuredFilter]);

  return (
    <>
      <Card>
        {/* ========================== Page Header ========================== */}
        <TableHeader
          title="Services Management"
          total={total}
          currentPage={currentPage}
          totalPages={totalPages}
          isLoading={isPending}
          searchTerm={searchTerm}
          filters={filterInfo}
          onClearAllFilters={clearAll}
          onAdd={handleAddService}
          addButtonText="Add Service"
          entityName="Service"
          entityNamePlural="Services"
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
          />
        </CardContent>
      </Card>

      {/* ========================== Delete Modal ========================== */}
      {serviceToDelete && (
        <ConfirmationDialogDynamic
          open={!!serviceToDelete}
          onOpenChange={open => !open && setServiceToDelete(null)}
          onConfirm={handleDeleteService}
          title="Confirm Delete"
          description="Are you sure you want to delete this Service? This action cannot be undone and will permanently remove the Service from the system."
          loadingText="Deleting..."
          isLoading={deleteService.isPending}
          variant="destructive"
        />
      )}
    </>
  );
}
