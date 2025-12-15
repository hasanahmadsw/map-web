'use client';

import { useFormContext } from 'react-hook-form';
import { TextInput } from '@/components/shared/input/TextInput';
import { TextAreaInput } from '@/components/shared/input/TextAreaInput';

export function MetaInformationSection() {
  const { control } = useFormContext();

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TextInput control={control} name="meta.title" label="Meta Title" placeholder="Enter meta title" />
      </div>

      <TextAreaInput
        control={control}
        name="meta.description"
        label="Meta Description"
        placeholder="Enter meta description"
        className="min-h-[100px]"
      />
    </>
  );
}
