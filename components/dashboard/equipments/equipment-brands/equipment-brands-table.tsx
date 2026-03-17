'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { DataTable } from '@/components/shared/table/data-table';

import { TableHeader } from '@/components/shared/table/table-header';

import type { IEquipmentBrand } from '@/types/equipments/equipment-brand.type';
import dynamic from 'next/dynamic';
import DialogSkeleton from '@/components/shared/skeletons/dialog-skeleton';
import { SelectFilter } from '@/components/shared/selects/select-filter';
import { useEquipmentBrandsTable } from './use-equipment-brands-table';

const AddEquipmentBrandDynamic = dynamic(
  () => import('@/components/dashboard/equipments/equipment-brands/form/add-equipment-brand-form'),
  {
    ssr: false,
    loading: () => <DialogSkeleton />,
  },
);

const EditEquipmentBrandDynamic = dynamic(
  () => import('@/components/dashboard/equipments/equipment-brands/form/edit-equipment-brand-form'),
  {
    ssr: false,
    loading: () => <DialogSkeleton />,
  },
);

const ConfirmationDialogDynamic = dynamic(
  () => import('@/components/shared/confirmation-dialog').then(mod => mod.ConfirmationDialog),
  {
    ssr: false,
    loading: () => <DialogSkeleton />,
  },
);

function EquipmentBrandsTable() {
  const {
    brands,
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
    columns,

    activeDialog,
    selectedBrand,
    deleteBrand,

    isActiveSelectValue,

    setSearch,
    setPage,
    setPageSize,
    clearAll,
    setActiveDialog,

    handleAddBrand,
    handleDeleteBrand,
    handleIsActiveFilterChange,
  } = useEquipmentBrandsTable()

  return (
    <>
      <Card>
        {/* ========================== Page Header ========================== */}
        <TableHeader
          title={'Equipment Brands'}
          total={total}
          currentPage={currentPage}
          totalPages={totalPages}
          isLoading={isPending}
          searchTerm={searchTerm}
          filters={filterInfo}
          onClearAllFilters={clearAll}
          onAdd={handleAddBrand}
          addButtonText={`Add Brand`}
          entityName={'Brand'}
          entityNamePlural={'Brands'}
        />

        {/* ========================== Table ========================== */}
        <CardContent>
          <DataTable
            tableId="equipment-brands-table"
            columns={columns}
            data={brands}
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
                  value={isActiveSelectValue}
                  onValueChange={handleIsActiveFilterChange}
                  options={[
                    { value: 'true', label: 'Active' },
                    { value: 'false', label: 'Inactive' },
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

      {/* ========================== Add Modal ========================== */}
      {activeDialog === 'add' && (
        <AddEquipmentBrandDynamic isOpen={activeDialog === 'add'} onClose={() => setActiveDialog(null)} />
      )}

      {/* ========================== Edit Modal ========================== */}
      {activeDialog === 'edit' && (
        <EditEquipmentBrandDynamic
          isOpen={activeDialog === 'edit'}
          onClose={() => setActiveDialog(null)}
          brand={selectedBrand as IEquipmentBrand}
        />
      )}

      {/* ========================== Delete Modal ========================== */}
      {activeDialog === 'delete' && (
        <ConfirmationDialogDynamic
          open={activeDialog === 'delete'}
          onOpenChange={open => !open && setActiveDialog(null)}
          onConfirm={handleDeleteBrand}
          title="Confirm Delete"
          description="Are you sure you want to delete this equipment brand? This action cannot be undone and will permanently remove the equipment brand from the system."
          loadingText="Deleting..."
          isLoading={deleteBrand.isPending}
          variant="destructive"
        />
      )}
    </>
  );
}

export default EquipmentBrandsTable;
