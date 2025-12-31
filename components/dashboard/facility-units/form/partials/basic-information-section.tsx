'use client';

import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from '@/components/ui/form';
import { TextInput } from '@/components/shared/input/TextInput';
import { TextAreaInput } from '@/components/shared/input/TextAreaInput';
import { NumericInput } from '@/components/shared/input/NumericInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFacilitiesPublic } from '@/hooks/api/facilities/useFacilitiesController';

export function BasicInformationSection() {
  const { control } = useFormContext();
  const { facilities, isPending: facilitiesLoading } = useFacilitiesPublic({ limit: 100 });

  const facilityOptions = facilities.map(facility => ({
    value: facility.id.toString(),
    label: facility.title || facility.slug,
  }));

  return (
    <>
      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name="facilityId"
          render={({ field }) => {
            const stringValue = field.value ? String(field.value) : undefined;
            const isValidValue = stringValue && facilityOptions.some(opt => opt.value === stringValue);

            return (
              <FormItem>
                <FormLabel>Facility</FormLabel>
                <Select
                  key={`facility-${facilities.length}-${stringValue}`}
                  onValueChange={val => field.onChange(Number(val))}
                  value={isValidValue ? stringValue : undefined}
                  disabled={facilitiesLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a facility" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {facilityOptions.map(option => (
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
        <TextInput control={control} name="slug" label="Slug" placeholder="facility-unit-slug" />
      </div>

      <TextInput control={control} name="title" label="Title" placeholder="Enter facility unit title" />

      <TextAreaInput
        control={control}
        name="summary"
        label="Summary"
        placeholder="Enter facility unit summary"
        className="min-h-[80px]"
      />

      <TextAreaInput
        control={control}
        name="description"
        label="Description"
        placeholder="Enter facility unit description"
        className="min-h-[100px]"
      />
    </>
  );
}
