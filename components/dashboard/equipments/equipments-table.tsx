'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/table/data-table';

import { TableHeader } from '@/components/shared/table/table-header';
import DialogSkeleton from '@/components/shared/skeletons/dialog-skeleton';
import dynamic from 'next/dynamic';
import { BrandSelector } from '@/components/shared/selectors/brand-selector';
import { CategorySelector } from '@/components/shared/selectors/category-selector';
import { SelectFilter } from '@/components/shared/selects/select-filter';
import { EquipmentType } from '@/types/equipments/equipment.enum';
import { useEquipmentsTable } from './use-equipments-table';

const ConfirmationDialogDynamic = dynamic(
  () => import('@/components/shared/confirmation-dialog').then(mod => mod.ConfirmationDialog),
  {
    ssr: false,
    loading: () => <DialogSkeleton />,
  },
);

export function EquipmentsTable() {
  const {
    equipmentsList,
    total,
    totalPages,
    error,
    isPending,
    refetch,

    currentPage,
    pageSize,
    searchTerm,
    hasActiveFilters,

    equipmentTypeFilter,
    categoryIdFilter,
    brandIdFilter,
    displayCategoryLabel,
    displayBrandLabel,
    filterInfo,

    publishedSelectValue,
    featuredSelectValue,
    equipmentTypeSelectValue,

    columns,
    equipmentToDelete,
    deleteEquipment,
    setEquipmentToDelete,

    setSearch,
    setPage,
    setPageSize,
    handleClearAll,

    handleAddEquipment,
    handleDeleteEquipment,
    handlePublishedFilterChange,
    handleFeaturedFilterChange,
    handleEquipmentTypeFilterChange,
    handleCategoryChange,
    handleBrandChange,
  } = useEquipmentsTable()

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
          onClearAllFilters={handleClearAll}
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
                  value={featuredSelectValue}
                  onValueChange={handleFeaturedFilterChange}
                  options={[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' },
                  ]}
                  allOptionLabel="All Featured"
                  className="w-32"
                />
                <SelectFilter
                  value={equipmentTypeSelectValue}
                  onValueChange={handleEquipmentTypeFilterChange}
                  options={[
                    { value: EquipmentType.CAMERA, label: 'Camera' },
                    { value: EquipmentType.LENS, label: 'Lens' },
                    { value: EquipmentType.LIGHT, label: 'Light' },
                    { value: EquipmentType.AUDIO, label: 'Audio' },
                    { value: EquipmentType.ACCESSORY, label: 'Accessory' },
                  ]}
                  allOptionLabel="All Types"
                  className="w-36"
                />
                <CategorySelector
                  value={categoryIdFilter}
                  valueLabel={displayCategoryLabel}
                  onValueChange={option => handleCategoryChange(option)}
                  placeholder="Filter by category"
                  className="w-40"
                />
                <BrandSelector
                  value={brandIdFilter}
                  valueLabel={displayBrandLabel}
                  onValueChange={option => handleBrandChange(option)}
                  placeholder="Filter by brand"
                  className="w-40"
                />
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAll}
                    className="gap-1"
                  >
                    Clear All
                  </Button>
                )}
              </div>
            }
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
