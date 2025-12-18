'use client';

import { useFormContext } from 'react-hook-form';

import { SelectInput } from '@/components/shared/input/SelectInput';
import { NumericInput } from '@/components/shared/input/NumericInput';
import { CheckboxInput } from '@/components/shared/input/CheckboxInput';

import { AudioCategory, MicrophonePattern } from '@/types/equipments/equipment.enum';
import type { TCreateEquipmentForm } from '@/validations/equipments/create-equipment.schema';

const categoryOptions = Object.values(AudioCategory).map(type => ({ value: type, label: type }));
const patternOptions = Object.values(MicrophonePattern).map(type => ({ value: type, label: type }));

function AudioSpecs() {
  const form = useFormContext<TCreateEquipmentForm>();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
        <SelectInput
          control={form.control}
          name="specs.category"
          label="Category"
          placeholder="Select audio category"
          options={categoryOptions}
        />

        <SelectInput
          control={form.control}
          name="specs.pattern"
          label="Microphone Pattern"
          placeholder="Select pattern (for microphones)"
          options={patternOptions}
        />

        <NumericInput
          control={form.control}
          name="specs.channels"
          label="Channels"
          placeholder="e.g., 2"
          allowFloat={false}
        />

        <div className="md:col-span-2">
          <CheckboxInput
            control={form.control}
            name="specs.phantomPower"
            label="Phantom Power"
            description="Check if phantom power is supported"
          />
        </div>
      </div>
    </div>
  );
}

export default AudioSpecs;
