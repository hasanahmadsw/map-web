'use client';

import { useFormContext } from 'react-hook-form';
import { SearchableMultiSelectInput } from '@/components/shared/input/SearchableMultiSelectInput';
import { useSolutionsStaff } from '@/hooks/api/solutions/useSolutionsStaff';

export function SolutionsSection() {
  const { control } = useFormContext();
  const { solutions, isLoading: solutionsLoading } = useSolutionsStaff({ limit: 100 });

  return (
    <SearchableMultiSelectInput
      control={control}
      name="solutionIds"
      label="Solutions"
      description="Select solutions related to this service."
      placeholder="Select solutions"
      searchPlaceholder="Search solutions..."
      emptyMessage="No solutions found"
      options={solutions.map(solution => ({
        id: solution.id,
        name: solution.name,
      }))}
    />
  );
}
