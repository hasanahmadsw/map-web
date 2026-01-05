'use client';

import { useState, useMemo } from 'react';

import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/table/data-table';

import { useRouter } from 'next/navigation';
import { useEquipmentMutations } from '@/hooks/api/equipments/mutations';
import { useEquipmentsController } from '@/hooks/api/equipments/use-equipments-controller';

import { useEquipmentColumns } from './columns';
import { TableHeader, type FilterInfo } from '@/components/shared/table/table-header';

import type { IEquipment } from '@/types/equipments/equipment.type';
import DialogSkeleton from '@/components/shared/skeletons/dialog-skeleton';
import dynamic from 'next/dynamic';
import { BrandSelector } from '@/components/dashboard/common/selectors/brand-selector';
import { CategorySelector } from '@/components/dashboard/common/selectors/category-selector';
import { useEquipmentCategoryById } from '@/hooks/api/equipments/equipment-categories/use-equipment-categories';
import { useEquipmentBrandById } from '@/hooks/api/equipments/equipment-brands/use-equipment-brands';
import { SelectFilter } from '@/components/shared/selects/select-filter';
import { EquipmentType } from '@/types/equipments/equipment.enum';

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
  const [selectedCategoryLabel, setSelectedCategoryLabel] = useState<string | undefined>();
  const [selectedBrandLabel, setSelectedBrandLabel] = useState<string | undefined>();

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
  const categoryIdFilter = urlState.categoryId ? Number(urlState.categoryId) : undefined;
  const brandIdFilter = urlState.brandId ? Number(urlState.brandId) : undefined;

  // Fetch labels for filters from URL state
  const { category: categoryItem } = useEquipmentCategoryById(
    categoryIdFilter && !selectedCategoryLabel ? categoryIdFilter : 0,
    !!(categoryIdFilter && !selectedCategoryLabel),
  );
  const { brand: brandItem } = useEquipmentBrandById(
    brandIdFilter && !selectedBrandLabel ? brandIdFilter : 0,
    !!(brandIdFilter && !selectedBrandLabel),
  );

  // Compute labels from fetched data or use selected labels
  const displayCategoryLabel = useMemo(() => {
    if (selectedCategoryLabel) return selectedCategoryLabel;
    if (categoryItem && categoryIdFilter) return categoryItem.name;
    return undefined;
  }, [selectedCategoryLabel, categoryItem, categoryIdFilter]);

  const displayBrandLabel = useMemo(() => {
    if (selectedBrandLabel) return selectedBrandLabel;
    if (brandItem && brandIdFilter) return brandItem.name;
    return undefined;
  }, [selectedBrandLabel, brandItem, brandIdFilter]);

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

  // Format equipment type label
  const getEquipmentTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      [EquipmentType.CAMERA]: 'Camera',
      [EquipmentType.LENS]: 'Lens',
      [EquipmentType.LIGHT]: 'Light',
      [EquipmentType.AUDIO]: 'Audio',
      [EquipmentType.ACCESSORY]: 'Accessory',
    };
    return typeMap[type] || type;
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
        value: getEquipmentTypeLabel(equipmentTypeFilter as string),
      });
    }

    if (categoryIdFilter && displayCategoryLabel) {
      filters.push({
        key: 'categoryId',
        label: 'Category',
        value: displayCategoryLabel,
      });
    }

    if (brandIdFilter && displayBrandLabel) {
      filters.push({
        key: 'brandId',
        label: 'Brand',
        value: displayBrandLabel,
      });
    }

    return filters;
  }, [
    publishedFilter,
    featuredFilter,
    equipmentTypeFilter,
    categoryIdFilter,
    brandIdFilter,
    displayCategoryLabel,
    displayBrandLabel,
  ]);

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
          onClearAllFilters={() => {
            clearAll();
            setSelectedCategoryLabel(undefined);
            setSelectedBrandLabel(undefined);
          }}
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
                  value={
                    publishedFilter === undefined
                      ? 'all'
                      : (publishedFilter as unknown as string) === 'true'
                        ? 'true'
                        : 'false'
                  }
                  onValueChange={val =>
                    setFilter('isPublished', val === undefined ? undefined : val === 'true' ? true : false)
                  }
                  options={[
                    { value: 'true', label: 'Published' },
                    { value: 'false', label: 'Draft' },
                  ]}
                  allOptionLabel="All Status"
                  className="w-32"
                />
                <SelectFilter
                  value={featuredFilter === undefined ? 'all' : featuredFilter ? 'yes' : 'no'}
                  onValueChange={val =>
                    setFilter('isFeatured', val === undefined ? undefined : val === 'yes' ? true : false)
                  }
                  options={[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' },
                  ]}
                  allOptionLabel="All Featured"
                  className="w-32"
                />
                <SelectFilter
                  value={equipmentTypeFilter === undefined ? 'all' : (equipmentTypeFilter as string)}
                  onValueChange={val => {
                    if (val === 'all') {
                      setFilter('equipmentType', undefined);
                    } else {
                      setFilter('equipmentType', val as EquipmentType);
                    }
                  }}
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
                  onValueChange={option => {
                    if (option) {
                      setSelectedCategoryLabel(option.label);
                      setFilter('categoryId', Number(option.value));
                    } else {
                      setSelectedCategoryLabel(undefined);
                      setFilter('categoryId', undefined);
                    }
                  }}
                  placeholder="Filter by category"
                  className="w-40"
                />
                <BrandSelector
                  value={brandIdFilter}
                  valueLabel={displayBrandLabel}
                  onValueChange={option => {
                    if (option) {
                      setSelectedBrandLabel(option.label);
                      setFilter('brandId', Number(option.value));
                    } else {
                      setSelectedBrandLabel(undefined);
                      setFilter('brandId', undefined);
                    }
                  }}
                  placeholder="Filter by brand"
                  className="w-40"
                />
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      clearAll();
                      setSelectedCategoryLabel(undefined);
                      setSelectedBrandLabel(undefined);
                    }}
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
