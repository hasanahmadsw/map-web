import { Wrench } from 'lucide-react';

import EmptyState from '@/components/shared/data-states/empty-state';
import CustomPagination from '@/components/shared/pagination/custom-pagination';
import { equipmentsService } from '@/services/equipments/equipments.service';

import { EquipmentCard } from './equipment-card';
import { EquipmentParams } from '@/types/equipments/equipment.type';

interface EquipmentGridProps {
  equipmentParams: EquipmentParams;
}

export async function EquipmentGrid({ equipmentParams }: EquipmentGridProps) {
  let res;
  try {
    res = await equipmentsService.getAllPublic(equipmentParams);
  } catch {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">Failed to load equipment</p>
      </div>
    );
  }

  const equipments = res.data || [];
  const pagination = res.pagination;

  if (!equipments.length && equipmentParams.search) {
    return (
      <EmptyState type="no-filter-results" description={`No results found for "${equipmentParams.search}"`} />
    );
  } else if (!equipments.length) {
    return <EmptyState type="no-data" icon={<Wrench />} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {equipments.map((equipment, idx) => (
          <EquipmentCard key={equipment.id} equipment={equipment} priority={idx < 3} />
        ))}
      </div>

      {!!pagination && (
        <CustomPagination
          currentPage={pagination.currentPage}
          totalCount={pagination.total}
          pageSize={pagination.limit}
          className="mt-8"
        />
      )}
    </>
  );
}

export { EquipmentGridSkeleton } from './equipment-grid-skeleton';
