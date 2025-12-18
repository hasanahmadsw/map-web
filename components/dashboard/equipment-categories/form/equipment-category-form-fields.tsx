'use client';

import { useFormContext } from 'react-hook-form';
import { TextInput } from '@/components/shared/input/TextInput';
import { TextAreaInput } from '@/components/shared/input/TextAreaInput';
import { SelectInput } from '@/components/shared/input/SelectInput';
import { CheckboxInput } from '@/components/shared/input/CheckboxInput';
import { NumericInput } from '@/components/shared/input/NumericInput';
import { EquipmentType } from '@/types/equipments/equipment.enum';

function EquipmentCategoryFormFields() {
  const { control } = useFormContext();

  const equipmentTypeOptions = Object.values(EquipmentType).map(type => ({
    value: type,
    label: type.charAt(0).toUpperCase() + type.slice(1),
  }));

  return (
    <>
      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
        <TextInput control={control} name="name" label="Name" placeholder="Enter category name" />

        <TextInput control={control} name="slug" label="Slug" placeholder="Enter slug" />

        <SelectInput
          control={control}
          name="type"
          label="Type"
          placeholder="Select type"
          options={equipmentTypeOptions}
        />

        <NumericInput control={control} name="order" label="Order" placeholder="Enter order" />
      </div>

      <TextAreaInput
        control={control}
        name="description"
        label="Description"
        placeholder="Enter description"
        className="min-h-[100px]"
      />

      <CheckboxInput control={control} name="isActive" label="Active" />
    </>
  );
}

export default EquipmentCategoryFormFields;
