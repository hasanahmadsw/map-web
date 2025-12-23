'use client';

import { useState, useMemo } from 'react';

import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/shared/table/data-table';

import { useRouter } from 'next/navigation';
import { useEquipmentMutations } from '@/hooks/api/equipments/mutations';
import { useEquipmentsController } from '@/hooks/api/equipments/use-equipments-controller';

import { useEquipmentColumns } from './columns';
import { TableHeader, type FilterInfo } from '@/components/shared/table/table-header';

import type { IEquipment } from '@/types/equipments/equipment.type';
import DialogSkeleton from '@/components/shared/skeletons/dialog-skeleton';
import dynamic from 'next/dynamic';

const ConfirmationDialogDynamic = dynamic(
  () => import('@/components/shared/confirmation-dialog').then(mod => mod.ConfirmationDialog),
  {
    ssr: false,
    loading: () => <DialogSkeleton />,
  },
);

export function EquipmentsTable() {
  const router = useRouter();

  const [equipmentToDelete, setEquipmentToDelete] = useState<IEquipment | null>(null);

  const {
    items: equipmentsList,
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
  } = useEquipmentsController();

  const publishedFilter = urlState.isPublished ?? undefined;
  const featuredFilter = urlState.isFeatured ?? undefined;
  const equipmentTypeFilter = urlState.equipmentType ?? undefined;
  const categoryIdFilter = urlState.categoryId ?? undefined;
  const brandIdFilter = urlState.brandId ?? undefined;

  const { del: deleteEquipment } = useEquipmentMutations();

  const handleDeleteEquipment = async () => {
    if (!equipmentToDelete) return;

    try {
      await deleteEquipment.mutateAsync(equipmentToDelete.id);

      toast.success('Equipment deleted successfully');

      setEquipmentToDelete(null);
    } catch (error) {
      const errMsg = (error as Error).message || 'Failed to delete Equipment';

      toast.error(errMsg);
      console.error('Error deleting equipment:', error);
    }
  };

  const columns = useEquipmentColumns({
    onDelete: setEquipmentToDelete,
  });

  const handleAddEquipment = () => {
    router.push(`/dashboard/equipments/add`);
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

    if (equipmentTypeFilter) {
      filters.push({
        key: 'equipmentType',
        label: 'Type',
        value: equipmentTypeFilter,
      });
    }

    if (categoryIdFilter) {
      filters.push({
        key: 'categoryId',
        label: 'Category',
        value: `ID: ${categoryIdFilter}`,
      });
    }

    if (brandIdFilter) {
      filters.push({
        key: 'brandId',
        label: 'Brand',
        value: `ID: ${brandIdFilter}`,
      });
    }

    return filters;
  }, [publishedFilter, featuredFilter, equipmentTypeFilter, categoryIdFilter, brandIdFilter]);

  return (
    <>
      <Card>
        {/* ========================== Page Header ========================== */}
        <TableHeader
          title="Equipments Management"
          total={total}
          currentPage={currentPage}
          totalPages={totalPages}
          isLoading={isPending}
          searchTerm={searchTerm}
          filters={filterInfo}
          onClearAllFilters={clearAll}
          onAdd={handleAddEquipment}
          addButtonText="Add Equipment"
          entityName="Equipment"
          entityNamePlural="Equipments"
        />

        {/* ========================== Table ========================== */}
        <CardContent>
          <DataTable
            tableId="equipments-table"
            columns={columns}
            data={equipmentsList}
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
      {equipmentToDelete && (
        <ConfirmationDialogDynamic
          open={!!equipmentToDelete}
          onOpenChange={open => !open && setEquipmentToDelete(null)}
          onConfirm={handleDeleteEquipment}
          title="Confirm Delete"
          description="Are you sure you want to delete this Equipment? This action cannot be undone and will permanently remove the Equipment from the system."
          loadingText="Deleting..."
          isLoading={deleteEquipment.isPending}
          variant="destructive"
        />
      )}
    </>
  );
}
