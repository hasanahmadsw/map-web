'use client';

import { useFormContext } from 'react-hook-form';

import { SelectInput } from '@/components/shared/input/SelectInput';
import { NumericInput } from '@/components/shared/input/NumericInput';
import { CheckboxGroupInput } from '@/components/shared/input/CheckboxGroupInput';

import { SensorType, ResolutionType, MountType, MediaFormat } from '@/types/equipments/equipment.enum';
import type { TCreateEquipmentForm } from '@/validations/equipments/create-equipment.schema';

const sensorOptions = Object.values(SensorType).map(type => ({ value: type, label: type }));
const resolutionOptions = Object.values(ResolutionType).map(type => ({ value: type, label: type }));
const mountOptions = Object.values(MountType).map(type => ({ value: type, label: type }));
const mediaOptions = Object.values(MediaFormat).map(type => ({ value: type, label: type }));

function CameraSpecs() {
  const form = useFormContext<TCreateEquipmentForm>();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
        <SelectInput
          control={form.control}
          name="specs.sensor"
          label="Sensor"
          placeholder="Select sensor type"
          options={sensorOptions}
        />

        <SelectInput
          control={form.control}
          name="specs.maxResolution"
          label="Max Resolution"
          placeholder="Select max resolution"
          options={resolutionOptions}
        />

        <NumericInput
          control={form.control}
          name="specs.maxFps"
          label="Max FPS"
          placeholder="e.g., 60"
          allowFloat={false}
        />

        <NumericInput
          control={form.control}
          name="specs.weightKg"
          label="Weight (kg)"
          placeholder="e.g., 2.5"
          allowFloat={true}
        />

        <SelectInput
          control={form.control}
          name="specs.media"
          label="Media Format"
          placeholder="Select media format"
          options={mediaOptions}
        />
      </div>

      <div>
        <CheckboxGroupInput
          control={form.control}
          name="specs.mounts"
          label="Mounts"
          description="Select all compatible mounts"
          options={mountOptions}
          gridCols="3"
        />
      </div>
    </div>
  );
}

export default CameraSpecs;
