'use client';

import { useFormContext } from 'react-hook-form';
import { TextInput } from '@/components/shared/input/TextInput';
import { IconSelectInput } from '@/components/shared/input/IconSelectInput';
import { TextAreaInput } from '@/components/shared/input/TextAreaInput';

export function BasicInformationSection() {
  const { control } = useFormContext();

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TextInput control={control} name="name" label="Service Name" placeholder="Enter service name" />
        <TextInput control={control} name="slug" label="Slug" placeholder="service-slug" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <IconSelectInput name="icon" label="Icon" placeholder="Select an icon" />
        <TextInput control={control} name="order" label="Order" placeholder="0" type="number" />
      </div>

      <TextAreaInput
        control={control}
        name="description"
        label="Description"
        placeholder="Enter service description"
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
