'use client';

import { useFormContext } from 'react-hook-form';
import type { TCreateEquipmentForm } from '@/validations/equipments/create-equipment.schema';
import { MediaSelectInput } from '@/components/shared/input/MediaSelectInput';
import { MediaMultiSelectInput } from '@/components/shared/input/MediaMultiSelectInput';

function MediaStep() {
  const form = useFormContext<TCreateEquipmentForm>();

  return (
    <div className="space-y-8">
      {/* Cover Image */}
      <MediaSelectInput control={form.control} name="coverPath" label="Cover Image" typeFilter="image" />

      {/* Gallery Images */}
      <MediaMultiSelectInput
        control={form.control}
        name="galleryPaths"
        label="Gallery Images"
        typeFilter="image"
      />
    </div>
  );
}

export default MediaStep;
