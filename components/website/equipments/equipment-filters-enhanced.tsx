'use client';

import { Button } from '@/components/ui/button';
import { useUpdatePathname } from '@/hooks/api/pathname/useUpdatePathname';

import { EquipmentType } from '@/types/equipments/equipment.enum';
import type { IEquipmentCategory } from '@/types/equipments/equipment-category.type';
import { X } from 'lucide-react';
import { useMemo } from 'react';
import { FilterSelect } from './FilterSelect';
import { useRouter } from 'next/navigation';
import { IEquipmentBrand } from '@/types/equipments/equipment-brand.type';

interface EquipmentFiltersEnhancedProps {
  categories: IEquipmentCategory[];
  brands: IEquipmentBrand[];
}

export function EquipmentFiltersEnhanced({ categories, brands }: EquipmentFiltersEnhancedProps) {
  const router = useRouter();

  const categoriesList = categories?.map(category => category.slug) || [];
  const pathnameHook = useUpdatePathname(categoriesList);

  // Get current filter values from pathname
  const currentType = pathnameHook.params.type || 'all';
  const currentCategory = pathnameHook.params.category || 'all';
  const currentBrand = pathnameHook.params.brand || 'all';

  console.log('currentType', currentType);
  console.log('currentCategory', currentCategory);
  console.log('currentBrand', currentBrand);

  // Build type options from EquipmentType enum
  const typeOptions = useMemo(() => {
    return [
      { value: 'all', label: 'All Types' },
      ...Object.values(EquipmentType).map(type => ({
        value: type,
        label: type.charAt(0).toUpperCase() + type.slice(1),
      })),
    ];
  }, []);

  // Build category options from props
  const categoryOptions = useMemo(() => {
    return [
      { value: 'all', label: 'All Categories' },
      ...categories.map(category => ({
        value: category.slug,
        label: category.name,
      })),
    ];
  }, [categories]);

  // Build brand options
  const brandOptions = useMemo(() => {
    return [
      { value: 'all', label: 'All Brands' },
      ...brands.map(brand => ({
        value: brand.slug,
        label: brand.name,
      })),
    ];
  }, [brands]);

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (currentType && currentType !== 'all') count++;
    if (currentCategory && currentCategory !== 'all') count++;
    if (currentBrand && currentBrand !== 'all') count++;
    return count;
  }, [currentType, currentCategory, currentBrand]);

  const clearAllFilters = () => {
    router.push('/equipments');
  };

  const updateFilter = (key: string, value: string) => {
    if (key === 'type') {
      pathnameHook.handleChangeType(value === 'all' ? '' : value);
    } else if (key === 'category') {
      pathnameHook.handleChangeCategory(value === 'all' ? '' : value);
    } else if (key === 'brand') {
      pathnameHook.handleChangeBrand(value === 'all' ? '' : value);
    }
  };

  return (
    <div className="py-4">
      {activeFiltersCount > 0 && (
        <div className="mb-3 flex items-center justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="mr-1.5 h-4 w-4" />
            Clear All
          </Button>
        </div>
      )}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <FilterSelect
          placeholder="Select Category"
          value={currentCategory}
          onValueChange={value => updateFilter('category', value)}
          options={categoryOptions}
          className="h-10 w-full"
        />

        <FilterSelect
          placeholder="Select Type"
          value={currentType}
          onValueChange={value => updateFilter('type', value)}
          options={typeOptions}
          className="h-10 w-full"
        />

        <FilterSelect
          placeholder="Select Brand"
          value={currentBrand}
          onValueChange={value => updateFilter('brand', value)}
          options={brandOptions}
          className="h-10 w-full"
        />
      </div>
    </div>
  );
}
