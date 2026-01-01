'use client';

import { useEquipmentById } from '@/hooks/api/equipments/use-equipments';
import ApiError from '@/components/shared/api-error';
import EquipmentHero from './equipment-hero';
import EquipmentDescription from './equipment-description';
import EquipmentSpecs from './equipment-specs';
import EquipmentGallery from './equipment-gallery';
import EquipmentInfoSidebar from './equipment-info-sidebar';
import EquipmentViewSkeleton from './equipment-view-skeleton';

interface EquipmentViewProps {
  equipmentId: string | number;
}

function EquipmentView({ equipmentId }: EquipmentViewProps) {
  const { equipment, isLoading, isError, error, refetch } = useEquipmentById(equipmentId);

  if (isLoading) {
    return <EquipmentViewSkeleton />;
  }

  if (isError || !equipment) {
    return <ApiError errorMessage={error || 'Failed to load equipment'} refetchFunction={refetch} />;
  }

  return (
    <div className="space-y-6">
      <EquipmentHero equipment={equipment} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          <EquipmentDescription description={equipment.description} />
          <EquipmentSpecs specs={equipment.specs} equipmentType={equipment.equipmentType} />
          {equipment.gallery && equipment.gallery.length > 0 && (
            <EquipmentGallery gallery={equipment.gallery} equipmentName={equipment.name} />
          )}
        </div>

        {/* Sidebar */}
        <EquipmentInfoSidebar equipment={equipment} />
      </div>
    </div>
  );
}

export default EquipmentView;
