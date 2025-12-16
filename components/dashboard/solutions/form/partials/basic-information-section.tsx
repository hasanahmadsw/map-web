'use client';

import { useFormContext } from 'react-hook-form';
import { TextInput } from '@/components/shared/input/TextInput';
import { TextAreaInput } from '@/components/shared/input/TextAreaInput';
import { IconSelectInput } from '@/components/shared/input/IconSelectInput';
import { NumericInput } from '@/components/shared/input/NumericInput';

export function BasicInformationSection() {
  const { control } = useFormContext();

  return (
    <>
      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
        <TextInput control={control} name="name" label="Solution Name" placeholder="Enter solution name" />
        <TextInput control={control} name="slug" label="Slug" placeholder="solution-slug" />
      </div>

      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
        <IconSelectInput name="icon" label="Icon" placeholder="Select an icon" />
        <NumericInput control={control} name="order" label="Order" placeholder="Enter order" />
      </div>

      <TextAreaInput
        control={control}
        name="description"
        label="Description"
        placeholder="Enter solution description"
        className="min-h-[100px]"
      />

      <TextAreaInput
        control={control}
        name="shortDescription"
        label="Short Description"
        placeholder="Enter short description"
        className="min-h-[80px]"
      />
    </>
  );
}
