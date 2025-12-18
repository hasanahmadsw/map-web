'use client';

import { useFormContext } from 'react-hook-form';
import dynamic from 'next/dynamic';

import { EquipmentType } from '@/types/equipments/equipment.enum';
import type { TCreateEquipmentForm } from '@/validations/equipments/create-equipment.schema';
import type { TUpdateEquipmentForm } from '@/validations/equipments/update-equipment.schema';
import type { IEquipmentSpecs } from '@/types/equipments/equipment.type';
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

interface SpecificationsStepProps {
  equipmentType?: `${EquipmentType}`;
}

type EquipmentFormSpecs = TCreateEquipmentForm | TUpdateEquipmentForm;

function SpecificationsStep({ equipmentType: propEquipmentType }: SpecificationsStepProps) {
  const form = useFormContext<EquipmentFormSpecs>();
  const formSpecs = form.watch('specs');
  const formEquipmentType = formSpecs?.type;
  const equipmentType = propEquipmentType || formEquipmentType;

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
