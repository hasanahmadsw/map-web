'use client';

import { useFormContext } from 'react-hook-form';
import dynamic from 'next/dynamic';

import { EquipmentType } from '@/types/equipments/equipment.enum';
import type { TCreateEquipmentForm } from '@/validations/equipments/create-equipment.schema';
import FormSkeleton from '@/components/shared/skeletons/form-skeleton';

// Dynamic imports for spec components
const CameraSpecs = dynamic(() => import('../partials/camera-specs'), {
  ssr: false,
  loading: () => <FormSkeleton />,
});
const LensSpecs = dynamic(() => import('../partials/lens-specs'), {
  ssr: false,
  loading: () => <FormSkeleton />,
});
const LightSpecs = dynamic(() => import('../partials/light-specs'), {
  ssr: false,
  loading: () => <FormSkeleton />,
});
const AudioSpecs = dynamic(() => import('../partials/audio-specs'), {
  ssr: false,
  loading: () => <FormSkeleton />,
});
const AccessorySpecs = dynamic(() => import('../partials/accessory-specs'), {
  ssr: false,
  loading: () => <FormSkeleton />,
});

function SpecificationsStep() {
  const form = useFormContext<TCreateEquipmentForm>();
  const equipmentType = form.watch('equipmentType');

  return (
    <div className="space-y-6">
      {equipmentType === EquipmentType.CAMERA && <CameraSpecs />}
      {equipmentType === EquipmentType.LENS && <LensSpecs />}
      {equipmentType === EquipmentType.LIGHT && <LightSpecs />}
      {equipmentType === EquipmentType.AUDIO && <AudioSpecs />}
      {equipmentType === EquipmentType.ACCESSORY && <AccessorySpecs />}
    </div>
  );
}

export default SpecificationsStep;
