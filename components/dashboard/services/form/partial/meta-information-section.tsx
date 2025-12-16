'use client';

import { useFormContext } from 'react-hook-form';
import { TextInput } from '@/components/shared/input/TextInput';
import { TextAreaInput } from '@/components/shared/input/TextAreaInput';
import ArrayInput from '@/components/shared/input/ArrayInput';

export function MetaInformationSection() {
  const { control } = useFormContext();

  return (
    <>
      <TextInput control={control} name="meta.title" label="Meta Title" placeholder="Enter meta title" />

      <TextAreaInput
        control={control}
        name="meta.description"
        label="Meta Description"
        placeholder="Enter meta description"
        className="min-h-[80px]"
      />
      <ArrayInput name="meta.keywords" label="Keywords" placeholder="Enter keyword" />
    </>
  );
}
