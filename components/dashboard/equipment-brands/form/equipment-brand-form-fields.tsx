'use client';

import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { TextInput } from '@/components/shared/input/TextInput';
import { CheckboxInput } from '@/components/shared/input/CheckboxInput';
import { NumericInput } from '@/components/shared/input/NumericInput';

function EquipmentBrandFormFields() {
  const { control } = useFormContext();

  return (
    <>
      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
        <TextInput control={control} name="name" label="Name" placeholder="Enter brand name" />

        <TextInput control={control} name="slug" label="Slug" placeholder="Enter slug" />
      </div>
      <NumericInput control={control} name="order" label="Order" placeholder="Enter order" />

      <CheckboxInput control={control} name="isActive" label="Active" />
    </>
  );
}

export default EquipmentBrandFormFields;
