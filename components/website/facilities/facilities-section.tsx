import { facilitiesService } from '@/services/facilities.service';

import { FacilityCard } from './facility-card';

import EmptyState from '@/components/shared/data-states/empty-state';
import CustomPagination from '@/components/shared/pagination/custom-pagination';
import { Building2 } from 'lucide-react';

interface FacilitiesSectionProps {
  page: number;
  limit: number;
  search: string;
  type?: string;
  solutionId?: number;
}

export async function FacilitiesSection({
  page,
  limit,
  search,
  type,
  solutionId,
}: FacilitiesSectionProps) {
  let res;
  try {
    res = await facilitiesService.getAll({
      search,
      page,
      limit,
      type: type as any,
      solutionId,
    });
  } catch {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">Failed to load facilities</p>
      </div>
    );
  }

  const facilities = res.data || [];
  const pagination = res.pagination!;

  if (!facilities.length && search) {
    return <EmptyState type="no-filter-results" />;
  } else if (!facilities.length) {
    return <EmptyState type="no-data" icon={<Building2 />} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {facilities.map(facility => (
          <FacilityCard key={facility.id} facility={facility} />
        ))}
      </div>

      <CustomPagination
        currentPage={pagination.currentPage}
        totalCount={pagination.total}
        pageSize={pagination.limit}
        className="mt-8"
      />
    </>
  );
}

export { FacilitiesSectionSkeleton } from './facilities-section-skeleton';

