'use client';

import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from '@/components/ui/form';
import { TextInput } from '@/components/shared/input/TextInput';
import { TextAreaInput } from '@/components/shared/input/TextAreaInput';
import { NumericInput } from '@/components/shared/input/NumericInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BroadcastType } from '@/types/broadcasts/broadcast.enums';

function formatBroadcastType(type: BroadcastType): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

export function BasicInformationSection() {
  const { control } = useFormContext();

  const broadcastTypeOptions = Object.values(BroadcastType).map(type => ({
    value: type,
    label: formatBroadcastType(type),
  }));

  return (
    <>
      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name="type"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a broadcast type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {broadcastTypeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
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
