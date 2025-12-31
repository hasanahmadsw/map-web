'use client';

import { useFormContext } from 'react-hook-form';
import { CheckboxInput } from '@/components/shared/input/CheckboxInput';

export function StatusOptionsSection() {
  const { control } = useFormContext();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <CheckboxInput
        control={control}
        name="isPublished"
        label="Published"
        description="Make this facility unit visible to the public"
        className="items-center rounded-lg border p-4"
      />
    </div>
  );
}

