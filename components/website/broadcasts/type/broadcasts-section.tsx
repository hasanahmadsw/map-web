import { broadcastsService } from '@/services/broadcasts.service';

import { BroadcastUnitRowCard } from './broadcast-unit-row-card';

import EmptyState from '@/components/shared/data-states/empty-state';
import CustomPagination from '@/components/shared/pagination/custom-pagination';
import { Building2 } from 'lucide-react';
import { BroadcastType } from '@/types/broadcasts/broadcast.enums';
import { broadcastTypeSchema } from '@/utils/seo/schema/broadcasts/broadcast-type-schema';

interface BroadcastsSectionProps {
  page: number;
  limit: number;
  search: string;
  type?: `${BroadcastType}`;
  layout?: 'grid' | 'row';
  badgeText: string;
}

export async function BroadcastsSection({
  page,
  limit,
  search,
  type,
  layout = 'row',
  badgeText,
}: BroadcastsSectionProps) {
  let res;
  try {
    res = await broadcastsService.getAllUnitsPublic({
      search,
      page,
      limit,
      type: type,
    });
  } catch {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">Failed to load broadcast units</p>
      </div>
    );
  }

  const units = res.data || [];
  const pagination = res.pagination!;

  if (!units.length && search) {
    return <EmptyState type="no-filter-results" />;
  } else if (!units.length) {
    return <EmptyState type="no-data" icon={<Building2 />} />;
  }

  const jsonLd = await broadcastTypeSchema(units, type as BroadcastType, page);

  return (
    <>
      {/* JSON-LD */}
      <script
        id="broadcast-type-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-semibold md:text-4xl">{`Available ${badgeText} Units`}</h2>
          <p className="text-muted-foreground mt-2 text-base md:text-lg">{`Browse our collection of professional ${badgeText.toLowerCase()} broadcast units`}</p>
        </div>

        <div
          className={layout === 'row' ? 'space-y-6' : 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'}
        >
          {units.map(unit => (
            <BroadcastUnitRowCard key={unit.id} unit={unit} />
          ))}
        </div>

        <CustomPagination
          currentPage={pagination.currentPage}
          totalCount={pagination.total}
          pageSize={pagination.limit}
          className="mt-8"
        />
      </div>
    </>
  );
}

export { BroadcastsSectionSkeleton } from './broadcasts-section-skeleton';
