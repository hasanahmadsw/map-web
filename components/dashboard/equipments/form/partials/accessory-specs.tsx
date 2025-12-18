'use client';

import { useFormContext } from 'react-hook-form';

import { TextAreaInput } from '@/components/shared/input/TextAreaInput';

import type { TCreateEquipmentForm } from '@/validations/equipments/create-equipment.schema';

function AccessorySpecs() {
  const form = useFormContext<TCreateEquipmentForm>();

  return (
    <div className="space-y-6">
      <TextAreaInput
        control={form.control}
        name="specs.notes"
        label="Notes"
        placeholder="Additional notes or specifications for this accessory"
        rows={6}
      />
    </div>
  );
}

export default AccessorySpecs;
