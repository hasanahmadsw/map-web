'use client';

import { useFormContext } from 'react-hook-form';

import { SelectInput } from '@/components/shared/input/SelectInput';
import { NumericInput } from '@/components/shared/input/NumericInput';
import { CheckboxInput } from '@/components/shared/input/CheckboxInput';

import { MountType } from '@/types/equipments/equipment.enum';
import type { TCreateEquipmentForm } from '@/validations/equipments/create-equipment.schema';

const mountOptions = Object.values(MountType).map(type => ({ value: type, label: type }));

function LensSpecs() {
  const form = useFormContext<TCreateEquipmentForm>();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
        <SelectInput
          control={form.control}
          name="specs.mount"
          label="Mount"
          placeholder="Select mount type"
          options={mountOptions}
        />

        <NumericInput
          control={form.control}
          name="specs.weightG"
          label="Weight (g)"
          placeholder="e.g., 500"
          allowFloat={true}
        />

        <div className="md:col-span-2">
          <CheckboxInput
            control={form.control}
            name="specs.isZoom"
            label="Zoom Lens"
            description="Check if this is a zoom lens"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Focal Length (mm)</h3>
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
          <NumericInput
            control={form.control}
            name="specs.focalLengthMm.min"
            label="Min Focal Length (mm)"
            placeholder="e.g., 24"
            allowFloat={true}
          />

          <NumericInput
            control={form.control}
            name="specs.focalLengthMm.max"
            label="Max Focal Length (mm)"
            placeholder="e.g., 70"
            allowFloat={true}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Aperture (T-stop)</h3>
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
          <NumericInput
            control={form.control}
            name="specs.aperture.minT"
            label="Min Aperture (T)"
            placeholder="e.g., 2.8"
            allowFloat={true}
          />

          <NumericInput
            control={form.control}
            name="specs.aperture.maxT"
            label="Max Aperture (T)"
            placeholder="e.g., 22"
            allowFloat={true}
          />
        </div>
      </div>
    </div>
  );
}

export default LensSpecs;
