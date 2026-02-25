'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import EquipmentsAutocomplete from '@/components/website/common/equipments-autocomplete';
import { FilterSelect } from '@/components/shared/FilterSelect';
import { EquipmentType } from '@/types/equipments/equipment.enum';
import type { IEquipmentCategory } from '@/types/equipments/equipment-category.type';
import type { IEquipmentBrand } from '@/types/equipments/equipment-brand.type';
import { X } from 'lucide-react';
import { useMemo } from 'react';

interface IntentEquipmentFiltersProps {
  categories: IEquipmentCategory[];
  brands: IEquipmentBrand[];
}

export function IntentEquipmentFilters({ categories, brands }: IntentEquipmentFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentType = searchParams.get('equipmentType') || 'all';
  const currentCategory = searchParams.get('category') || 'all';
  const currentBrand = searchParams.get('brand') || 'all';
  const currentSearch = searchParams.get('search') || '';

  const typeOptions = useMemo(
    () => [
      { value: 'all', label: 'All Types' },
      ...Object.values(EquipmentType).map(type => ({
        value: type,
        label: type.charAt(0).toUpperCase() + type.slice(1),
      })),
    ],
    [],
  );

  const categoryOptions = useMemo(
    () => [
      { value: 'all', label: 'All Categories' },
      ...categories.map(c => ({ value: c.slug, label: c.name })),
    ],
    [categories],
  );

  const brandOptions = useMemo(
    () => [
      { value: 'all', label: 'All Brands' },
      ...brands.map(b => ({ value: b.slug, label: b.name })),
    ],
    [brands],
  );

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (currentType && currentType !== 'all') count++;
    if (currentCategory && currentCategory !== 'all') count++;
    if (currentBrand && currentBrand !== 'all') count++;
    if (currentSearch.trim()) count++;
    return count;
  }, [currentType, currentCategory, currentBrand, currentSearch]);

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === 'all') params.delete(key);
      else params.set(key, value);
    });
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    router.push(pathname, { scroll: false });
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
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <EquipmentsAutocomplete
            placeholder="Search equipment..."
            value={currentSearch}
            onValueChange={value => updateParams({ search: value })}
            className="h-10 w-full rounded-xl"
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <FilterSelect
              placeholder="Select Category"
              value={currentCategory}
              onValueChange={value => updateParams({ category: value === 'all' ? '' : value })}
              options={categoryOptions}
              className="h-10 w-full"
            />
            <FilterSelect
              placeholder="Select Type"
              value={currentType}
              onValueChange={value => updateParams({ equipmentType: value === 'all' ? '' : value })}
              options={typeOptions}
              className="h-10 w-full"
            />
            <FilterSelect
              placeholder="Select Brand"
              value={currentBrand}
              onValueChange={value => updateParams({ brand: value === 'all' ? '' : value })}
              options={brandOptions}
              className="h-10 w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
