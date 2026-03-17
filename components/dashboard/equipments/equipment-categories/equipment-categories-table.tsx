'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { DataTable } from '@/components/shared/table/data-table';

import { TableHeader } from '@/components/shared/table/table-header';

import type { IEquipmentCategory } from '@/types/equipments/equipment-category.type';
import dynamic from 'next/dynamic';
import DialogSkeleton from '@/components/shared/skeletons/dialog-skeleton';
import { SelectFilter } from '@/components/shared/selects/select-filter';
import { useEquipmentCategoriesTable } from './use-equipment-categories-table';

const AddEquipmentCategoryDynamic = dynamic(
  () => import('@/components/dashboard/equipments/equipment-categories/form/add-equipment-category-form'),
  {
    ssr: false,
    loading: () => <DialogSkeleton />,
  },
);

const EditEquipmentCategoryDynamic = dynamic(
  () => import('@/components/dashboard/equipments/equipment-categories/form/edit-equipment-category-form'),
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

function EquipmentCategoriesTable() {
  const {
    categories,
    total,
    totalPages,
    error,
    isPending,
    refetch,

    currentPage,
    pageSize,
    searchTerm,
    hasActiveFilters,

    isActiveFilter,
    typeFilter,
    filterInfo,
    equipmentTypeOptions,
    columns,

    activeDialog,
    selectedCategory,
    deleteCategory,

    setSearch,
    setPage,
    setPageSize,
    clearAll,
    setActiveDialog,

    handleAddCategory,
    handleDeleteCategory,
    handleTypeFilterChange,
    handleIsActiveFilterChange,
  } = useEquipmentCategoriesTable()

  return (
    <>
      <Card>
        {/* ========================== Page Header ========================== */}
        <TableHeader
          title={'Equipment Categories'}
          total={total}
          currentPage={currentPage}
          totalPages={totalPages}
          isLoading={isPending}
          searchTerm={searchTerm}
          filters={filterInfo}
          onClearAllFilters={clearAll}
          onAdd={handleAddCategory}
          addButtonText={`Add Category`}
          entityName={'Category'}
          entityNamePlural={'Categories'}
        />

        {/* ========================== Table ========================== */}
        <CardContent>
          <DataTable
            tableId="equipment-categories-table"
            columns={columns}
            data={categories}
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
                  value={typeFilter || 'all'}
                  onValueChange={handleTypeFilterChange}
                  options={equipmentTypeOptions}
                  allOptionLabel="All Types"
                  className="w-32"
                />

                <SelectFilter
                  value={isActiveFilter === undefined ? 'all' : isActiveFilter ? 'true' : 'false'}
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
        <AddEquipmentCategoryDynamic isOpen={activeDialog === 'add'} onClose={() => setActiveDialog(null)} />
      )}

      {/* ========================== Edit Modal ========================== */}
      {activeDialog === 'edit' && (
        <EditEquipmentCategoryDynamic
          isOpen={activeDialog === 'edit'}
          onClose={() => setActiveDialog(null)}
          category={selectedCategory as IEquipmentCategory}
        />
      )}

      {/* ========================== Delete Modal ========================== */}
      {activeDialog === 'delete' && (
        <ConfirmationDialogDynamic
          open={activeDialog === 'delete'}
          onOpenChange={open => !open && setActiveDialog(null)}
          onConfirm={handleDeleteCategory}
          title="Confirm Delete"
          description="Are you sure you want to delete this equipment category? This action cannot be undone and will permanently remove the equipment category from the system."
          loadingText="Deleting..."
          isLoading={deleteCategory.isPending}
          variant="destructive"
        />
      )}
    </>
  );
}

export default EquipmentCategoriesTable;
