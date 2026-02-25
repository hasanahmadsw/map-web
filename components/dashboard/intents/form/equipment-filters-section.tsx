'use client';

import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { SelectInput } from '@/components/shared/input/SelectInput';
import { CheckboxInput } from '@/components/shared/input/CheckboxInput';
import { CategorySelector } from '@/components/dashboard/common/selectors/category-selector';
import { BrandSelector } from '@/components/dashboard/common/selectors/brand-selector';
import { useEquipmentCategoryById } from '@/hooks/api/equipments/equipment-categories/use-equipment-categories';
import { useEquipmentBrandById } from '@/hooks/api/equipments/equipment-brands/use-equipment-brands';
import { EquipmentType } from '@/types/equipments/equipment.enum';

const EQUIPMENT_TYPE_OPTIONS = [
  { value: '__none__', label: 'None' },
  ...Object.values(EquipmentType).map(type => ({
    value: type,
    label: type.charAt(0).toUpperCase() + type.slice(1),
  })),
];

function EquipmentFiltersSection() {
  const { control, watch, setValue } = useFormContext();

  const filterCategoryId = watch('filterCategoryId');
  const filterBrandId = watch('filterBrandId');
  const filterCategoryLabel = watch('filterCategoryLabel');
  const filterBrandLabel = watch('filterBrandLabel');

  const categoryIdNum =
    filterCategoryId && filterCategoryId !== '__none__' ? Number(filterCategoryId) : undefined;
  const brandIdNum = filterBrandId && filterBrandId !== '__none__' ? Number(filterBrandId) : undefined;

  const { category: categoryItem } = useEquipmentCategoryById(
    categoryIdNum ?? 0,
    !!categoryIdNum && !filterCategoryLabel,
  );
  const { brand: brandItem } = useEquipmentBrandById(
    brandIdNum ?? 0,
    !!brandIdNum && !filterBrandLabel,
  );

  const displayCategoryLabel = useMemo(() => {
    if (filterCategoryLabel) return filterCategoryLabel;
    if (categoryItem && categoryIdNum) return categoryItem.name;
    return undefined;
  }, [filterCategoryLabel, categoryItem, categoryIdNum]);

  const displayBrandLabel = useMemo(() => {
    if (filterBrandLabel) return filterBrandLabel;
    if (brandItem && brandIdNum) return brandItem.name;
    return undefined;
  }, [filterBrandLabel, brandItem, brandIdNum]);

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h3 className="text-sm font-medium">Equipment Filters</h3>
      <p className="text-muted-foreground text-xs">
        Apply default filters to equipment shown on this intent page. Leave empty for no filter.
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Category</label>
          <CategorySelector
            value={categoryIdNum != null ? categoryIdNum : undefined}
            valueLabel={displayCategoryLabel}
            onValueChange={option => {
              if (option) {
                setValue('filterCategoryId', String(option.value));
                setValue('filterCategoryLabel', option.label);
              } else {
                setValue('filterCategoryId', '__none__');
                setValue('filterCategoryLabel', '');
              }
            }}
            placeholder="Select category"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Brand</label>
          <BrandSelector
            value={brandIdNum}
            valueLabel={displayBrandLabel}
            onValueChange={option => {
              if (option) {
                setValue('filterBrandId', String(option.value));
                setValue('filterBrandLabel', option.label);
              } else {
                setValue('filterBrandId', '__none__');
                setValue('filterBrandLabel', '');
              }
            }}
            placeholder="Select brand"
          />
        </div>
        <SelectInput
          control={control}
          name="filterEquipmentType"
          label="Equipment Type"
          placeholder="Select type"
          options={EQUIPMENT_TYPE_OPTIONS}
        />
        <CheckboxInput control={control} name="filterIsFeatured" label="Featured only" />
      </div>
    </div>
  );
}

export default EquipmentFiltersSection;
