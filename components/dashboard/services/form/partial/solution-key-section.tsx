'use client';

import { useFormContext } from 'react-hook-form';
import { SelectInput } from '@/components/shared/input/SelectInput';
import { SolutionKey } from '@/types/solution-key.enum';

const solutionKeyOptions = [
  { value: SolutionKey.PRODUCTION, label: 'Production' },
  { value: SolutionKey.EVENTS, label: 'Events' },
  { value: SolutionKey.PHOTOGRAPHY, label: 'Photography' },
];

export function SolutionKeySection() {
  const { control } = useFormContext();

  return (
    <SelectInput
      control={control}
      name="solutionKey"
      label="Solution Key"
      placeholder="Select solution key"
      options={solutionKeyOptions}
    />
  );
}
