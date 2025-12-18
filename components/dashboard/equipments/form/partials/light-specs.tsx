'use client';

import { useFormContext } from 'react-hook-form';

import { SelectInput } from '@/components/shared/input/SelectInput';
import { NumericInput } from '@/components/shared/input/NumericInput';
import { CheckboxInput } from '@/components/shared/input/CheckboxInput';

import { LightMountType } from '@/types/equipments/equipment.enum';
import type { TCreateEquipmentForm } from '@/validations/equipments/create-equipment.schema';

const mountOptions = Object.values(LightMountType).map(type => ({ value: type, label: type }));

function LightSpecs() {
  const form = useFormContext<TCreateEquipmentForm>();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
        <NumericInput
          control={form.control}
          name="specs.powerW"
          label="Power (W)"
          placeholder="e.g., 100"
          allowFloat={false}
        />

        <SelectInput
          control={form.control}
          name="specs.mount"
          label="Mount"
          placeholder="Select mount type"
          options={mountOptions}
        />

        <div className="md:col-span-2">
          <CheckboxInput
            control={form.control}
            name="specs.hasRgb"
            label="RGB Capable"
            description="Check if this light supports RGB color"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Color Temperature (K)</h3>
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
          <NumericInput
            control={form.control}
            name="specs.colorTempK.min"
            label="Min Color Temperature (K)"
            placeholder="e.g., 3000"
            allowFloat={false}
          />

          <NumericInput
            control={form.control}
            name="specs.colorTempK.max"
            label="Max Color Temperature (K)"
            placeholder="e.g., 6500"
            allowFloat={false}
          />
        </div>
      </div>
    </div>
  );
}

export default LightSpecs;
