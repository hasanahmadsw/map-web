'use client';

import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from '@/components/ui/form';
import { TextInput } from '@/components/shared/input/TextInput';
import { TextAreaInput } from '@/components/shared/input/TextAreaInput';
import { NumericInput } from '@/components/shared/input/NumericInput';
import { SelectInput } from '@/components/shared/input/SelectInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FacilityType } from '@/types/facilities/facility.enums';
import { useSolutionsStaff } from '@/hooks/api/solutions/useSolutionsStaff';

export function BasicInformationSection() {
  const { control } = useFormContext();
  const { solutions, isLoading: solutionsLoading } = useSolutionsStaff({ limit: 100 });

  const facilityTypeOptions = Object.values(FacilityType).map(type => ({
    value: type,
    label: type.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()),
  }));

  const solutionOptions = solutions.map(solution => ({
    value: solution.id.toString(),
    label: solution.name || solution.slug,
  }));

  return (
    <>
      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name="solutionId"
          render={({ field }) => {
            const stringValue = field.value ? String(field.value) : undefined;
            const isValidValue = stringValue && solutionOptions.some(opt => opt.value === stringValue);

            return (
              <FormItem>
                <FormLabel>Solution</FormLabel>
                <Select
                  key={`solution-${solutions.length}-${stringValue}`}
                  onValueChange={val => field.onChange(Number(val))}
                  value={isValidValue ? stringValue : undefined}
                  disabled={solutionsLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a solution" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {solutionOptions.map(option => (
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
        <FormField
          control={control}
          name="type"
          render={({ field }) => {
            const isValidValue = field.value && facilityTypeOptions.some(opt => opt.value === field.value);

            return (
              <FormItem>
                <FormLabel>Facility Type</FormLabel>
                <Select
                  key={`type-${field.value}`}
                  onValueChange={field.onChange}
                  value={isValidValue ? field.value : undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select facility type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {facilityTypeOptions.map(option => (
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
      </div>

      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
        <TextInput control={control} name="slug" label="Slug" placeholder="facility-slug" />
        <NumericInput control={control} name="order" label="Order" placeholder="Enter order" />
      </div>

      <TextInput control={control} name="title" label="Title" placeholder="Enter facility title" />

      <TextAreaInput
        control={control}
        name="summary"
        label="Summary"
        placeholder="Enter facility summary"
        className="min-h-[80px]"
      />

      <TextAreaInput
        control={control}
        name="description"
        label="Description"
        placeholder="Enter facility description"
        className="min-h-[100px]"
      />
    </>
  );
}
