import { Wrench } from 'lucide-react';
import EmptyState from '@/components/shared/data-states/empty-state';
import CustomPagination from '@/components/shared/pagination/custom-pagination';
import { equipmentsService } from '@/services/equipments/equipments.service';
import { EquipmentCard } from '@/components/website/equipments/equipment-card';
import type { EquipmentParams } from '@/types/equipments/equipment.type';
import type { EquipmentFilters } from '@/types/intents/intent.type';

interface IntentEquipmentGridProps {
  equipmentFilters: EquipmentFilters | null;
  searchParams: Record<string, string>;
}

function mergeParams(
  base: EquipmentFilters | null,
  search: Record<string, string>,
): Record<string, string | number | undefined> {
  const params: Record<string, string | number | undefined> = {
    page: parseInt(search.page || '1', 10),
    limit: parseInt(search.limit || '12', 10),
    search: search.search || undefined,
  };

  if (base) {
    if (base.categoryId) params.categoryId = base.categoryId;
    if (base.brandId) params.brandId = base.brandId;
    if (base.equipmentType) params.equipmentType = base.equipmentType;
    if (base.category) params.category = base.category;
    if (base.brand) params.brand = base.brand;
    if (base.isFeatured !== undefined) params.isFeatured = base.isFeatured ? 'true' : undefined;
  }

  if (search.equipmentType) params.equipmentType = search.equipmentType;
  if (search.category) params.category = search.category;
  if (search.brand) params.brand = search.brand;
  if (search.isFeatured) params.isFeatured = search.isFeatured;
  if (search.categoryId) params.categoryId = parseInt(search.categoryId, 10);
  if (search.brandId) params.brandId = parseInt(search.brandId, 10);

  return params;
}

export async function IntentEquipmentGrid({
  equipmentFilters,
  searchParams,
}: IntentEquipmentGridProps) {
  const equipmentParams = mergeParams(equipmentFilters, searchParams);

  let res;
  try {
    res = await equipmentsService.getAllPublic(equipmentParams as Parameters<typeof equipmentsService.getAllPublic>[0]);
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
      <EmptyState
        type="no-filter-results"
        description={`No results found for "${equipmentParams.search}"`}
      />
    );
  }
  if (!equipments.length) {
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
