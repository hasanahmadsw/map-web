'use client';

import { useFormContext } from 'react-hook-form';
import { TextInput } from '@/components/shared/input/TextInput';
import { TextAreaInput } from '@/components/shared/input/TextAreaInput';
import { NumericInput } from '@/components/shared/input/NumericInput';
import { BroadcastType } from '@/types/broadcasts/broadcast.enums';
import { SelectInput } from '@/components/shared/input/SelectInput';

function formatBroadcastType(type: BroadcastType): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

const broadcastTypeOptions = Object.values(BroadcastType).map(type => ({
  value: type,
  label: formatBroadcastType(type),
}));

export function BasicInformationSection() {
  const { control } = useFormContext();

  return (
    <>
      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
        <SelectInput
          control={control}
          name="type"
          label="Type"
          placeholder="Select a broadcast type"
          options={broadcastTypeOptions}
        />
        <NumericInput control={control} name="order" label="Order" placeholder="Enter order" />
      </div>

      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
        <TextInput control={control} name="slug" label="Slug" placeholder="broadcast-unit-slug" />
      </div>

      <TextInput control={control} name="title" label="Title" placeholder="Enter broadcast unit title" />

      <TextAreaInput
        control={control}
        name="summary"
        label="Summary"
        placeholder="Enter broadcast unit summary"
        className="min-h-[80px]"
      />

      <TextAreaInput
        control={control}
        name="description"
        label="Description"
        placeholder="Enter broadcast unit description"
        className="min-h-[100px]"
      />
    </>
  );
}
