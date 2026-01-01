'use client';

import { useFormContext } from 'react-hook-form';

import { TextInput } from '@/components/shared/input/TextInput';
import { TextAreaInput } from '@/components/shared/input/TextAreaInput';
import { SelectInput } from '@/components/shared/input/SelectInput';
import { NumericInput } from '@/components/shared/input/NumericInput';
import { CheckboxInput } from '@/components/shared/input/CheckboxInput';

import { EquipmentType } from '@/types/equipments/equipment.enum';
import type { TCreateEquipmentForm } from '@/validations/equipments/create-equipment.schema';
import type { TUpdateEquipmentForm } from '@/validations/equipments/update-equipment.schema';
import { CategorySelector } from '@/components/dashboard/common/selectors/category-selector';

import { BrandSelector } from '@/components/dashboard/common/selectors/brand-selector';

const equipmentTypeOptions = Object.values(EquipmentType).map(type => ({ value: type, label: type }));

interface BasicInfoStepProps {
  isEdit?: boolean;
}

type EquipmentFormBasicInfo = TCreateEquipmentForm | TUpdateEquipmentForm;

function BasicInfoStep({ isEdit = false }: BasicInfoStepProps) {
  const form = useFormContext<EquipmentFormBasicInfo>();

  return (
    <div className="space-y-6">
      {!isEdit && (
        <SelectInput
          control={form.control}
          name="equipmentType"
          label="Equipment Type"
          placeholder="Select equipment type"
          options={equipmentTypeOptions}
        />
      )}

      <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
        <TextInput control={form.control} name="slug" label="Slug" placeholder="equipment-slug" />
        <TextInput
          control={form.control}
          name="name"
          label="Name"
          placeholder="Equipment name"
          className="md:col-span-2"
        />
      </div>
      <TextAreaInput
        control={form.control}
        name="summary"
        label="Summary"
        placeholder="Brief summary of the equipment"
        rows={3}
        className="md:col-span-2"
      />

      <TextAreaInput
        control={form.control}
        name="description"
        label="Description"
        placeholder="Detailed description of the equipment"
        rows={6}
        className="md:col-span-2"
      />

      <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Category</label>
          <CategorySelector
            onValueChange={option => {
              form.setValue('categoryId', Number(option?.value) || 0);
              form.setValue('categoryLabel', option?.label || '');
            }}
            value={form.watch('categoryId')}
            valueLabel={form.watch('categoryLabel')}
          />
          {form.formState.errors.categoryId && (
            <p className="text-sm text-red-500">{form.formState.errors.categoryId.message as string}</p>
          )}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Brand</label>
          <BrandSelector
            onValueChange={option => {
              form.setValue('brandId', Number(option?.value) || 0);
              form.setValue('brandLabel', option?.label || '');
            }}
            value={form.watch('brandId')}
            valueLabel={form.watch('brandLabel')}
          />
          {form.formState.errors.brandId && (
            <p className="text-sm text-red-500">{form.formState.errors.brandId.message as string}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 md:col-span-2">
        <CheckboxInput
          control={form.control}
          name="isPublished"
          label="Published"
          description="Make this equipment visible to the public"
        />

        <CheckboxInput
          control={form.control}
          name="isFeatured"
          label="Featured"
          description="Feature this equipment prominently"
        />
      </div>
    </div>
  );
}

export default BasicInfoStep;
